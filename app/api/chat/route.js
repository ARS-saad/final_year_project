import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Primary model, plus free fallbacks OpenRouter will try automatically if
// the primary is rate-limited/down (different providers behind each, so a
// shared-pool 429 on one rarely hits all three at once).
const MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
];

// Matches a trailing marker like [BOOK:3f9c1a2e-...] that the model emits
// once the traveler has clearly picked a tour to book.
const BOOK_MARKER = /\s*\[BOOK:([a-f0-9-]{36})\]\s*$/i;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not set in .env.local' },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    // Ground the assistant in what's actually bookable right now.
    const supabase = await createClient();
    const { data: tours } = await supabase
      .from('tours')
      .select('id, title, country, days, price, rating, description')
      .eq('is_published', true);

    const tourList = (tours ?? [])
      .map(
        (t) =>
          `- id: ${t.id} | ${t.title} (${t.country}, ${t.days} days, $${t.price}/person, ${t.rating}★): ${t.description ?? ''}`
      )
      .join('\n');

    const systemPrompt = `You are the FloraFlyers travel assistant, a friendly and knowledgeable AI trip planner embedded in the FloraFlyers tourist agency website.

Currently bookable tours (each has a unique id — never invent or guess an id, only use ids exactly as listed here):
${tourList || '(no tours currently published)'}

Guidelines:
- Recommend real tours from the list above when they fit what the traveler is asking for. Mention title, country, days, and price when relevant.
- If nothing in the list fits (wrong region, budget, etc.), say so honestly and suggest the closest alternative from the list, or explain what kind of trip you'd need to find for them.
- Ask a clarifying question when the request is vague (budget, dates, number of travelers, interests).
- Keep replies concise and conversational — a few short paragraphs at most, plain text (no markdown symbols like ** or #), since this renders in a plain chat bubble.
- You cannot check real-time availability beyond the list above, and you cannot actually charge any payment yourself — be upfront about that if asked. HOWEVER, you CAN send the traveler to the real checkout page on this website, and you MUST do this whenever they've clearly settled on one specific tour and want to book, pay, or check out.
- To send them to checkout: end your reply with a line in EXACTLY this format, using the real id from the list above: [BOOK:<id>]
  Example final line: [BOOK:3f9c1a2e-4b2d-4a1e-9c3d-1a2b3c4d5e6f]
- Only include the [BOOK:...] line once the traveler has clearly chosen a specific tour (by name or by clearly confirming your suggestion). Never include it while still narrowing down options, and never say you "can't provide a link" — instead, either ask which tour they want, or include the [BOOK:...] marker if they've already told you.
- Never show the raw [BOOK:...] text as an explanation to the user — it's a hidden system marker the website reads, not something to describe or apologize for.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // Recommended by OpenRouter for attribution / free-tier routing.
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'FloraFlyers',
      },
      body: JSON.stringify({
        models: MODELS,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', response.status, errText);

      let friendlyMessage = `OpenRouter request failed (${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        const retryAfter = parsed?.error?.metadata?.retry_after_seconds;
        if (response.status === 429) {
          friendlyMessage = retryAfter
            ? `All free models are busy right now — try again in about ${retryAfter} seconds.`
            : 'All free models are busy right now — try again in a few seconds.';
        }
      } catch {
        // errText wasn't JSON — fall back to the generic message above.
      }

      return NextResponse.json({ error: friendlyMessage }, { status: 502 });
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't come up with a reply just now.";

    // Pull out the booking marker (if present), validate it's a real tour,
    // and strip it from the text shown to the user.
    let bookTourId = null;
    let bookTourTitle = null;
    const match = reply.match(BOOK_MARKER);
    if (match) {
      const candidateId = match[1];
      const matchedTour = (tours ?? []).find((t) => t.id === candidateId);
      if (matchedTour) {
        bookTourId = matchedTour.id;
        bookTourTitle = matchedTour.title;
      }
      reply = reply.replace(BOOK_MARKER, '').trim();
    }

    return NextResponse.json({ reply, bookTourId, bookTourTitle });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

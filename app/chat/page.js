'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: "Hi Jamal 👋 I'm your VoyageAI travel assistant. Tell me your destination, budget, or trip dates, and I'll build a personalized plan for you.",
    chips: ['Plan a 5-day trip', 'Find cheap flights', 'Best beaches in Asia'],
  },
  {
    id: 2,
    role: 'user',
    text: '5 days in Kyoto under $1500, mid-October, 2 people.',
  },
  {
    id: 3,
    role: 'ai',
    text: "Great timing — mid-October is peak autumn foliage season in Kyoto. Here's a draft plan for 2 people, total estimate $1,420:",
    plan: [
      { day: 'DAY 1', desc: 'Arrival + Fushimi Inari Shrine' },
      { day: 'DAY 2', desc: 'Arashiyama Bamboo Grove + Kinkaku-ji' },
      { day: 'DAY 3', desc: 'Gion District + Tea Ceremony' },
      { day: 'DAY 4', desc: 'Nara day trip (deer park)' },
      { day: 'DAY 5', desc: 'Nishiki Market + departure' },
    ],
    total: '$1,420',
    chips: ['Book this plan', 'Make it cheaper', 'Add more adventure'],
  },
];

const history = [
  'Kyoto 5-day plan under $1500',
  'Family trip to Cox\u2019s Bazar',
  'Best time to visit Bali',
  'Budget backpacking Europe',
  'Visa requirements for Japan',
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    // Dummy AI reply — replace with a real API call to your AI agent / Supabase edge function
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: "Sure — here's a lower-cost version of the plan. Swapping the Gion tea ceremony for a self-guided walk and using local trains instead of taxis brings the total down to around $1,180.",
          chips: ['Book this plan', 'Show original plan', 'Add a day'],
        },
      ]);
    }, 1400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar activeChat />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 p-5 flex-col flex-shrink-0">
          <button className="flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-sm2 font-semibold text-sm mb-6 hover:bg-[#2d3f59] transition">
            + New Chat
          </button>
          <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
            Recent Conversations
          </div>
          {history.map((h, i) => (
            <div
              key={h}
              className={`px-3 py-2.5 rounded-sm2 text-sm mb-1 cursor-pointer truncate transition ${
                i === 0
                  ? 'bg-alert-success-bg text-alert-success-text font-semibold'
                  : 'text-gray-600 hover:bg-lightbg'
              }`}
            >
              {h}
            </div>
          ))}
          <div className="mt-auto border-t border-gray-100 pt-4 flex items-center gap-2.5 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              JU
            </div>
            Jamal Uddin
          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="px-7 py-4 border-b border-gray-200 bg-white flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-hover flex items-center justify-center text-lg flex-shrink-0">
              ✨
            </div>
            <div>
              <div className="font-bold text-sm">VoyageAI Assistant</div>
              <div className="text-xs text-teal-hover flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Online — ready to plan your trip
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 flex flex-col gap-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'self-end flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    m.role === 'ai'
                      ? 'bg-gradient-to-br from-teal to-teal-hover text-white'
                      : 'bg-navy text-white font-bold text-xs'
                  }`}
                >
                  {m.role === 'ai' ? '✨' : 'JU'}
                </div>
                <div>
                  <div
                    className={`px-[18px] py-[14px] rounded-md2 text-sm leading-relaxed ${
                      m.role === 'ai'
                        ? 'bg-white border border-gray-200 rounded-tl-[4px]'
                        : 'bg-teal text-white rounded-tr-[4px]'
                    }`}
                  >
                    {m.text}

                    {m.plan && (
                      <div className="mt-3 border border-gray-200 rounded-sm2 overflow-hidden">
                        {m.plan.map((p) => (
                          <div
                            key={p.day}
                            className="flex justify-between items-center px-3.5 py-2.5 text-sm border-b border-gray-100 last:border-b-0"
                          >
                            <span className="font-mono text-xs font-bold text-teal-hover">{p.day}</span>
                            <span>{p.desc}</span>
                          </div>
                        ))}
                        <div className="bg-lightbg px-3.5 py-2.5 flex justify-between items-center font-bold text-sm">
                          Estimated total <span className="text-coral">{m.total}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {m.chips && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {m.chips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="border-[1.5px] border-teal text-teal-hover bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-teal hover:text-white transition"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-2xl">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-teal to-teal-hover text-white flex items-center justify-center text-sm flex-shrink-0">
                  ✨
                </div>
                <div className="flex gap-1 bg-white border border-gray-200 rounded-md2 rounded-tl-[4px] px-[18px] py-4 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* COMPOSER */}
          <div className="px-7 pt-4 pb-6 bg-lightbg border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              {['🏖 Beach getaways', '💰 Under $500', '🗓 This weekend'].map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="bg-white border border-gray-200 px-3.5 py-2 rounded-full text-sm text-gray-600 hover:border-teal hover:text-teal-hover transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-full pl-[22px] pr-1.5 py-1.5 flex items-center gap-2.5 shadow-sm border border-gray-200"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask VoyageAI anything, e.g. "3 days in Sylhet under $200"'
                className="flex-1 outline-none text-sm bg-transparent py-2.5"
              />
              <button
                type="submit"
                className="w-[42px] h-[42px] rounded-full bg-teal text-white flex items-center justify-center text-lg hover:bg-teal-hover transition flex-shrink-0"
              >
                ➤
              </button>
            </form>
            <div className="text-center text-xs text-gray-400 mt-2.5">
              VoyageAI can make mistakes. Verify important trip details before booking.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

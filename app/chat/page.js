'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

const greeting = {
  id: 'greeting',
  role: 'ai',
  text: "Hi! I'm your FloraFlyers travel assistant. Tell me your destination, budget, or trip dates, and I'll help you find the right tour.",
};

const quickSuggestions = ['🏖 Beach getaways', '💰 Under $500', '🗓 This weekend'];

export default function ChatPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [retryState, setRetryState] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from('chat_conversations')
          .select('id, title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(20);
        setHistory(data ?? []);
      }
    }
    init();
  }, [supabase]);

  const loadConversation = async (id) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content, metadata')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    setMessages(
      (data ?? []).map((m, i) => ({
        id: `${id}-${i}`,
        role: m.role,
        text: m.content,
        bookTourId: m.metadata?.bookTourId || null,
        bookTourTitle: m.metadata?.bookTourTitle || null,
      }))
    );
    setConversationId(id);
  };

  const startNewChat = () => {
    setMessages([greeting]);
    setConversationId(null);
    setError('');
  };

  const persistMessage = async (convId, role, content, metadata = null) => {
    await supabase.from('chat_messages').insert({ conversation_id: convId, role, content, metadata });
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');

    let activeConversationId = conversationId;

    // Create the conversation row on the first message of a new chat (logged-in users only).
    if (user && !activeConversationId) {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, title: trimmed.slice(0, 60) })
        .select()
        .single();
      if (newConv) {
        activeConversationId = newConv.id;
        setConversationId(newConv.id);
        setHistory((prev) => [{ id: newConv.id, title: newConv.title, updated_at: newConv.created_at }, ...prev]);
      }
    }

    if (user && activeConversationId) {
      await persistMessage(activeConversationId, 'user', trimmed);
    }

    await callAssistant(nextMessages, activeConversationId);
  };

  // Separated from sendMessage so a failed request can be retried without
  // re-appending the user's message or re-persisting it a second time.
  const callAssistant = async (messagesSoFar, activeConversationId) => {
    setIsTyping(true);
    setError('');
    setRetryState(null);

    try {
      const apiMessages = messagesSoFar
        .filter((m) => m.id !== 'greeting')
        .map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong talking to the assistant.');
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
        bookTourId: data.bookTourId || null,
        bookTourTitle: data.bookTourTitle || null,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (user && activeConversationId) {
        await persistMessage(
          activeConversationId,
          'ai',
          data.reply,
          data.bookTourId ? { bookTourId: data.bookTourId, bookTourTitle: data.bookTourTitle } : null
        );
        await supabase
          .from('chat_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', activeConversationId);
      }
    } catch (err) {
      setError(err.message);
      setRetryState({ messagesSoFar, activeConversationId });
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (retryState) {
      setRetryState(null);
      callAssistant(retryState.messagesSoFar, retryState.activeConversationId);
    }
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
          <button
            onClick={startNewChat}
            className="flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-sm2 font-semibold text-sm mb-6 hover:bg-[#2d3f59] transition"
          >
            + New Chat
          </button>

          {user ? (
            <>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                Recent Conversations
              </div>
              {history.length === 0 && (
                <p className="text-sm text-gray-400">No conversations yet — say hi!</p>
              )}
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => loadConversation(h.id)}
                  className={`px-3 py-2.5 rounded-sm2 text-sm mb-1 cursor-pointer truncate transition ${
                    h.id === conversationId
                      ? 'bg-alert-success-bg text-alert-success-text font-semibold'
                      : 'text-gray-600 hover:bg-lightbg'
                  }`}
                >
                  {h.title}
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Log in to save your conversations and pick up where you left off.
            </p>
          )}

          {user && (
            <div className="mt-auto border-t border-gray-100 pt-4 flex items-center gap-2.5 text-sm text-gray-500">
              <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {(user.user_metadata?.full_name || user.email)[0].toUpperCase()}
              </div>
              {user.user_metadata?.full_name || user.email}
            </div>
          )}
        </aside>

        {/* MAIN CHAT */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="px-7 py-4 border-b border-gray-200 bg-white flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-hover flex items-center justify-center text-lg flex-shrink-0">
              ✨
            </div>
            <div>
              <div className="font-bold text-sm">FloraFlyers Assistant</div>
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
                  {m.role === 'ai' ? '✨' : (user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div
                    className={`px-[18px] py-[14px] rounded-md2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'ai'
                        ? 'bg-white border border-gray-200 rounded-tl-[4px]'
                        : 'bg-teal text-white rounded-tr-[4px]'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.bookTourId && (
                    <Link
                      href={`/checkout?tour=${m.bookTourId}`}
                      className="mt-2.5 inline-flex items-center gap-2 bg-coral text-white font-semibold text-sm px-4 py-2.5 rounded-sm2 hover:brightness-95 transition"
                    >
                      💳 Proceed to Payment{m.bookTourTitle ? ` — ${m.bookTourTitle}` : ''}
                    </Link>
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

            {error && (
              <div className="flex items-center gap-2.5 bg-alert-error-bg text-alert-error-text border-l-4 border-red-400 rounded-sm2 px-4 py-3 text-sm max-w-2xl">
                <span>⚠</span>
                <div className="flex-1">{error}</div>
                {retryState && (
                  <button
                    onClick={handleRetry}
                    className="flex-shrink-0 bg-white border border-alert-error-text text-alert-error-text font-semibold px-3 py-1.5 rounded-sm2 text-xs hover:bg-alert-error-text hover:text-white transition"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* COMPOSER */}
          <div className="px-7 pt-4 pb-6 bg-lightbg border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              {quickSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={isTyping}
                  className="bg-white border border-gray-200 px-3.5 py-2 rounded-full text-sm text-gray-600 hover:border-teal hover:text-teal-hover transition disabled:opacity-50"
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
                placeholder='Ask FloraFlyers anything, e.g. "3 days in Sylhet under $200"'
                className="flex-1 outline-none text-sm bg-transparent py-2.5"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-[42px] h-[42px] rounded-full bg-teal text-white flex items-center justify-center text-lg hover:bg-teal-hover transition flex-shrink-0 disabled:opacity-50"
              >
                ➤
              </button>
            </form>
            <div className="text-center text-xs text-gray-400 mt-2.5">
              FloraFlyers can make mistakes. Verify important trip details before booking.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

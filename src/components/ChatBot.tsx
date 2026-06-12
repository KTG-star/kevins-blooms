import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { MessageCircle, X, Send, Sparkles, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const quickActions = [
  { label: "🌹 Flower Meanings", query: "What do different flowers mean? I need help choosing the right message." },
  { label: "🎁 Occasion Help", query: "I need flower recommendations for an occasion. Can you help me choose?" },
  { label: "💐 Budget Picks", query: "I'm looking for flowers under ₦10,000. What do you recommend?" },
  { label: "🚚 Track Order", query: "How can I track my delivery? Where is my order?" },
  { label: "💌 Add a Card?", query: "Can I add a personalized card message or chocolates to my order?" },
  { label: "😢 Sympathy", query: "What flowers are appropriate for a funeral or sympathy?" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: "🌸 Hi there! I'm Bloom, your floral assistant at Kelvin's Blooms. Ask me about flower meanings, occasion ideas, order tracking, or anything floral!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

      const { data } = await axios.post(`${API_URL}/ai/chat`, {
        message: text.trim(),
        history,
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: data.reply || "I'm sorry, I couldn't process that. Could you rephrase?",
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallback: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: "I'm having trouble connecting right now. Please try again or reach us on WhatsApp! 💚",
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-8 z-[60] flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0d0d14] rounded-3xl shadow-2xl border border-bloom-pink/20 dark:border-white/10 overflow-hidden"
              style={{ maxHeight: 'min(600px, calc(100vh - 160px))' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-bloom-green to-bloom-green/90 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight font-cormorant">Bloom</h3>
                    <p className="text-white/70 text-xs">Your Floral Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="p-4 overflow-y-auto flex-1" style={{ height: '360px' }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-bloom-green text-white rounded-br-md'
                          : 'bg-bloom-cream dark:bg-white/5 text-[var(--text-primary)] rounded-bl-md border border-bloom-pink/10 dark:border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-bloom-cream dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md border border-bloom-pink/10 dark:border-white/5">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-bloom-green/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-bloom-green/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-bloom-green/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 font-bold">
                    Quick Help
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(action.query)}
                        className="text-xs px-3 py-1.5 rounded-full border border-bloom-pink/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-bloom-pink/10 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 bg-bloom-cream dark:bg-white/5 rounded-2xl px-4 py-2 border border-gray-200 dark:border-white/10">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder-gray-400 dark:placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="text-bloom-green disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform p-1"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-8 right-8 z-[60] bg-bloom-green text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-bloom-green px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with Bloom 🌸
        </span>
      </button>
    </>
  );
}

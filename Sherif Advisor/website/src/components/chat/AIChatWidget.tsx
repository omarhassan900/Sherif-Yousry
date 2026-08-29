'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * AI Chat Assistant Widget
 * 
 * Future capabilities:
 * - Tax regulation Q&A
 * - Document requirement guidance
 * - Appointment booking
 * - Service recommendation
 * - Multilingual support (AR/EN)
 * 
 * Security:
 * - No sensitive data in chat history
 * - Session-bound conversations
 * - Rate limited API calls
 * - Input sanitization
 */
export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'مرحباً! أنا مساعدك الذكي من شريف يسري للاستشارات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Connect to AI backend API
    // For now, show a placeholder response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'شكراً لتواصلك. هذه الخاصية قيد التطوير حالياً. يمكنك التواصل مع فريقنا مباشرة عبر نموذج الاتصال أو الهاتف.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center shadow-lg hover:bg-brand-gold-light transition-all hover:scale-105"
        aria-label={isOpen ? 'إغلاق المحادثة' : 'فتح المحادثة'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[360px] max-h-[500px] bg-brand-navy-deep border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-brand-navy px-5 py-4 flex items-center gap-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-gold" />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">
                المساعد الذكي
              </p>
              <p className="text-[10px] text-text-muted">متاح ٢٤/٧</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[320px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-6 ${
                    msg.role === 'user'
                      ? 'bg-brand-gold/10 text-text-primary'
                      : 'bg-brand-navy text-text-secondary'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-brand-navy px-4 py-2.5 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brand-gold/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-brand-gold/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-brand-gold/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-brand-navy/50 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded bg-brand-gold text-brand-navy flex items-center justify-center disabled:opacity-50 hover:bg-brand-gold-light transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

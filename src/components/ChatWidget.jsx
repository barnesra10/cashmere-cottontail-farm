import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Bot, Phone, Mail } from 'lucide-react';

const SYSTEM_PROMPT = `You are the friendly AI assistant for Cashmere Cottontail Farm. You help visitors learn about the farm and its animals.

The farm breeds:
- Valais Blacknose Sheep — luxury Swiss breed known for black faces and spiral horns
- Pygmy Goats — compact, playful, stocky companions bred to NPGA standards
- Mini Rex Rabbits — famous for incredibly plush, velvety fur (3–4.5 lbs)
- Miniature Dachshunds — health-tested, home-raised, under 11 lbs
- Silkie Chickens — specializing in satin mottled, black splits from mottled, and mottled varieties

The farm also grows organic produce sold to clients.

Mission: Provide any family with the luxury or boutique animal of their dreams — show quality or the best companion. Every animal born to a purpose.

Be warm, knowledgeable, and helpful. If you don't know something specific (like pricing or current availability), encourage the visitor to contact the farm directly. Keep responses concise (2-3 sentences usually). If someone wants to talk to a human, provide directions to the contact page.`;

export default function ChatWidget({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! 👋 Welcome to Cashmere Cottontail Farm. I can help you learn about our animals, availability, or anything else. What can I help you with?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [wantsHuman, setWantsHuman] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation for API (skip the initial greeting which is static)
      const apiMessages = newMessages
        .filter((_, i) => i > 0) // skip the static greeting
        .map(m => ({ role: m.role, content: m.content }));

      // If only one message (the user's first), add it properly
      if (apiMessages.length === 1) {
        // just the user message
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: apiMessages.length > 0 ? apiMessages : [{ role: 'user', content: input.trim() }]
        })
      });

      const data = await response.json();
      const reply = data.content?.map(b => b.text || '').join('') || "I'm having trouble connecting right now. Please try the contact page to reach us directly!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a little trouble right now. You can reach us directly through our contact page — we'd love to hear from you!"
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-[340px] sm:w-[380px] max-h-[500px] flex flex-col border border-cream-200 overflow-hidden">
      {/* Header */}
      <div className="bg-sage-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="font-display text-sm font-semibold">Cashmere Cottontail Farm</p>
          <p className="text-xs opacity-80">Ask us anything!</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWantsHuman(true)} className="text-white/70 hover:text-white p-1" title="Talk to a human">
            <Phone className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-cream-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-sage-600" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-sage-500 text-white rounded-br-md'
                : 'bg-white text-charcoal-600 border border-cream-200 rounded-bl-md shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-sage-600" />
            </div>
            <div className="bg-white border border-cream-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Human contact option */}
        {wantsHuman && (
          <div className="bg-wheat-100 border border-wheat-300 rounded-xl p-3 text-sm">
            <p className="font-semibold text-charcoal-600 mb-2">Reach us directly:</p>
            <a href="/contact" className="flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium">
              <Mail className="w-4 h-4" /> Visit our Contact page
            </a>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-cream-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 text-sm bg-cream-50 border border-cream-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-300 text-charcoal-600 placeholder:text-charcoal-200"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white rounded-full p-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

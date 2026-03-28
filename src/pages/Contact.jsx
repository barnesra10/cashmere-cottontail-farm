import { useState } from 'react';
import { Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { submitContact } from '../hooks/useData';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    const { error } = await submitContact(form);
    if (!error) setSubmitted(true);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Cashmere Cottontail Farm." path="/contact" />
      <section className="bg-charcoal-700 plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Get In <span className="font-script text-wheat-400 font-normal">Touch</span></h1>
          <p className="mt-3 font-body text-cream-200/80">Questions about our animals? Want to join a waiting list? We'd love to hear from you.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-sage-50 border border-sage-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-sage-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Message Sent!</h2>
                <p className="font-body text-charcoal-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal-600 mb-6">Send Us a Message</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-500 font-body mb-1">Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-500 font-body mb-1">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-500 font-body mb-1">Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-500 font-body mb-1">Interested In</label>
                      <select name="interest" value={form.interest} onChange={handleChange} className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-300">
                        <option value="">Select...</option>
                        <option value="valais-blacknose">Valais Blacknose Sheep</option>
                        <option value="pygmy-goats">Pygmy Goats</option>
                        <option value="mini-rex">Mini Rex Rabbits</option>
                        <option value="mini-dachshunds">Miniature Dachshunds</option>
                        <option value="silkie-chickens">Silkie Chickens</option>
                        <option value="produce">Organic Produce</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-500 font-body mb-1">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none" placeholder="Tell us about what you're looking for..." />
                  </div>
                  <button onClick={handleSubmit} className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-cream-100 rounded-2xl p-6 border border-cream-200">
              <h3 className="font-display text-lg font-semibold text-charcoal-600 mb-4">Quick Help</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal-600">AI Assistant</p>
                    <p className="font-body text-xs text-charcoal-400">Click the chat bubble for instant answers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal-600">Email</p>
                    <p className="font-body text-xs text-charcoal-400">info@cashmerecottontailfarm.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal-600">Response Time</p>
                    <p className="font-body text-xs text-charcoal-400">Usually within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-wheat-50 rounded-2xl p-6 border border-wheat-200">
              <h3 className="font-display text-lg font-semibold text-charcoal-600 mb-2">Follow Us</h3>
              <p className="font-body text-xs text-charcoal-400 mb-3">Stay updated on new arrivals and farm life.</p>
              <div className="space-y-2">
                <a href="https://facebook.com" target="_blank" rel="noopener" className="block font-body text-sm text-sage-600 hover:text-sage-700 font-medium">Facebook →</a>
                <a href="https://instagram.com" target="_blank" rel="noopener" className="block font-body text-sm text-sage-600 hover:text-sage-700 font-medium">Instagram →</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener" className="block font-body text-sm text-sage-600 hover:text-sage-700 font-medium">TikTok →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

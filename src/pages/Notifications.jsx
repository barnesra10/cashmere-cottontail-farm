import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import SEO from '../components/SEO';

export default function Notifications() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState([]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (i) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const submit = async () => {
    if (!consent || (!phone && !email)) return;
    const SUPABASE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co';
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6em9ma2VmYnJxdnNma3dvamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTUwNjMsImV4cCI6MjA5MDI5MTA2M30.euvg_NuoNi_tgioOJFB2nvV7Cbe1J5_-veE8Z3Qw0JY';
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: 'POST',
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name: name || null, phone: phone || null, email: email || null, notify_sms: !!phone, notify_email: !!email, notify_new_litters: interests.includes('litters'), notify_available: interests.includes('available'), notify_social: interests.includes('social') })
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) return (
    <><SEO title="Subscribed!" /><div className="min-h-[60vh] flex items-center justify-center px-4"><div className="text-center max-w-sm">
      <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-white" /></div>
      <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">You're In!</h1>
      <p className="text-charcoal-400">We'll notify you about new animals, litters, and farm updates. You can unsubscribe anytime by replying STOP to any text.</p>
    </div></div></>
  );

  return (
    <><SEO title="Get Notified" description="Sign up for text and email alerts from Cashmere Cottontail Farm" />
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-4"><Bell className="w-7 h-7 text-white" /></div>
        <h1 className="font-display text-2xl font-bold text-charcoal-600">Get Notified</h1>
        <p className="text-sm text-charcoal-400 mt-2">Be the first to know about new litters, available animals, and farm updates from Cashmere Cottontail Farm.</p>
      </div>
      <div className="space-y-4">
        <input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
        <input placeholder="Phone number (for text alerts)" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
        <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300" />
        <div>
          <p className="text-xs font-semibold text-charcoal-500 mb-2">I'm interested in:</p>
          <div className="flex flex-wrap gap-2">
            {[{ id: 'litters', label: '🐣 New Litters' }, { id: 'available', label: '🏷 Available Animals' }, { id: 'social', label: '📸 Farm Updates' }].map(i => (
              <button key={i.id} onClick={() => toggleInterest(i.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${interests.includes(i.id) ? 'bg-sage-500 text-white border-sage-500' : 'bg-cream-50 text-charcoal-500 border-cream-200'}`}>
                {i.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-5 h-5 rounded border-cream-300 text-sage-500 focus:ring-sage-500" />
          <span className="text-xs text-charcoal-400 leading-relaxed">I agree to receive text messages and/or emails from Cashmere Cottontail Farm about animal availability, new litters, and farm updates. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe at any time. Reply <strong>HELP</strong> for help. View our <a href="/privacy" className="text-sage-500 underline">Privacy Policy</a> and <a href="/terms" className="text-sage-500 underline">Terms & Conditions</a>.</span>
        </label>
        <button onClick={submit} disabled={!consent || (!phone && !email)} className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white font-semibold py-3.5 rounded-full transition-colors text-sm">Sign Up for Notifications</button>
        <p className="text-[10px] text-charcoal-300 text-center">Cashmere Cottontail Farm, LLC · (479) 531-0849 · Winslow, AR</p>
      </div>
    </div></>
  );
}

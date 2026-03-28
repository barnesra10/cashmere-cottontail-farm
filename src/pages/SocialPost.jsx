import { useState, useEffect } from 'react';
import { Camera, Video, Send, X, Loader, ArrowLeft, Clock, Zap, BarChart3, Calendar } from 'lucide-react';
import { getSavedSession } from '../lib/adminAuth';
import { setAdminKey, getBreeds } from '../lib/adminApi';
import SEO from '../components/SEO';

const SOCIAL_EDGE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/social-general';

const CATEGORIES = [
  { id: 'farm_life', emoji: '🌾', label: 'Farm Life', desc: 'Daily moments, scenery' },
  { id: 'farm_upgrade', emoji: '🔨', label: 'Farm Upgrade', desc: 'Improvements, new builds' },
  { id: 'new_babies', emoji: '🍼', label: 'New Babies', desc: 'Birth announcements' },
  { id: 'behind_scenes', emoji: '🎬', label: 'Behind the Scenes', desc: 'Feeding, grooming' },
  { id: 'breed_education', emoji: '📚', label: 'Breed Education', desc: 'Facts, tips, history' },
  { id: 'farm_family', emoji: '👨‍👩‍👧', label: 'Farm Family', desc: 'People behind the farm' },
  { id: 'seasonal', emoji: '🌸', label: 'Seasonal', desc: 'Holidays, weather' },
  { id: 'produce', emoji: '🥬', label: 'Produce', desc: 'Garden, harvest' },
  { id: 'funny', emoji: '😂', label: 'Funny Moment', desc: 'Bloopers, personality' },
  { id: 'milestone', emoji: '🏆', label: 'Milestone', desc: 'Wins, achievements' },
  { id: 'community', emoji: '🤝', label: 'Community', desc: 'Events, visits' },
  { id: 'custom', emoji: '✏️', label: 'Custom', desc: 'AI polishes your words' },
];

const PLATFORM_INFO = {
  facebook: { name: 'Facebook', color: 'bg-blue-600', light: 'bg-blue-50 border-blue-200', icon: '📘',
    stats: '0.15% avg engagement · 40-80 char optimal · Images get 2.3x more engagement' },
  instagram: { name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', light: 'bg-pink-50 border-pink-200', icon: '📸',
    stats: '0.48% avg engagement · Hook under 125 chars · 20-30 hashtags · Carousels perform best' },
  tiktok: { name: 'TikTok', color: 'bg-black', light: 'bg-gray-50 border-gray-300', icon: '🎵',
    stats: '3.70% avg engagement (highest!) · Under 100 chars · First 60 min = 80% of success' },
};

function getNextOptimalTime(platform, times) {
  if (!times?.[platform]?.best_times) return null;
  const now = new Date();
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();

  for (const slot of times[platform].best_times) {
    const dayIndex = dayNames.indexOf(slot.day);
    const [hourStr] = slot.time.split(':');
    const hour = parseInt(hourStr);
    const isPM = slot.time.includes('PM') && hour !== 12;
    const isAM = slot.time.includes('AM');
    const hour24 = isPM ? hour + 12 : (isAM && hour === 12 ? 0 : hour);

    let targetDate = new Date(now);
    const daysAhead = (dayIndex - now.getDay() + 7) % 7 || (hour24 > currentHour ? 0 : 7);
    targetDate.setDate(now.getDate() + daysAhead);
    targetDate.setHours(hour24, 0, 0, 0);

    if (targetDate > now) {
      return { ...slot, date: targetDate };
    }
  }
  // Fallback to first slot next week
  const slot = times[platform].best_times[0];
  const dayIndex = dayNames.indexOf(slot.day);
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + ((dayIndex - now.getDay() + 7) % 7 || 7));
  const [h] = slot.time.split(':');
  targetDate.setHours(parseInt(h), 0, 0, 0);
  return { ...slot, date: targetDate };
}

export default function SocialPost() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [captions, setCaptions] = useState(null);
  const [optimalTimes, setOptimalTimes] = useState(null);
  const [editing, setEditing] = useState(null);
  const [posting, setPosting] = useState({});
  const [posted, setPosted] = useState({});
  const [enabled, setEnabled] = useState({ facebook: true, instagram: true, tiktok: true });
  const [scheduleMode, setScheduleMode] = useState({}); // 'now' or 'optimal' or 'custom' per platform
  const [customTimes, setCustomTimes] = useState({});

  useEffect(() => {
    const key = getSavedSession();
    if (key) {
      setAdminKey(key);
      sessionStorage.setItem('ccf_admin_key', key);
      getBreeds().then(() => setAuthed(true)).catch(() => {});
    }
    setChecking(false);
  }, []);

  const adminKey = () => sessionStorage.getItem('ccf_admin_key') || '';
  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f)]);
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!category) { alert('Pick a category'); return; }
    setGenerating(true);
    try {
      const res = await fetch(SOCIAL_EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey() },
        body: JSON.stringify({ category: category.id, category_label: category.label, description })
      });
      const data = await res.json();
      setCaptions({ facebook: data.facebook || '', instagram: data.instagram || '', tiktok: data.tiktok || '' });
      if (data.optimal_times) setOptimalTimes(data.optimal_times);
      // Default all to 'optimal' scheduling
      setScheduleMode({ facebook: 'optimal', instagram: 'optimal', tiktok: 'optimal' });
    } catch (err) { alert('Failed: ' + err.message); }
    setGenerating(false);
  };

  const postToPlatform = async (platform) => {
    setPosting(prev => ({ ...prev, [platform]: true }));
    try {
      const mode = scheduleMode[platform] || 'now';
      let scheduledAt = undefined;
      if (mode === 'optimal' && optimalTimes) {
        const next = getNextOptimalTime(platform, optimalTimes);
        if (next?.date) scheduledAt = next.date.toISOString();
      } else if (mode === 'custom' && customTimes[platform]) {
        scheduledAt = new Date(customTimes[platform]).toISOString();
      }

      const res = await fetch(SOCIAL_EDGE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey() },
        body: JSON.stringify({ platform, caption: captions[platform], scheduled_at: scheduledAt })
      });
      const result = await res.json();
      if (result.success) {
        setPosted(prev => ({ ...prev, [platform]: mode === 'now' ? 'posted' : 'scheduled' }));
      } else { alert(`Failed: ${result.error}`); }
    } catch (err) { alert('Failed: ' + err.message); }
    setPosting(prev => ({ ...prev, [platform]: false }));
  };

  const postAll = async () => {
    for (const p of ['facebook', 'instagram', 'tiktok']) {
      if (enabled[p] && !posted[p] && captions?.[p]) await postToPlatform(p);
    }
  };

  const reset = () => {
    setCategory(null); setDescription(''); setFiles([]); setCaptions(null);
    setPosted({}); setEnabled({ facebook: true, instagram: true, tiktok: true });
    setScheduleMode({}); setCustomTimes({});
  };

  if (checking) return null;
  if (!authed) return (
    <><SEO title="Social Post" /><div className="max-w-sm mx-auto px-4 py-24 text-center">
      <p className="font-body text-charcoal-400 mb-4">Log in first.</p>
      <a href="/admin" className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Go to Admin</a>
    </div></>
  );

  // PREVIEW / SCHEDULING VIEW
  if (captions) {
    const allDone = Object.entries(enabled).filter(([_, on]) => on).every(([p]) => posted[p]);

    return (
      <><SEO title="Social Post Preview" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={reset} className="text-charcoal-300"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="font-display text-xl font-bold text-charcoal-600">Preview & Schedule</h1>
        </div>

        <div className="bg-cream-100 rounded-xl p-3 mb-5 border border-cream-200 flex items-center gap-2">
          <span className="text-lg">{category?.emoji}</span>
          <div>
            <p className="font-semibold text-sm text-charcoal-600">{category?.label}</p>
            {description && <p className="text-xs text-charcoal-300 line-clamp-1">{description}</p>}
          </div>
        </div>

        <div className="space-y-4 mb-5">
          {Object.entries(PLATFORM_INFO).map(([key, info]) => {
            const caption = captions[key] || '';
            const isEnabled = enabled[key];
            const isDone = posted[key];
            const isPosting = posting[key];
            const mode = scheduleMode[key] || 'now';
            const nextOptimal = optimalTimes ? getNextOptimalTime(key, optimalTimes) : null;
            const platformTimes = optimalTimes?.[key];

            return (
              <div key={key} className={`rounded-xl border overflow-hidden ${isEnabled ? info.light : 'bg-gray-100 border-gray-200 opacity-40'}`}>
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span className="font-semibold text-sm text-charcoal-600">{info.name}</span>
                    {isDone && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{isDone === 'scheduled' ? '📅 Scheduled' : '✅ Posted'}</span>}
                  </div>
                  {!isDone && <button onClick={() => setEnabled(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {isEnabled ? 'On' : 'Skip'}
                  </button>}
                </div>

                {isEnabled && !isDone && (
                  <div className="px-4 pb-3 space-y-2">
                    {/* Stats bar */}
                    <div className="flex items-center gap-1 text-[9px] text-charcoal-300">
                      <BarChart3 className="w-3 h-3" /> {info.stats}
                    </div>

                    {/* Caption */}
                    {editing === key ? (
                      <div>
                        <textarea value={caption} onChange={e => setCaptions(prev => ({ ...prev, [key]: e.target.value }))}
                          rows={6} className="w-full px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage-300" />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-charcoal-300">{caption.length} chars</span>
                          <button onClick={() => setEditing(null)} className="text-xs text-sage-500 font-semibold">Done</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-wrap line-clamp-4">{caption}</p>
                        <div className="flex gap-3 mt-1">
                          <button onClick={() => setEditing(key)} className="text-[10px] text-charcoal-300">Edit</button>
                          <button onClick={() => navigator.clipboard.writeText(caption)} className="text-[10px] text-charcoal-300">Copy</button>
                          <span className="text-[10px] text-charcoal-200">{caption.length} chars</span>
                        </div>
                      </div>
                    )}

                    {/* Schedule options */}
                    <div className="bg-white rounded-lg border border-cream-200 p-2">
                      <p className="text-[10px] font-semibold text-charcoal-400 mb-1.5">When to post:</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <button onClick={() => setScheduleMode(prev => ({ ...prev, [key]: 'now' }))}
                          className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1 ${mode === 'now' ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400'}`}>
                          <Zap className="w-3 h-3" /> Now
                        </button>
                        <button onClick={() => setScheduleMode(prev => ({ ...prev, [key]: 'optimal' }))}
                          className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1 ${mode === 'optimal' ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400'}`}>
                          <Clock className="w-3 h-3" /> Optimal
                        </button>
                        <button onClick={() => setScheduleMode(prev => ({ ...prev, [key]: 'custom' }))}
                          className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1 ${mode === 'custom' ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400'}`}>
                          <Calendar className="w-3 h-3" /> Custom
                        </button>
                      </div>
                      {mode === 'optimal' && nextOptimal && (
                        <p className="text-[10px] text-sage-600 mt-1.5">
                          📊 Next best: <strong>{nextOptimal.day} at {nextOptimal.time}</strong> (score: {nextOptimal.score}/100)
                        </p>
                      )}
                      {mode === 'optimal' && platformTimes && (
                        <p className="text-[9px] text-charcoal-300 mt-0.5">
                          Frequency tip: {platformTimes.frequency} · Avoid: {platformTimes.avoid}
                        </p>
                      )}
                      {mode === 'custom' && (
                        <input type="datetime-local" value={customTimes[key] || ''}
                          onChange={e => setCustomTimes(prev => ({ ...prev, [key]: e.target.value }))}
                          className="mt-1.5 w-full px-2 py-1.5 bg-cream-50 border border-cream-200 rounded-lg text-xs" />
                      )}
                    </div>

                    {/* Post button */}
                    <button onClick={() => postToPlatform(key)} disabled={isPosting || !caption}
                      className={`w-full py-2 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 ${info.color}`}>
                      {isPosting ? <><Loader className="w-4 h-4 animate-spin" /> {mode === 'now' ? 'Posting...' : 'Scheduling...'}</> :
                        <><Send className="w-4 h-4" /> {mode === 'now' ? `Post to ${info.name}` : `Schedule ${info.name}`}</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!allDone && (
          <button onClick={postAll} className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
            <Send className="w-5 h-5" /> Send All
          </button>
        )}
        {allDone && (
          <div className="text-center py-4">
            <p className="font-display text-lg font-bold text-charcoal-600 mb-3">All done!</p>
            <button onClick={reset} className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Create Another</button>
          </div>
        )}
      </div></>
    );
  }

  // COMPOSE VIEW
  return (
    <><SEO title="Social Post" />
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin" className="text-charcoal-300"><ArrowLeft className="w-5 h-5" /></a>
        <h1 className="font-display text-xl font-bold text-charcoal-600">New Social Post</h1>
      </div>

      {/* Media */}
      <div className="flex gap-3 mb-3">
        <label className="flex-1 bg-sage-500 hover:bg-sage-600 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer">
          <Camera className="w-7 h-7" /><span className="text-xs font-semibold">Photo</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files[0] && addFiles(e.target.files)} />
        </label>
        <label className="flex-1 bg-charcoal-600 hover:bg-charcoal-700 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer">
          <Video className="w-7 h-7" /><span className="text-xs font-semibold">Video</span>
          <input type="file" accept="video/*" capture="environment" className="hidden" onChange={e => e.target.files[0] && addFiles(e.target.files)} />
        </label>
      </div>
      <label className="block w-full bg-cream-100 hover:bg-cream-200 text-charcoal-400 rounded-xl py-3 text-center cursor-pointer border border-cream-200 mb-4">
        <span className="text-xs font-semibold">Choose from Library</span>
        <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => e.target.files.length && addFiles(e.target.files)} />
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {files.map((f, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-cream-200">
              {f.type.startsWith('video/') ? <div className="w-full h-full bg-charcoal-700 flex items-center justify-center text-white text-[8px]">VID</div> :
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />}
              <button onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      <h2 className="font-display text-sm font-semibold text-charcoal-500 mb-3">What's this post about?</h2>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat)}
            className={`rounded-xl p-2.5 text-center border transition-colors ${
              category?.id === cat.id ? 'bg-sage-50 border-sage-400 ring-2 ring-sage-300' : 'bg-white border-cream-200 hover:border-sage-300'
            }`}>
            <span className="text-xl block">{cat.emoji}</span>
            <span className="text-[10px] font-semibold text-charcoal-600 block leading-tight mt-0.5">{cat.label}</span>
          </button>
        ))}
      </div>

      <textarea value={description} onChange={e => setDescription(e.target.value)}
        placeholder={category?.id === 'custom' ? "Write your post and AI will polish it..." : "Add details (optional but helps AI write better)"}
        rows={3} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 mb-5" />

      <button onClick={generate} disabled={!category || generating}
        className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
        {generating ? <><Loader className="w-5 h-5 animate-spin" /> Writing posts...</> : <><Send className="w-5 h-5" /> Generate Posts</>}
      </button>
    </div></>
  );
}

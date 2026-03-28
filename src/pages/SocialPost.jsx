import { useState, useEffect } from 'react';
import { Camera, Video, Send, X, Loader, ArrowLeft } from 'lucide-react';
import { getSavedSession } from '../lib/adminAuth';
import { setAdminKey, getBreeds } from '../lib/adminApi';
import SEO from '../components/SEO';

const SOCIAL_EDGE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/social-general';

const CATEGORIES = [
  { id: 'farm_life', emoji: '🌾', label: 'Farm Life', desc: 'Day-to-day farm moments, chores, scenery' },
  { id: 'farm_upgrade', emoji: '🔨', label: 'Farm Upgrade', desc: 'New fencing, barn, equipment, improvements' },
  { id: 'new_babies', emoji: '🍼', label: 'New Babies', desc: 'Birth announcements, newborns, first steps' },
  { id: 'behind_scenes', emoji: '🎬', label: 'Behind the Scenes', desc: 'Feeding time, grooming, daily routine' },
  { id: 'breed_education', emoji: '📚', label: 'Breed Education', desc: 'Fun facts, breed history, care tips' },
  { id: 'farm_family', emoji: '👨‍👩‍👧', label: 'Farm Family', desc: 'Your family, helpers, the people behind the farm' },
  { id: 'seasonal', emoji: '🌸', label: 'Seasonal', desc: 'Holidays, weather, seasonal changes on the farm' },
  { id: 'produce', emoji: '🥬', label: 'Organic Produce', desc: 'Garden updates, harvest, what\'s growing' },
  { id: 'funny', emoji: '😂', label: 'Funny Moment', desc: 'Silly animals, bloopers, personality moments' },
  { id: 'milestone', emoji: '🏆', label: 'Milestone', desc: 'Show wins, farm anniversary, achievements' },
  { id: 'community', emoji: '🤝', label: 'Community', desc: 'Events, farm visits, local connections' },
  { id: 'custom', emoji: '✏️', label: 'Custom', desc: 'Write your own — AI will polish it' },
];

export default function SocialPost() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [captions, setCaptions] = useState(null);
  const [editing, setEditing] = useState(null);
  const [posting, setPosting] = useState({});
  const [posted, setPosted] = useState({});
  const [enabled, setEnabled] = useState({ facebook: true, instagram: true, tiktok: true });

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

  const addFiles = (newFiles) => setFiles(prev => [...prev, ...Array.from(newFiles)]);
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!category) { alert('Pick a category first'); return; }
    setGenerating(true);
    try {
      const res = await fetch(SOCIAL_EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey() },
        body: JSON.stringify({ category: category.id, category_label: category.label, description })
      });
      const data = await res.json();
      setCaptions({ facebook: data.facebook || '', instagram: data.instagram || '', tiktok: data.tiktok || '' });
    } catch (err) {
      alert('Failed to generate: ' + err.message);
    }
    setGenerating(false);
  };

  const postToPlatform = async (platform) => {
    setPosting(prev => ({ ...prev, [platform]: true }));
    try {
      // Upload files first if any, then post caption
      // For now, post caption only — files would need to be uploaded to Supabase storage first
      const res = await fetch(SOCIAL_EDGE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey() },
        body: JSON.stringify({ platform, caption: captions[platform] })
      });
      const result = await res.json();
      if (result.success) {
        setPosted(prev => ({ ...prev, [platform]: true }));
      } else {
        alert(`Failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) { alert('Failed: ' + err.message); }
    setPosting(prev => ({ ...prev, [platform]: false }));
  };

  const postAll = async () => {
    for (const p of ['facebook', 'instagram', 'tiktok']) {
      if (enabled[p] && !posted[p] && captions?.[p]) await postToPlatform(p);
    }
  };

  const reset = () => {
    setCategory(null);
    setDescription('');
    setFiles([]);
    setCaptions(null);
    setPosted({});
    setEnabled({ facebook: true, instagram: true, tiktok: true });
  };

  if (checking) return null;

  if (!authed) {
    return (
      <>
        <SEO title="Social Post" description="" />
        <div className="max-w-sm mx-auto px-4 py-24 text-center">
          <p className="font-body text-charcoal-400 mb-4">You need to log in first.</p>
          <a href="/admin" className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Go to Admin</a>
        </div>
      </>
    );
  }

  // Show captions if generated
  if (captions) {
    const allDone = Object.entries(enabled).filter(([_, on]) => on).every(([p]) => posted[p]);
    const platforms = [
      { key: 'facebook', name: 'Facebook', color: 'bg-blue-600', light: 'bg-blue-50 border-blue-200' },
      { key: 'instagram', name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', light: 'bg-pink-50 border-pink-200' },
      { key: 'tiktok', name: 'TikTok', color: 'bg-black', light: 'bg-gray-50 border-gray-300' },
    ];

    return (
      <>
        <SEO title="Social Post Preview" description="" />
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={reset} className="text-charcoal-300 hover:text-charcoal-500"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="font-display text-xl font-bold text-charcoal-600">Social Post Preview</h1>
          </div>

          <div className="bg-cream-100 rounded-xl p-3 mb-6 border border-cream-200 flex items-center gap-2">
            <span className="text-lg">{category?.emoji}</span>
            <div>
              <p className="font-semibold text-sm text-charcoal-600">{category?.label}</p>
              {description && <p className="text-xs text-charcoal-300 line-clamp-1">{description}</p>}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {platforms.map(({ key, name, color, light }) => (
              <div key={key} className={`rounded-xl border overflow-hidden ${enabled[key] ? light : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-semibold text-sm text-charcoal-600">{name}</span>
                  <button onClick={() => setEnabled(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${enabled[key] ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {enabled[key] ? 'On' : 'Skip'}
                  </button>
                </div>
                {enabled[key] && (
                  <div className="px-4 pb-3">
                    {editing === key ? (
                      <div>
                        <textarea value={captions[key]} onChange={e => setCaptions(prev => ({ ...prev, [key]: e.target.value }))}
                          rows={6} className="w-full px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage-300" />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-charcoal-300">{captions[key].length} chars</span>
                          <button onClick={() => setEditing(null)} className="text-xs text-sage-500 font-semibold">Done</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-wrap line-clamp-6">{captions[key]}</p>
                        <div className="flex gap-3 mt-2">
                          <button onClick={() => setEditing(key)} className="text-[10px] text-charcoal-300 hover:text-charcoal-500">Edit</button>
                          <button onClick={() => { navigator.clipboard.writeText(captions[key]); }} className="text-[10px] text-charcoal-300 hover:text-charcoal-500">Copy</button>
                          <span className="text-[10px] text-charcoal-200">{captions[key].length} chars</span>
                        </div>
                      </div>
                    )}
                    {!posted[key] ? (
                      <button onClick={() => postToPlatform(key)} disabled={posting[key]}
                        className={`mt-3 w-full py-2 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 ${color}`}>
                        {posting[key] ? <><Loader className="w-4 h-4 animate-spin" /> Posting...</> : <><Send className="w-4 h-4" /> Post to {name}</>}
                      </button>
                    ) : (
                      <p className="mt-2 text-center text-xs text-green-600 font-semibold">Posted!</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!allDone && (
            <button onClick={postAll} className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
              <Send className="w-5 h-5" /> Post to All Platforms
            </button>
          )}
          {allDone && (
            <div className="text-center py-4">
              <p className="font-display text-lg font-bold text-charcoal-600 mb-3">All posts sent!</p>
              <button onClick={reset} className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Create Another Post</button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Social Post" description="" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <a href="/admin" className="text-charcoal-300 hover:text-charcoal-500"><ArrowLeft className="w-5 h-5" /></a>
          <h1 className="font-display text-xl font-bold text-charcoal-600">New Social Post</h1>
        </div>

        {/* Media capture */}
        <div className="flex gap-3 mb-4">
          <label className="flex-1 bg-sage-500 hover:bg-sage-600 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer transition-colors">
            <Camera className="w-7 h-7" />
            <span className="text-xs font-semibold">Photo</span>
            <input type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => e.target.files[0] && addFiles(e.target.files)} />
          </label>
          <label className="flex-1 bg-charcoal-600 hover:bg-charcoal-700 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer transition-colors">
            <Video className="w-7 h-7" />
            <span className="text-xs font-semibold">Video</span>
            <input type="file" accept="video/*" capture="environment" className="hidden"
              onChange={e => e.target.files[0] && addFiles(e.target.files)} />
          </label>
        </div>
        <label className="block w-full bg-cream-100 hover:bg-cream-200 text-charcoal-400 rounded-xl py-3 text-center cursor-pointer border border-cream-200 mb-4">
          <span className="text-xs font-semibold">Choose from Library</span>
          <input type="file" accept="image/*,video/*" multiple className="hidden"
            onChange={e => e.target.files.length && addFiles(e.target.files)} />
        </label>

        {/* File previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {files.map((file, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-cream-200">
                {file.type.startsWith('video/') ? (
                  <div className="w-full h-full bg-charcoal-700 flex items-center justify-center text-white text-[8px]">VID</div>
                ) : (
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                )}
                <button onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category picker */}
        <h2 className="font-display text-sm font-semibold text-charcoal-500 mb-3">What's this post about?</h2>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat)}
              className={`rounded-xl p-2.5 text-center border transition-colors ${
                category?.id === cat.id
                  ? 'bg-sage-50 border-sage-400 ring-2 ring-sage-300'
                  : 'bg-white border-cream-200 hover:border-sage-300'
              }`}>
              <span className="text-xl block">{cat.emoji}</span>
              <span className="text-[10px] font-semibold text-charcoal-600 block leading-tight mt-0.5">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder={category?.id === 'custom' ? "Write your post and AI will polish it for each platform..." : "Add details — what's happening? (optional but helps AI write better)"}
          rows={3}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-charcoal-600 resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 mb-5" />

        {/* Generate button */}
        <button onClick={generate} disabled={!category || generating}
          className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
          {generating ? <><Loader className="w-5 h-5 animate-spin" /> Writing posts...</> : <><Send className="w-5 h-5" /> Generate Posts</>}
        </button>
      </div>
    </>
  );
}

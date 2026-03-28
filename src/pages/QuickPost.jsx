import { useState, useEffect } from 'react';
import { Camera, Video, Send, CheckCircle, Plus, X, Lock } from 'lucide-react';
import { setAdminKey, clearAdminKey, getBreeds } from '../lib/adminApi';
import { getSavedSession, saveSession, clearSession } from '../lib/adminAuth';
import SEO from '../components/SEO';

const EDGE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/quick-post';

export default function QuickPost() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [copied, setCopied] = useState(false);
  const [files, setFiles] = useState([]);
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: '', breed: 'valais', sex: 'female', role: 'available',
    price: '', description: '', sire: '', dam: '', status: 'available'
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Check for cached session on mount
  useEffect(() => {
    const cachedKey = getSavedSession();
    if (cachedKey) {
      setPw(cachedKey);
      setAdminKey(cachedKey);
      getBreeds().then(b => {
        setBreeds(b);
        setAuthed(true);
      }).catch(() => {
        clearSession();
        clearAdminKey();
      });
    }
  }, []);

  const tryLogin = async () => {
    setAdminKey(pw);
    try { 
      const b = await getBreeds(); 
      setBreeds(b);
      saveSession(pw);
      setAuthed(true); 
    } catch { 
      setLoginError(true); 
      clearAdminKey(); 
    }
  };

  const addFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    setFiles(prev => [...prev, ...fileList]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const post = async () => {
    if (!form.name) { alert('Name is required'); return; }
    setPosting(true);

    const formData = new FormData();
    formData.append('skip_social', 'true'); // Don't auto-post — we'll preview first
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    files.forEach((file, i) => formData.append(`media${i}`, file));

    try {
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'x-admin-key': pw },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        // Store animal data for the social preview page
        const breedLabel = breedOptions.find(b => b.slug === form.breed)?.label || form.breed;
        sessionStorage.setItem('ccf_social_preview', JSON.stringify({
          animal: data.animal,
          animal_id: data.animal.id,
          breedName: breedLabel,
          name: form.name,
          breed: form.breed,
          sex: form.sex,
          role: form.role,
          price: form.price,
          description: form.description,
        }));
        sessionStorage.setItem('ccf_admin_key', pw);
        // Navigate to social preview
        window.location.href = '/social';
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
    setPosting(false);
  };

  // Breed slug mapping for the quick post
  const breedOptions = [
    { slug: 'valais', label: 'Valais Blacknose' },
    { slug: 'pygmy', label: 'Pygmy Goats' },
    { slug: 'mini-rex', label: 'Mini Rex' },
    { slug: 'dachshund', label: 'Mini Dachshunds' },
    { slug: 'silkie', label: 'Silkies' },
  ];

  if (!authed) {
    return (
      <>
        <SEO title="Quick Post" description="Quick post animals" />
        <div className="max-w-sm mx-auto px-4 py-24 text-center">
          <Lock className="w-12 h-12 text-sage-500 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Quick Post</h1>
          <p className="font-body text-sm text-charcoal-300 mb-6">Post animals from your phone</p>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setLoginError(false); }}
            onKeyDown={e => e.key === 'Enter' && tryLogin()} placeholder="Admin password"
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-center focus:outline-none focus:ring-2 focus:ring-sage-300" />
          {loginError && <p className="text-red-500 text-sm mt-2">Wrong password</p>}
          <button onClick={tryLogin} className="mt-4 w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-3 rounded-full">Log In</button>
        </div>
      </>
    );
  }

  if (success) {
    const copyCaption = () => {
      navigator.clipboard.writeText(success.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <>
        <SEO title="Quick Post" description="Quick post animals" />
        <div className="max-w-sm mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Posted!</h1>
          <p className="font-body text-charcoal-400 mb-4">{success.message}</p>

          {success.caption && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-6">
              <p className="text-xs font-semibold text-blue-600 mb-2">AI-Generated Social Caption:</p>
              <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-wrap">{success.caption}</p>
              <button onClick={copyCaption}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors">
                {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : 'Copy Caption to Clipboard'}
              </button>
              <p className="text-[10px] text-blue-400 mt-2 text-center">Paste into Facebook, Instagram, TikTok, etc.</p>
            </div>
          )}

          <button onClick={() => setSuccess(null)}
            className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-3 rounded-full">
            Post Another
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Quick Post" description="Quick post animals" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-display text-xl font-bold text-charcoal-600 mb-6">Quick Post</h1>

        {/* Media capture — big buttons at the top */}
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <label className="flex-1 bg-sage-500 hover:bg-sage-600 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer transition-colors">
              <Camera className="w-7 h-7" />
              <span className="text-xs font-semibold">Take Photo</span>
              <input type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => e.target.files[0] && addFiles(e.target.files)} />
            </label>
            <label className="flex-1 bg-charcoal-600 hover:bg-charcoal-700 text-white rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer transition-colors">
              <Video className="w-7 h-7" />
              <span className="text-xs font-semibold">Record Video</span>
              <input type="file" accept="video/*" capture="environment" className="hidden"
                onChange={e => e.target.files[0] && addFiles(e.target.files)} />
            </label>
          </div>
          <label className="block w-full bg-cream-100 hover:bg-cream-200 text-charcoal-400 rounded-xl py-3 text-center cursor-pointer transition-colors border border-cream-200">
            <span className="text-xs font-semibold">Choose from Library</span>
            <input type="file" accept="image/*,video/*" multiple className="hidden"
              onChange={e => e.target.files.length && addFiles(e.target.files)} />
          </label>

          {/* File previews */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {files.map((file, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-cream-200">
                  {file.type.startsWith('video/') ? (
                    <div className="w-full h-full bg-charcoal-700 flex items-center justify-center text-white text-[8px]">VID</div>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  )}
                  <button onClick={() => removeFile(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form — compact */}
        <div className="space-y-3">
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Animal name *"
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body focus:outline-none focus:ring-2 focus:ring-sage-300" />

          <div className="grid grid-cols-2 gap-3">
            <select value={form.breed} onChange={e => set('breed', e.target.value)}
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm">
              {breedOptions.map(b => <option key={b.slug} value={b.slug}>{b.label}</option>)}
            </select>
            <select value={form.sex} onChange={e => set('sex', e.target.value)}
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={form.role} onChange={e => set('role', e.target.value)}
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm">
              <option value="available">For Sale</option>
              <option value="parent">Breeding Stock</option>
              <option value="retained">Retained</option>
            </select>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="Price"
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input value={form.sire} onChange={e => set('sire', e.target.value)} placeholder="Sire"
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <input value={form.dam} onChange={e => set('dam', e.target.value)} placeholder="Dam"
              className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>

          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Description (optional)" rows={3}
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage-300" />

          <button onClick={post} disabled={posting || !form.name}
            className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg transition-colors shadow-lg">
            {posting ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
            ) : (
              <><Send className="w-5 h-5" /> Post to Website</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { setAdminKey, clearAdminKey, getAdminKey, getBreeds, getAnimals, createAnimal, updateAnimal, deleteAnimal, markAsSold, uploadMedia, deleteMedia, setPrimaryMedia, getContacts, markContactRead, postToSocial } from '../lib/adminApi';
import { getSavedSession, saveSession, clearSession, isPasskeySupported, authenticateWithPasskey, registerPasskey } from '../lib/adminAuth';
import { Lock, Plus, Camera, Video, Trash2, Save, LogOut, Image, Eye, Play, Share2, Copy, CheckCircle, FileText, Fingerprint, Smartphone } from 'lucide-react';
import SEO from '../components/SEO';

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState(''); // '', 'trying', 'no_passkeys', 'failed'
  // Don't auto-try passkey - let user tap the button to avoid "not focused" error
  const supportsPasskey = isPasskeySupported();

  const tryPasskey = async () => {
    setPasskeyStatus('trying');
    setError('');
    try {
      const result = await authenticateWithPasskey();
      if (result.success) {
        setAdminKey('ccf2025admin');
        onLogin();
        return;
      }
      if (result.no_passkeys) {
        setPasskeyStatus('no_passkeys');
        setShowPassword(true);
      }
    } catch (e) {
      console.log('Passkey auth failed:', e);
      setPasskeyStatus('failed');
      setShowPassword(true);
    }
  };

  const tryPassword = async () => {
    setLoading(true); setAdminKey(pw); setError('');
    try { await getBreeds(); saveSession(pw); onLogin(); }
    catch { setError('Wrong password'); clearAdminKey(); }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-24 text-center">
      <Lock className="w-12 h-12 text-sage-500 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-6">Farm Admin</h1>

      {/* Passkey button */}
      {supportsPasskey && passkeyStatus !== 'trying' && (
        <button onClick={tryPasskey}
          className="w-full bg-charcoal-700 hover:bg-charcoal-600 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 mb-4">
          <Fingerprint className="w-5 h-5" /> Sign in with Face ID
        </button>
      )}

      {passkeyStatus === 'trying' && (
        <div className="mb-6">
          <Fingerprint className="w-10 h-10 text-sage-500 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-charcoal-400">Waiting for Face ID...</p>
        </div>
      )}

      {/* Divider */}
      {supportsPasskey && (showPassword || passkeyStatus === 'failed' || passkeyStatus === 'no_passkeys') && (
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-cream-200" />
          <span className="text-xs text-charcoal-300">or use password</span>
          <div className="flex-1 h-px bg-cream-200" />
        </div>
      )}

      {/* Password login */}
      {(!supportsPasskey || showPassword || passkeyStatus === 'no_passkeys') && (
        <>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && tryPassword()} placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600 font-body text-center focus:outline-none focus:ring-2 focus:ring-sage-300" />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button onClick={tryPassword} disabled={loading}
            className="mt-4 w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-semibold py-3 rounded-full transition-colors">
            {loading ? 'Checking...' : 'Log In'}
          </button>
        </>
      )}

      {passkeyStatus === 'no_passkeys' && supportsPasskey && (
        <p className="text-xs text-charcoal-300 mt-4">No Face ID registered yet. Log in with password first, then register your device in Settings.</p>
      )}
    </div>
  );
}

function MediaUploader({ animalId, existingMedia = [], onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleUpload = async (file) => {
    setUploading(true);
    const isVideo = file.type.startsWith('video/');
    setProgress(isVideo ? 'Uploading video...' : 'Uploading photo...');
    try {
      await uploadMedia(animalId, file, existingMedia.length === 0);
      onUpdate();
    } catch (err) { alert('Upload failed: ' + err.message); }
    setUploading(false);
    setProgress('');
  };

  const handleTapToSwap = async (tapIdx) => {
    if (selectedIdx === null) {
      setSelectedIdx(tapIdx);
    } else if (selectedIdx === tapIdx) {
      setSelectedIdx(null);
    } else {
      const key = sessionStorage.getItem('ccf_admin_key');
      const api = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';
      try {
        await fetch(`${api}/media/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
          body: JSON.stringify({ media_id_a: existingMedia[selectedIdx].id, media_id_b: existingMedia[tapIdx].id })
        });
        onUpdate();
      } catch (e) { console.error(e); }
      setSelectedIdx(null);
      setReorderMode(false);
    }
  };

  const photos = existingMedia.filter(m => m.media_type === 'photo');
  const videos = existingMedia.filter(m => m.media_type === 'video');

  return (
    <div className="space-y-2">
      {/* Reorder toggle */}
      {existingMedia.length > 1 && (
        <button onClick={() => { setReorderMode(!reorderMode); setSelectedIdx(null); }}
          className={`text-[10px] font-semibold px-3 py-1 rounded-full ${reorderMode ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400 border border-cream-200'}`}>
          {reorderMode ? '✓ Done Reordering' : '↔ Reorder'}
        </button>
      )}
      {reorderMode && (
        <p className="text-[10px] text-sage-500">{selectedIdx !== null ? 'Now tap where you want to move it' : 'Tap a photo to select it, then tap its new position'}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {existingMedia.map((m, i) => (
          <div key={m.id}
            onClick={() => reorderMode && handleTapToSwap(i)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 group transition-all ${
              reorderMode && selectedIdx === i ? 'border-sage-500 ring-2 ring-sage-300 scale-95' :
              reorderMode ? 'border-cream-300 cursor-pointer' : 'border-cream-200'
            }`}>
            {m.media_type === 'video' ? (
              <div className="w-full h-full bg-charcoal-700 flex items-center justify-center">
                <Play className="w-6 h-6 text-white/80" />
              </div>
            ) : (
              <img src={m.url} alt="" className="w-full h-full object-cover" />
            )}
            {m.is_primary && <span className="absolute top-0.5 left-0.5 bg-sage-500 text-white text-[8px] px-1 rounded">Primary</span>}
            {m.media_type === 'video' && <span className="absolute bottom-0.5 left-0.5 bg-charcoal-700 text-white text-[8px] px-1 rounded">Video</span>}
            {reorderMode && <span className="absolute top-0.5 right-0.5 bg-charcoal-700/80 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{i + 1}</span>}
            {/* Action overlay — only when NOT reordering */}
            {!reorderMode && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                {m.media_type === 'photo' && (
                  <button onClick={() => setPrimaryMedia(m.id, animalId).then(onUpdate)} className="text-white p-1.5 bg-black/30 rounded-lg" title="Set as primary"><Eye className="w-3.5 h-3.5" /></button>
                )}
                <button onClick={() => { if (confirm('Delete this?')) deleteMedia(m.id).then(onUpdate); }} className="text-red-300 p-1.5 bg-black/30 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        ))}

        {/* Camera photo button */}
        <label className={`w-16 h-16 rounded-lg border-2 border-dashed border-cream-300 flex flex-col items-center justify-center cursor-pointer hover:border-sage-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? (
            <div className="w-4 h-4 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
          ) : (
            <>
              <Camera className="w-4 h-4 text-cream-400" />
              <span className="text-[7px] text-cream-400 mt-0.5">Camera</span>
            </>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploading}
            onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
        </label>

        {/* Camera video button */}
        <label className={`w-16 h-16 rounded-lg border-2 border-dashed border-cream-300 flex flex-col items-center justify-center cursor-pointer hover:border-sage-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? (
            <div className="w-4 h-4 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
          ) : (
            <>
              <Video className="w-4 h-4 text-cream-400" />
              <span className="text-[7px] text-cream-400 mt-0.5">Video</span>
            </>
          )}
          <input type="file" accept="video/*" capture="environment" className="hidden" disabled={uploading}
            onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
        </label>

        {/* Choose from library button — NO capture attribute so it opens gallery */}
        <label className={`w-16 h-16 rounded-lg border-2 border-dashed border-cream-300 flex flex-col items-center justify-center cursor-pointer hover:border-sage-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? (
            <div className="w-4 h-4 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
          ) : (
            <>
              <Image className="w-4 h-4 text-cream-400" />
              <span className="text-[7px] text-cream-400 mt-0.5">Library</span>
            </>
          )}
          <input type="file" accept="image/*,video/*" className="hidden" disabled={uploading}
            onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
        </label>
      </div>
      {progress && <p className="text-xs text-charcoal-300">{progress}</p>}
      <p className="text-[10px] text-charcoal-200">{photos.length} photo{photos.length !== 1 ? 's' : ''}, {videos.length} video{videos.length !== 1 ? 's' : ''}</p>
    </div>
  );
}

function AnimalForm({ breeds, animal, onSave, onCancel }) {
  const [form, setForm] = useState(animal ? {
    breed_id: animal.breed_id, name: animal.name, sex: animal.sex, role: animal.role,
    registration: animal.registration || '', show_quality: animal.show_quality,
    description: animal.description || '', date_of_birth: animal.date_of_birth || '',
    sire_name: animal.sire_name || '', dam_name: animal.dam_name || '',
    price: animal.price || '', status: animal.status, featured: animal.featured
  } : {
    breed_id: '', name: '', sex: 'female', role: 'available', registration: '',
    show_quality: false, description: '', date_of_birth: '', sire_name: '', dam_name: '',
    price: '', status: 'available', featured: false
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.breed_id || !form.name) { alert('Breed and name are required'); return; }
    setSaving(true);
    const payload = {
      ...form,
      price: form.price ? Number(form.price) : null,
      date_of_birth: form.date_of_birth || null,
      sire_name: form.sire_name || null,
      dam_name: form.dam_name || null,
    };
    try {
      if (animal?.id) await updateAnimal(animal.id, payload);
      else await createAnimal(payload);
      onSave();
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-charcoal-400">Breed *</label>
          <select value={form.breed_id} onChange={e => set('breed_id', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
            <option value="">Select breed...</option>
            {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-charcoal-400">Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Sex</label>
          <select value={form.sex} onChange={e => set('sex', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
            <option value="parent">Breeding Stock</option><option value="available">For Sale</option>
            <option value="sold">Sold</option><option value="retained">Retained</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
            <option value="available">Available</option><option value="reserved">Reserved</option>
            <option value="sold">Sold</option><option value="not_for_sale">Not For Sale</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Price</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" placeholder="0.00" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Date of Birth</label>
          <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Registration</label>
          <input value={form.registration} onChange={e => set('registration', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Sire</label>
          <input value={form.sire_name} onChange={e => set('sire_name', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-400">Dam</label>
          <input value={form.dam_name} onChange={e => set('dam_name', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm" />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-charcoal-400">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
            className="w-full mt-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm resize-none" />
        </div>
        <div className="col-span-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_quality} onChange={e => set('show_quality', e.target.checked)} /> Show Quality</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured</label>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : animal?.id ? 'Update' : 'Add Animal'}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-cream-300 rounded-full text-charcoal-400 hover:bg-cream-50">Cancel</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editAnimal, setEditAnimal] = useState(null);
  const [filterBreed, setFilterBreed] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [shareAnimal, setShareAnimal] = useState(null);
  const [tab, setTab] = useState('animals');

  const loadData = async () => {
    try {
      setBreeds(await getBreeds());
      const params = {};
      if (filterBreed) params.breed_id = filterBreed;
      if (filterRole) params.role = filterRole;
      setAnimals(await getAnimals(params));
      setContacts(await getContacts());
    } catch (err) {
      if (err.message === 'unauthorized') { clearAdminKey(); clearSession(); setAuthed(false); }
    }
  };

  // Check for cached session on mount
  useEffect(() => {
    const cachedKey = getSavedSession();
    if (cachedKey) {
      setAdminKey(cachedKey);
      sessionStorage.setItem('ccf_admin_key', cachedKey);
      getBreeds().then(b => {
        setBreeds(b);
        setAuthed(true);
      }).catch(() => {
        clearSession();
        clearAdminKey();
      });
    }
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed, filterBreed, filterRole]);

  if (!authed) return (<><SEO title="Admin" description="Farm admin" /><LoginScreen onLogin={() => setAuthed(true)} /></>);

  const breedName = (id) => breeds.find(b => b.id === id)?.short_name || '';

  return (
    <>
      <SEO title="Admin" description="Farm admin" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl font-bold text-charcoal-600">Farm Admin</h1>
          <div className="flex items-center gap-2">
            {isPasskeySupported() && (
              <button onClick={() => {
                registerPasskey('ccf2025admin', 'My iPhone')
                  .then(() => alert('Face ID registered! Next time you can sign in without a password.'))
                  .catch(e => alert('Registration failed: ' + e.message));
              }} className="text-charcoal-300 hover:text-sage-500 p-2" title="Register Face ID">
                <Fingerprint className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => { clearAdminKey(); clearSession(); setAuthed(false); }} className="text-charcoal-300 hover:text-charcoal-500 p-2"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['animals', 'contacts'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400 hover:bg-cream-200'}`}>
              {t === 'animals' ? 'Animals' : `Messages (${contacts.filter(c => !c.read).length})`}
            </button>
          ))}
        </div>

        {tab === 'animals' && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <select value={filterBreed} onChange={e => setFilterBreed(e.target.value)} className="px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
                <option value="">All breeds</option>
                {breeds.map(b => <option key={b.id} value={b.id}>{b.short_name}</option>)}
              </select>
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm">
                <option value="">All roles</option>
                <option value="parent">Breeding Stock</option><option value="available">For Sale</option>
                <option value="sold">Sold</option><option value="retained">Retained</option>
              </select>
              <button onClick={() => { setEditAnimal(null); setShowForm(true); }}
                className="ml-auto bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Animal
              </button>
            </div>

            {showForm && (
              <div className="mb-6">
                <AnimalForm breeds={breeds} animal={editAnimal}
                  onSave={() => { setShowForm(false); setEditAnimal(null); loadData(); }}
                  onCancel={() => { setShowForm(false); setEditAnimal(null); }} />
              </div>
            )}

            <div className="space-y-3">
              {animals.map(animal => {
                const media = animal.animal_media || [];
                const primaryMedia = media.find(m => m.is_primary) || media[0];
                const photoCount = media.filter(m => m.media_type === 'photo').length;
                const videoCount = media.filter(m => m.media_type === 'video').length;
                return (
                  <div key={animal.id} className="bg-white rounded-xl border border-cream-200 p-4">
                    <div className="flex items-start gap-3">
                      {primaryMedia ? (
                        primaryMedia.media_type === 'video' ? (
                          <div className="w-16 h-16 rounded-lg bg-charcoal-700 flex items-center justify-center"><Play className="w-6 h-6 text-white/80" /></div>
                        ) : (
                          <img src={primaryMedia.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        )
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-cream-100 flex items-center justify-center"><Image className="w-6 h-6 text-cream-300" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-semibold text-charcoal-600">{animal.name}</h3>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${animal.sex === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{animal.sex}</span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            animal.role === 'available' ? 'bg-green-100 text-green-700' : animal.role === 'parent' ? 'bg-blue-50 text-blue-600' :
                            animal.role === 'sold' ? 'bg-charcoal-50 text-charcoal-400' : 'bg-wheat-100 text-wheat-600'
                          }`}>{animal.role}</span>
                        </div>
                        <p className="text-xs text-charcoal-300">{breedName(animal.breed_id)}{photoCount || videoCount ? ` · ${photoCount} photo${photoCount !== 1 ? 's' : ''}, ${videoCount} video${videoCount !== 1 ? 's' : ''}` : ''}</p>
                        {(() => { const doc = media.find(m => m.media_type === 'document'); return doc ? (
                          <a href={doc.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 mt-0.5">
                            <FileText className="w-3 h-3" /> Bill of Sale PDF
                          </a>
                        ) : null; })()}
                        {animal.price && <p className="text-sm font-semibold text-sage-600 mt-0.5">${Number(animal.price).toLocaleString()}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setShareAnimal(shareAnimal === animal.id ? null : animal.id)}
                          className={`p-2 ${shareAnimal === animal.id ? 'text-blue-500' : 'text-charcoal-300 hover:text-blue-500'}`} title="Share to social media">
                          <Share2 className="w-4 h-4" />
                        </button>
                        {animal.role !== 'sold' && (
                          <>
                            <button onClick={() => {
                              sessionStorage.setItem('ccf_bill_of_sale_animal', JSON.stringify(animal));
                              window.location.href = '/bill-of-sale';
                            }} className="p-2 text-charcoal-300 hover:text-amber-600" title="Bill of Sale">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button onClick={async () => {
                              if (confirm(`Mark ${animal.name} as sold?`)) {
                                await markAsSold(animal.id);
                                loadData();
                              }
                            }} className="p-2 text-charcoal-300 hover:text-green-600" title="Mark as sold">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => { setEditAnimal(animal); setShowForm(true); }} className="p-2 text-charcoal-300 hover:text-sage-500"><Save className="w-4 h-4" /></button>
                        <button onClick={async () => { if (confirm('Delete this animal?')) { await deleteAnimal(animal.id); loadData(); } }}
                          className="p-2 text-charcoal-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {/* Social post type picker */}
                    {shareAnimal === animal.id && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 mb-2">What type of post?</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { type: 'new_listing', label: '🆕 New Listing', desc: 'Announce a new animal' },
                            { type: 'still_available', label: '🔄 Still Available', desc: 'Reminder post' },
                            { type: 'price_update', label: '💰 Price Drop', desc: 'Special pricing' },
                            { type: 'new_media', label: '📸 New Photo/Video', desc: 'Fresh content' },
                            { type: 'breeding', label: '🧬 Breeding News', desc: 'Breeding announcement' },
                            { type: 'sold', label: '🎉 Just Sold', desc: 'Success story' },
                          ].map(opt => (
                            <button key={opt.type} onClick={() => {
                              const breed = breeds.find(b => b.id === animal.breed_id);
                              sessionStorage.setItem('ccf_social_preview', JSON.stringify({
                                animal: animal,
                                animal_id: animal.id,
                                breedName: breed?.name || '',
                                name: animal.name,
                                breed: breed?.slug || '',
                                sex: animal.sex,
                                role: animal.role,
                                price: animal.price,
                                description: animal.description,
                                post_type: opt.type,
                                post_type_label: opt.label,
                              }));
                              sessionStorage.setItem('ccf_admin_key', getAdminKey());
                              window.location.href = '/social';
                            }}
                              className="bg-white border border-blue-100 rounded-lg p-2 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors">
                              <span className="text-sm">{opt.label}</span>
                              <span className="block text-[10px] text-charcoal-300">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                        <button onClick={() => setShareAnimal(null)} className="mt-2 text-[10px] text-charcoal-300 hover:text-charcoal-500">Cancel</button>
                      </div>
                    )}
                    <div className="mt-3">
                      <MediaUploader animalId={animal.id} existingMedia={media} onUpdate={loadData} />
                    </div>
                  </div>
                );
              })}
              {animals.length === 0 && <div className="text-center py-12 text-charcoal-300"><p className="font-body">No animals yet. Tap "Add Animal" to get started!</p></div>}
            </div>
          </>
        )}

        {tab === 'contacts' && (
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className={`bg-white rounded-xl border p-4 ${c.read ? 'border-cream-200' : 'border-sage-300 bg-sage-50/30'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-charcoal-600 text-sm">{c.name}</p>
                    <p className="text-xs text-charcoal-300">{c.email} {c.phone && `· ${c.phone}`}</p>
                    {c.interest && <span className="text-[10px] bg-cream-100 text-charcoal-400 px-2 py-0.5 rounded-full mt-1 inline-block">{c.interest}</span>}
                  </div>
                  <span className="text-[10px] text-charcoal-300">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-charcoal-500 mt-2 leading-relaxed">{c.message}</p>
                {!c.read && <button onClick={async () => { await markContactRead(c.id); loadData(); }} className="mt-2 text-xs text-sage-500 font-semibold">Mark as read</button>}
              </div>
            ))}
            {contacts.length === 0 && <p className="text-center py-12 text-charcoal-300 font-body">No messages yet.</p>}
          </div>
        )}
      </div>
    </>
  );
}

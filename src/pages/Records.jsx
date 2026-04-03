import { useState, useEffect } from 'react';
import { getSavedSession, checkDeviceAuth, getDeviceToken } from '../lib/adminAuth';
import { setAdminKey } from '../lib/adminApi';
import { Lock, Plus, Search, FileText, Syringe, Scissors, Heart, Calendar, Upload, Trash2, ChevronDown, Check, Printer, ClipboardList } from 'lucide-react';
import SEO from '../components/SEO';

const API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';
const adminKey = () => sessionStorage.getItem('ccf_admin_key') || '';
const headers = () => ({ 'Content-Type': 'application/json', 'x-admin-key': adminKey() });

const RECORD_TYPES = [
  { value: 'vaccination', label: 'Vaccination', icon: '💉', color: 'bg-blue-100 text-blue-700' },
  { value: 'care', label: 'Care/Maintenance', icon: '✂️', color: 'bg-green-100 text-green-700' },
  { value: 'medical', label: 'Medical/Vet', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { value: 'breeding', label: 'Breeding', icon: '❤️', color: 'bg-pink-100 text-pink-700' },
  { value: 'note', label: 'General Note', icon: '📝', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'document', label: 'Document', icon: '📄', color: 'bg-purple-100 text-purple-700' },
];

const COMMON_RECORDS = [
  { title: 'CDT Vaccination', type: 'vaccination' },
  { title: 'Rabies Vaccination', type: 'vaccination' },
  { title: 'Copper Bolus', type: 'care' },
  { title: 'Hoof Trimming', type: 'care' },
  { title: 'Shearing', type: 'care' },
  { title: 'Deworming', type: 'medical' },
  { title: 'Vet Check-up', type: 'medical' },
  { title: 'Weight Check', type: 'care' },
];

const GESTATION = { sheep: 147, goat: 150, rabbit: 31, dog: 63, chicken: 21 };

export default function Records() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('records'); // records, breeding, add
  const [animals, setAnimals] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [records, setRecords] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [filterAnimal, setFilterAnimal] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddBreeding, setShowAddBreeding] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');

  // Auth
  useEffect(() => {
    const tryAuth = async () => {
      const key = getSavedSession();
      if (key) {
        setAdminKey(key); sessionStorage.setItem('ccf_admin_key', key);
        setAuthed(true); setChecking(false); return;
      }
      const result = await checkDeviceAuth();
      if (result.success) {
        setAdminKey('ccf2025admin'); sessionStorage.setItem('ccf_admin_key', 'ccf2025admin');
        setAuthed(true);
      }
      setChecking(false);
    };
    tryAuth();
  }, []);

  // Load data
  useEffect(() => {
    if (!authed) return;
    loadData();
  }, [authed]);

  const loadData = async () => {
    const [animalsRes, breedsRes, recordsRes, breedingRes] = await Promise.all([
      fetch(`${API}/animals`, { headers: headers() }).then(r => r.json()),
      fetch(`${API}/breeds`, { headers: headers() }).then(r => r.json()),
      fetch(`${API}/records`, { headers: headers() }).then(r => r.json()),
      fetch(`${API}/breeding`, { headers: headers() }).then(r => r.json()),
    ]);
    if (Array.isArray(animalsRes)) setAnimals(animalsRes);
    if (Array.isArray(breedsRes)) setBreeds(breedsRes);
    if (Array.isArray(recordsRes)) setRecords(recordsRes);
    if (Array.isArray(breedingRes)) setBreedingRecords(breedingRes);
  };

  const breedName = (id) => breeds.find(b => b.id === id)?.short_name || '';
  const animalName = (id) => animals.find(a => a.id === id)?.name || '';

  const filteredRecords = records.filter(r => {
    if (filterAnimal && r.animal_id !== filterAnimal) return false;
    if (filterType && r.record_type !== filterType) return false;
    if (filterBreed && r.animals?.breed_id !== filterBreed) return false;
    return true;
  });

  const expectingBreedings = breedingRecords.filter(b => b.status === 'expecting');

  if (checking) return null;
  if (!authed) return (
    <div className="max-w-sm mx-auto px-4 py-24 text-center">
      <Lock className="w-12 h-12 text-sage-500 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-4">Animal Records</h1>
      <p className="text-sm text-charcoal-300">Please log in via the Admin page first.</p>
      <a href="/admin" className="inline-block mt-4 bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Go to Admin</a>
    </div>
  );

  return (
    <>
      <SEO title="Animal Records" description="Health, care, and breeding records" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl font-bold text-charcoal-600">Animal Records</h1>
            <p className="text-xs text-charcoal-300">{records.length} records · {expectingBreedings.length} expecting</p>
          </div>
          <button onClick={() => { setShowAddRecord(true); setSelectedAnimalId(''); }}
            className="bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[['records', 'Health & Care'], ['breeding', 'Breeding']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === key ? 'bg-sage-500 text-white' : 'bg-cream-100 text-charcoal-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* HEALTH & CARE TAB */}
        {tab === 'records' && (
          <>
            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              <select value={filterAnimal} onChange={e => setFilterAnimal(e.target.value)}
                className="text-xs bg-cream-50 border border-cream-200 rounded-lg px-2 py-1.5 text-charcoal-500">
                <option value="">All animals</option>
                {animals.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                className="text-xs bg-cream-50 border border-cream-200 rounded-lg px-2 py-1.5 text-charcoal-500">
                <option value="">All types</option>
                {RECORD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={filterBreed} onChange={e => setFilterBreed(e.target.value)}
                className="text-xs bg-cream-50 border border-cream-200 rounded-lg px-2 py-1.5 text-charcoal-500">
                <option value="">All breeds</option>
                {breeds.map(b => <option key={b.id} value={b.id}>{b.short_name}</option>)}
              </select>
            </div>

            {/* Records list */}
            {filteredRecords.length === 0 ? (
              <div className="bg-cream-50 rounded-xl p-8 text-center border border-cream-200">
                <ClipboardList className="w-10 h-10 text-cream-300 mx-auto mb-3" />
                <p className="text-charcoal-400 font-medium mb-1">No records yet</p>
                <p className="text-xs text-charcoal-300">Tap "Add Record" to log vaccinations, care, and more.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRecords.map(r => {
                  const typeInfo = RECORD_TYPES.find(t => t.value === r.record_type) || RECORD_TYPES[4];
                  return (
                    <div key={r.id} className="bg-white border border-cream-200 rounded-xl p-3 flex items-start gap-3">
                      <span className="text-lg mt-0.5">{typeInfo.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-charcoal-600">{r.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                        </div>
                        <p className="text-xs text-charcoal-400 mt-0.5">{r.animals?.name || animalName(r.animal_id)} · {new Date(r.record_date).toLocaleDateString()}</p>
                        {r.description && <p className="text-xs text-charcoal-300 mt-1">{r.description}</p>}
                        {r.next_due_date && <p className="text-[10px] text-sage-500 mt-1">Next due: {new Date(r.next_due_date).toLocaleDateString()}</p>}
                        {r.document_url && (
                          <a href={r.document_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[10px] text-blue-500 mt-1">
                            <FileText className="w-3 h-3" /> View Document
                          </a>
                        )}
                      </div>
                      <button onClick={async () => {
                        if (confirm('Delete this record?')) {
                          await fetch(`${API}/records/${r.id}`, { method: 'DELETE', headers: headers() });
                          loadData();
                        }
                      }} className="text-charcoal-200 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* BREEDING TAB */}
        {tab === 'breeding' && (
          <>
            <button onClick={() => setShowAddBreeding(true)}
              className="mb-4 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1">
              <Heart className="w-4 h-4" /> Log Breeding
            </button>

            {/* Expecting countdown */}
            {expectingBreedings.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-charcoal-500 mb-2">🐣 Expecting</h2>
                <div className="space-y-2">
                  {expectingBreedings.map(b => {
                    const due = new Date(b.due_date);
                    const today = new Date();
                    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                    const progress = Math.min(100, Math.max(0, ((b.gestation_days - daysLeft) / b.gestation_days) * 100));
                    return (
                      <div key={b.id} className="bg-white border border-pink-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-sm text-charcoal-600">{b.dam_name || animalName(b.dam_id)}</span>
                            <span className="text-xs text-charcoal-300"> × {b.sire_name || animalName(b.sire_id) || 'Unknown'}</span>
                          </div>
                          <span className={`text-sm font-bold ${daysLeft <= 7 ? 'text-red-500' : daysLeft <= 14 ? 'text-orange-500' : 'text-sage-600'}`}>
                            {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? 'TODAY!' : `${Math.abs(daysLeft)}d overdue`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-pink-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-charcoal-300">
                          <span>Bred: {new Date(b.date_bred).toLocaleDateString()}</span>
                          <span>Due: {due.toLocaleDateString()}</span>
                          <span>{b.species} · {b.gestation_days}d</span>
                        </div>
                        {b.notes && <p className="text-xs text-charcoal-400 mt-2">{b.notes}</p>}
                        <div className="flex gap-2 mt-2">
                          <button onClick={async () => {
                            const count = prompt('How many born?');
                            if (count === null) return;
                            const live = prompt('How many alive?');
                            await fetch(`${API}/breeding/${b.id}`, {
                              method: 'PUT', headers: headers(),
                              body: JSON.stringify({ status: 'born', actual_birth_date: new Date().toISOString().split('T')[0], litter_count: parseInt(count), live_count: parseInt(live || count) })
                            });
                            loadData();
                          }} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">🐣 Born</button>
                          <button onClick={async () => {
                            if (confirm('Mark as lost?')) {
                              const notes = prompt('Notes?') || '';
                              await fetch(`${API}/breeding/${b.id}`, {
                                method: 'PUT', headers: headers(),
                                body: JSON.stringify({ status: 'lost', mortality_notes: notes })
                              });
                              loadData();
                            }
                          }} className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">Lost</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past breedings */}
            {breedingRecords.filter(b => b.status !== 'expecting').length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-charcoal-500 mb-2">History</h2>
                <div className="space-y-2">
                  {breedingRecords.filter(b => b.status !== 'expecting').map(b => (
                    <div key={b.id} className="bg-white border border-cream-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm text-charcoal-600">{b.dam_name || animalName(b.dam_id)}</span>
                          <span className="text-xs text-charcoal-300"> × {b.sire_name || animalName(b.sire_id)}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          b.status === 'born' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{b.status}</span>
                      </div>
                      <p className="text-[10px] text-charcoal-300 mt-1">
                        Bred: {new Date(b.date_bred).toLocaleDateString()}
                        {b.actual_birth_date && ` · Born: ${new Date(b.actual_birth_date).toLocaleDateString()}`}
                        {b.litter_count && ` · ${b.live_count}/${b.litter_count} survived`}
                      </p>
                      {b.mortality_notes && <p className="text-[10px] text-charcoal-400 mt-1">{b.mortality_notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ADD RECORD MODAL */}
        {showAddRecord && (
          <AddRecordModal animals={animals} breeds={breeds} preSelectedAnimal={selectedAnimalId}
            onClose={() => setShowAddRecord(false)} onSave={() => { loadData(); setShowAddRecord(false); }} />
        )}

        {/* ADD BREEDING MODAL */}
        {showAddBreeding && (
          <AddBreedingModal animals={animals} breeds={breeds}
            onClose={() => setShowAddBreeding(false)} onSave={() => { loadData(); setShowAddBreeding(false); }} />
        )}
      </div>
    </>
  );
}

function AddRecordModal({ animals, breeds, preSelectedAnimal, onClose, onSave }) {
  const [form, setForm] = useState({
    record_type: 'vaccination', title: '', description: '', record_date: new Date().toISOString().split('T')[0],
    next_due_date: '', animal_ids: preSelectedAnimal ? [preSelectedAnimal] : [],
  });
  const [bulkBreed, setBulkBreed] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const toggleAnimal = (id) => {
    setForm(f => ({
      ...f,
      animal_ids: f.animal_ids.includes(id) ? f.animal_ids.filter(a => a !== id) : [...f.animal_ids, id]
    }));
  };

  const selectAllBreed = (breedId) => {
    const breedAnimals = animals.filter(a => a.breed_id === breedId).map(a => a.id);
    setForm(f => ({ ...f, animal_ids: [...new Set([...f.animal_ids, ...breedAnimals])] }));
  };

  const save = async () => {
    if (!form.title || form.animal_ids.length === 0) { alert('Select at least one animal and enter a title'); return; }
    setSaving(true);
    const body = {
      animal_ids: form.animal_ids,
      record_type: form.record_type,
      title: form.title,
      description: form.description || null,
      record_date: form.record_date,
      next_due_date: form.next_due_date || null,
    };
    const res = await fetch(`${API}/records`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    const data = await res.json();

    // Upload document if provided
    if (uploadFile && Array.isArray(data) && data.length > 0) {
      for (const record of data) {
        const fd = new FormData();
        fd.append('file', uploadFile);
        fd.append('record_id', record.id);
        fd.append('animal_id', record.animal_id);
        await fetch(`${API}/records/upload`, { method: 'POST', headers: { 'x-admin-key': sessionStorage.getItem('ccf_admin_key') }, body: fd });
      }
    }

    setSaving(false);
    onSave();
  };

  const filteredAnimals = bulkBreed ? animals.filter(a => a.breed_id === bulkBreed) : animals;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-lg font-bold text-charcoal-600 mb-4">Add Record</h2>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {COMMON_RECORDS.map(cr => (
            <button key={cr.title} onClick={() => setForm(f => ({ ...f, title: cr.title, record_type: cr.type }))}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${form.title === cr.title ? 'bg-sage-500 text-white border-sage-500' : 'bg-cream-50 text-charcoal-500 border-cream-200'}`}>
              {cr.title}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <select value={form.record_type} onChange={e => setForm(f => ({ ...f, record_type: e.target.value }))}
            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
            {RECORD_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>

          <input placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" />

          <textarea placeholder="Notes (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" rows={2} />

          <div>
            <label className="text-[10px] text-charcoal-400 block mb-1">Date</label>
            <input type="date" value={form.record_date} onChange={e => setForm(f => ({ ...f, record_date: e.target.value }))}
              className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-[10px] text-charcoal-400 block mb-1">Next Due Date (optional — for recurring treatments)</label>
            <input type="date" value={form.next_due_date} onChange={e => setForm(f => ({ ...f, next_due_date: e.target.value }))}
              className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>

          {/* Document upload */}
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal-400 bg-cream-50 border border-cream-200 rounded-xl px-3 py-2.5">
            <Upload className="w-4 h-4" />
            {uploadFile ? uploadFile.name : 'Attach document (optional)'}
            <input type="file" className="hidden" onChange={e => setUploadFile(e.target.files[0])} />
          </label>

          {/* Animal selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-charcoal-500">Select Animals ({form.animal_ids.length})</label>
              <select value={bulkBreed} onChange={e => { setBulkBreed(e.target.value); if (e.target.value) selectAllBreed(e.target.value); }}
                className="text-[10px] bg-cream-50 border border-cream-200 rounded-lg px-2 py-1">
                <option value="">Select all by breed</option>
                {breeds.map(b => <option key={b.id} value={b.id}>All {b.short_name}</option>)}
              </select>
            </div>
            <div className="max-h-40 overflow-y-auto border border-cream-200 rounded-xl p-2 space-y-1">
              {animals.map(a => (
                <button key={a.id} onClick={() => toggleAnimal(a.id)}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    form.animal_ids.includes(a.id) ? 'bg-sage-100 text-sage-700 font-medium' : 'text-charcoal-500 hover:bg-cream-50'
                  }`}>
                  {form.animal_ids.includes(a.id) && <Check className="w-3.5 h-3.5 text-sage-500" />}
                  <span>{a.name}</span>
                  <span className="text-[10px] text-charcoal-300 ml-auto">{breeds.find(b => b.id === a.breed_id)?.short_name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-cream-100 text-charcoal-500 rounded-full text-sm font-medium">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white rounded-full text-sm font-bold">
            {saving ? 'Saving...' : `Save for ${form.animal_ids.length} animal${form.animal_ids.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddBreedingModal({ animals, breeds, onClose, onSave }) {
  const [form, setForm] = useState({
    dam_id: '', sire_id: '', dam_name: '', sire_name: '', species: 'goat',
    date_bred: new Date().toISOString().split('T')[0], notes: '',
  });
  const [saving, setSaving] = useState(false);

  const dueDate = form.date_bred ? new Date(new Date(form.date_bred).getTime() + (GESTATION[form.species] || 150) * 86400000).toLocaleDateString() : '';

  const save = async () => {
    if (!form.date_bred || !form.species) { alert('Date bred and species required'); return; }
    setSaving(true);
    const body = {
      dam_id: form.dam_id || null,
      sire_id: form.sire_id || null,
      dam_name: form.dam_name || (form.dam_id ? animals.find(a => a.id === form.dam_id)?.name : ''),
      sire_name: form.sire_name || (form.sire_id ? animals.find(a => a.id === form.sire_id)?.name : ''),
      species: form.species,
      date_bred: form.date_bred,
      notes: form.notes || null,
    };
    await fetch(`${API}/breeding`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    setSaving(false);
    onSave();
  };

  const females = animals.filter(a => a.sex === 'female');
  const males = animals.filter(a => a.sex === 'male');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-lg font-bold text-charcoal-600 mb-4">❤️ Log Breeding</h2>

        <div className="space-y-3">
          <select value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))}
            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
            {Object.entries(GESTATION).map(([k, v]) => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)} ({v} day gestation)</option>)}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-charcoal-400 block mb-1">Dam (mother)</label>
              <select value={form.dam_id} onChange={e => setForm(f => ({ ...f, dam_id: e.target.value }))}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                <option value="">Select or type below</option>
                {females.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input placeholder="Or type dam name" value={form.dam_name} onChange={e => setForm(f => ({ ...f, dam_name: e.target.value }))}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-charcoal-400 block mb-1">Sire (father)</label>
              <select value={form.sire_id} onChange={e => setForm(f => ({ ...f, sire_id: e.target.value }))}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                <option value="">Select or type below</option>
                {males.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input placeholder="Or type sire name" value={form.sire_name} onChange={e => setForm(f => ({ ...f, sire_name: e.target.value }))}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm mt-1" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-charcoal-400 block mb-1">Date Bred</label>
            <input type="date" value={form.date_bred} onChange={e => setForm(f => ({ ...f, date_bred: e.target.value }))}
              className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>

          {dueDate && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-center">
              <p className="text-xs text-pink-500">Estimated Due Date</p>
              <p className="text-lg font-bold text-pink-700">{dueDate}</p>
              <p className="text-[10px] text-pink-400">{GESTATION[form.species]} day gestation</p>
            </div>
          )}

          <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm" rows={2} />
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-cream-100 text-charcoal-500 rounded-full text-sm font-medium">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded-full text-sm font-bold">
            {saving ? 'Saving...' : 'Log Breeding'}
          </button>
        </div>
      </div>
    </div>
  );
}

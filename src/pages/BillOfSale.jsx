import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, FileText, Send, Loader, Download, Check } from 'lucide-react';
import { getSavedSession } from '../lib/adminAuth';
import { setAdminKey, getAdminKey } from '../lib/adminApi';
import SEO from '../components/SEO';

const ADMIN_API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';
const SUPABASE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6em9ma2VmYnJxdnNma3dvamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTUwNjMsImV4cCI6MjA5MDI5MTA2M30.euvg_NuoNi_tgioOJFB2nvV7Cbe1J5_-veE8Z3Qw0JY';

const SELLER = {
  name: 'Cashmere Cottontail Farm',
  owner: 'Scott Barnes',
  address: 'Winslow, AR 72959',
  phone: '(479) 531-0849',
  email: '',
};

// Signature pad component
function SignaturePad({ label, onSave, saved }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#1a1816';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasContent(true);
  };

  const end = (e) => {
    e.preventDefault();
    setDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  const save = () => {
    if (!hasContent) return;
    onSave(canvasRef.current.toDataURL('image/png'));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-charcoal-600">{label}</p>
      <div className={`border-2 rounded-xl overflow-hidden ${saved ? 'border-green-400 bg-green-50' : 'border-charcoal-200'}`}>
        {saved ? (
          <div className="h-28 flex items-center justify-center gap-2 text-green-600">
            <Check className="w-5 h-5" /> Signature captured
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-28 bg-white touch-none"
            onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={draw} onTouchEnd={end} />
        )}
      </div>
      {!saved && (
        <div className="flex gap-2">
          <button onClick={clear} className="text-xs text-charcoal-300 hover:text-charcoal-500">Clear</button>
          <button onClick={save} disabled={!hasContent}
            className="text-xs font-semibold text-sage-500 hover:text-sage-600 disabled:opacity-30">Accept Signature</button>
        </div>
      )}
    </div>
  );
}

export default function BillOfSale() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [buyer, setBuyer] = useState({ name: '', address: '', city: '', state: 'AR', zip: '', phone: '', email: '' });
  const [sellerSig, setSellerSig] = useState(null);
  const [buyerSig, setBuyerSig] = useState(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const set = (k, v) => setBuyer(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    const key = getSavedSession();
    if (key) {
      setAdminKey(key);
      sessionStorage.setItem('ccf_admin_key', key);
      // Load animals
      fetch(`${ADMIN_API}/animals`, { headers: { 'x-admin-key': key } })
        .then(r => r.json()).then(data => {
          if (Array.isArray(data)) setAnimals(data.filter(a => a.role === 'available'));
          setAuthed(true);
        }).catch(() => {});
    }
    setChecking(false);
  }, []);

  // Also check if coming from admin with a pre-selected animal
  useEffect(() => {
    const preselected = sessionStorage.getItem('ccf_bill_of_sale_animal');
    if (preselected && animals.length) {
      const parsed = JSON.parse(preselected);
      const match = animals.find(a => a.id === parsed.id);
      if (match) setSelectedAnimal(match);
      sessionStorage.removeItem('ccf_bill_of_sale_animal');
    }
  }, [animals]);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const generateAndSend = async () => {
    if (!selectedAnimal || !buyer.name || !buyerSig || !sellerSig) {
      alert('Please fill in buyer info and capture both signatures');
      return;
    }
    setSending(true);

    // Build the bill of sale HTML for PDF generation
    const price = selectedAnimal.price ? Number(selectedAnimal.price) : 0;
    const billHtml = buildBillHtml(selectedAnimal, buyer, price, today, sellerSig, buyerSig);

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billHtml);
    printWindow.document.close();

    // Mark animal as sold
    try {
      const key = sessionStorage.getItem('ccf_admin_key');
      await fetch(`${ADMIN_API}/animals/${selectedAnimal.id}/sold`, {
        method: 'PUT', headers: { 'x-admin-key': key }
      });
    } catch (e) { console.error('Failed to mark as sold:', e); }

    setDone(true);
    setSending(false);
  };

  if (checking) return null;
  if (!authed) return (
    <><SEO title="Bill of Sale" /><div className="max-w-sm mx-auto px-4 py-24 text-center">
      <p className="font-body text-charcoal-400 mb-4">Log in first.</p>
      <a href="/admin" className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Go to Admin</a>
    </div></>
  );

  if (done) return (
    <><SEO title="Bill of Sale Complete" />
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Bill of Sale Complete!</h1>
      <p className="font-body text-charcoal-400 mb-2">A print window has opened with the bill of sale.</p>
      <p className="font-body text-sm text-charcoal-300 mb-6">Use your browser's Share or Print to save as PDF or send via email/text.</p>
      <p className="font-body text-sm text-charcoal-300 mb-6">{selectedAnimal.name} has been marked as sold.</p>
      <a href="/admin" className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Back to Admin</a>
    </div></>
  );

  return (
    <><SEO title="Bill of Sale" />
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin" className="text-charcoal-300"><ArrowLeft className="w-5 h-5" /></a>
        <h1 className="font-display text-xl font-bold text-charcoal-600">Bill of Sale</h1>
      </div>

      {/* Animal selector */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-charcoal-500 block mb-2">Select Animal</label>
        <select value={selectedAnimal?.id || ''} onChange={e => {
          const a = animals.find(x => x.id === e.target.value);
          setSelectedAnimal(a || null);
        }} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600">
          <option value="">Choose an animal...</option>
          {animals.map(a => (
            <option key={a.id} value={a.id}>{a.name} — {a.sex} — ${a.price || '0'}</option>
          ))}
        </select>
      </div>

      {selectedAnimal && (
        <>
          {/* Animal details */}
          <div className="bg-cream-100 rounded-xl p-4 mb-5 border border-cream-200">
            <p className="font-display font-bold text-charcoal-600">{selectedAnimal.name}</p>
            <p className="text-xs text-charcoal-400">{selectedAnimal.sex} · {selectedAnimal.description || 'No description'}</p>
            <p className="text-lg font-bold text-charcoal-700 mt-1">${Number(selectedAnimal.price || 0).toLocaleString()}.00</p>
          </div>

          {/* Buyer info */}
          <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Buyer Information</h2>
          <div className="space-y-3 mb-5">
            <input placeholder="Buyer full legal name *" value={buyer.name} onChange={e => set('name', e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <input placeholder="Street address" value={buyer.address} onChange={e => set('address', e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="City" value={buyer.city} onChange={e => set('city', e.target.value)}
                className="col-span-1 px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
              <input placeholder="State" value={buyer.state} onChange={e => set('state', e.target.value)}
                className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
              <input placeholder="Zip" value={buyer.zip} onChange={e => set('zip', e.target.value)}
                className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Phone" value={buyer.phone} onChange={e => set('phone', e.target.value)} type="tel"
                className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
              <input placeholder="Email" value={buyer.email} onChange={e => set('email', e.target.value)} type="email"
                className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            </div>
          </div>

          {/* Signatures */}
          <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Signatures</h2>
          <div className="space-y-4 mb-6">
            <SignaturePad label="Seller Signature (Cashmere Cottontail Farm)" onSave={setSellerSig} saved={!!sellerSig} />
            <SignaturePad label="Buyer Signature" onSave={setBuyerSig} saved={!!buyerSig} />
          </div>

          {/* Generate */}
          <button onClick={generateAndSend} disabled={sending || !buyer.name || !sellerSig || !buyerSig}
            className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
            {sending ? <><Loader className="w-5 h-5 animate-spin" /> Generating...</> : <><FileText className="w-5 h-5" /> Generate Bill of Sale</>}
          </button>
        </>
      )}
    </div></>
  );
}

function buildBillHtml(animal, buyer, price, date, sellerSig, buyerSig) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bill of Sale - ${animal.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 0 auto; padding: 24px; color: #1a1816; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 22px; text-align: center; margin-bottom: 4px; letter-spacing: 2px; text-transform: uppercase; }
  .subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 24px; }
  .header-line { border-top: 2px solid #1a1816; border-bottom: 1px solid #1a1816; padding: 6px 0; margin-bottom: 20px; text-align: center; font-weight: bold; font-size: 14px; }
  .section { margin-bottom: 16px; }
  .section-title { font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
  .row { display: flex; gap: 16px; margin-bottom: 6px; }
  .row .label { font-weight: bold; min-width: 100px; }
  .terms { font-size: 11px; line-height: 1.5; color: #333; }
  .terms p { margin-bottom: 8px; }
  .sig-row { display: flex; gap: 32px; margin-top: 32px; }
  .sig-block { flex: 1; }
  .sig-block img { height: 60px; display: block; margin-bottom: 4px; }
  .sig-line { border-top: 1px solid #1a1816; padding-top: 4px; font-size: 11px; }
  .footer { margin-top: 32px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #ccc; padding-top: 12px; }
  @media print { body { padding: 12px; } }
</style></head><body>
<h1>Livestock Bill of Sale</h1>
<p class="subtitle">State of Arkansas</p>
<div class="header-line">Cashmere Cottontail Farm — Winslow, Arkansas</div>

<div class="section">
  <div class="section-title">Seller Information</div>
  <div class="row"><span class="label">Name:</span> Cashmere Cottontail Farm (Scott Barnes, Owner)</div>
  <div class="row"><span class="label">Address:</span> Winslow, AR 72959</div>
  <div class="row"><span class="label">Phone:</span> (479) 531-0849</div>
</div>

<div class="section">
  <div class="section-title">Buyer Information</div>
  <div class="row"><span class="label">Name:</span> ${buyer.name}</div>
  <div class="row"><span class="label">Address:</span> ${buyer.address}${buyer.city ? ', ' + buyer.city : ''}${buyer.state ? ', ' + buyer.state : ''} ${buyer.zip}</div>
  <div class="row"><span class="label">Phone:</span> ${buyer.phone || 'N/A'}</div>
  <div class="row"><span class="label">Email:</span> ${buyer.email || 'N/A'}</div>
</div>

<div class="section">
  <div class="section-title">Animal Description</div>
  <div class="row"><span class="label">Name:</span> ${animal.name}</div>
  <div class="row"><span class="label">Species/Breed:</span> ${animal.description || 'N/A'}</div>
  <div class="row"><span class="label">Sex:</span> ${animal.sex}</div>
  <div class="row"><span class="label">Date of Birth:</span> ${animal.date_of_birth || 'N/A'}</div>
  <div class="row"><span class="label">Registration #:</span> ${animal.registration || 'N/A'}</div>
  <div class="row"><span class="label">Sire:</span> ${animal.sire_name || 'N/A'}</div>
  <div class="row"><span class="label">Dam:</span> ${animal.dam_name || 'N/A'}</div>
</div>

<div class="section">
  <div class="section-title">Transaction Details</div>
  <div class="row"><span class="label">Sale Date:</span> ${date}</div>
  <div class="row"><span class="label">Sale Price:</span> $${price.toLocaleString()}.00</div>
  <div class="row"><span class="label">Payment:</span> Paid in full</div>
</div>

<div class="section">
  <div class="section-title">Terms &amp; Conditions</div>
  <div class="terms">
    <p>1. <strong>Transfer of Ownership.</strong> Seller hereby transfers and conveys to Buyer all right, title, and interest in the above-described animal(s) in exchange for the purchase price stated above.</p>
    <p>2. <strong>AS-IS Sale.</strong> The animal(s) described herein are sold "AS-IS" and "WHERE-IS" without any express or implied warranties regarding health, condition, temperament, or fitness for any particular purpose, except as may be separately agreed to in writing.</p>
    <p>3. <strong>Health Guarantee.</strong> Seller represents that to the best of their knowledge, the animal(s) are in good health at the time of sale. Buyer is encouraged to have the animal(s) examined by a licensed veterinarian within 72 hours of purchase.</p>
    <p>4. <strong>Assumption of Risk.</strong> Upon execution of this Bill of Sale and transfer of possession, Buyer assumes all risk and responsibility for the care, feeding, housing, and well-being of the animal(s).</p>
    <p>5. <strong>No Returns.</strong> All sales are final. No refunds or exchanges will be provided.</p>
    <p>6. <strong>Governing Law.</strong> This Bill of Sale shall be governed by and construed in accordance with the laws of the State of Arkansas.</p>
  </div>
</div>

<div class="sig-row">
  <div class="sig-block">
    <img src="${sellerSig}" alt="Seller signature" />
    <div class="sig-line"><strong>Seller:</strong> ${SELLER.owner}<br/>Date: ${date}</div>
  </div>
  <div class="sig-block">
    <img src="${buyerSig}" alt="Buyer signature" />
    <div class="sig-line"><strong>Buyer:</strong> ${buyer.name}<br/>Date: ${date}</div>
  </div>
</div>

<div class="footer">
  Cashmere Cottontail Farm · Winslow, Arkansas · (479) 531-0849 · cashmerecottontailfarm.com<br/>
  This document serves as a legal bill of sale for the transfer of livestock in the State of Arkansas.
</div>

<script>window.onload = function() { window.print(); }</script>
</body></html>`;
}

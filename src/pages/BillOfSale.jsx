import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, FileText, Send, Loader, Check } from 'lucide-react';
import { getSavedSession } from '../lib/adminAuth';
import { setAdminKey, getAdminKey } from '../lib/adminApi';
import SEO from '../components/SEO';

const ADMIN_API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';
const BILL_API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/bill-of-sale';

const SELLER = {
  business: 'Cashmere Cottontail Farm, LLC',
  name: 'Raegon Barnes',
  address: '17799 Bethlehem Rd',
  cityStateZip: 'Winslow, AR 72762',
  phone: '(479) 531-0849',
};

function SignaturePad({ label, onSave, saved }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    c.width = r.width * 2; c.height = r.height * 2;
    const ctx = c.getContext('2d');
    ctx.scale(2, 2); ctx.strokeStyle = '#1a1816'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => { const r = canvasRef.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const start = (e) => { e.preventDefault(); setDrawing(true); const ctx = canvasRef.current.getContext('2d'); const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw = (e) => { if (!drawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasContent(true); };
  const end = (e) => { e.preventDefault(); setDrawing(false); };
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setHasContent(false); };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-charcoal-600">{label}</p>
      <div className={`border-2 rounded-xl overflow-hidden ${saved ? 'border-green-400 bg-green-50' : 'border-charcoal-200'}`}>
        {saved ? (
          <div className="h-32 flex items-center justify-center gap-2 text-green-600"><Check className="w-5 h-5" /> Signature captured</div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-32 bg-white touch-none"
            onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={draw} onTouchEnd={end} />
        )}
      </div>
      {!saved && (
        <div className="flex gap-2">
          <button onClick={clear} className="flex-1 py-2.5 text-sm text-charcoal-400 bg-cream-100 border border-cream-200 rounded-full font-semibold">Clear</button>
          <button onClick={() => { if (hasContent) onSave(canvasRef.current.toDataURL('image/png')); }} disabled={!hasContent}
            className="flex-[2] py-2.5 text-sm font-bold text-white bg-sage-500 rounded-full disabled:opacity-30 disabled:bg-charcoal-200">
            ✓ Accept Signature
          </button>
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
  const [buyer, setBuyer] = useState({ name: '', address: '', city: '', state: '', zip: '', phone: '', email: '' });
  const [buyerSig, setBuyerSig] = useState(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const set = (k, v) => setBuyer(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    const key = getSavedSession();
    if (key) {
      setAdminKey(key); sessionStorage.setItem('ccf_admin_key', key);
      fetch(`${ADMIN_API}/animals`, { headers: { 'x-admin-key': key } })
        .then(r => r.json()).then(data => {
          if (Array.isArray(data)) setAnimals(data);
          setAuthed(true);
        }).catch(() => {});
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    const pre = sessionStorage.getItem('ccf_bill_of_sale_animal');
    if (pre && animals.length) {
      const match = animals.find(a => a.id === JSON.parse(pre).id);
      if (match) setSelectedAnimal(match);
      sessionStorage.removeItem('ccf_bill_of_sale_animal');
    }
  }, [animals]);

  const submit = async () => {
    if (!selectedAnimal || !buyer.name || !buyerSig) {
      alert('Please fill in buyer name and signature'); return;
    }
    setSending(true);
    const price = selectedAnimal.price ? Number(selectedAnimal.price) : 0;
    const billHtml = buildBillHtml(selectedAnimal, buyer, price, today, buyerSig);

    // Generate lightweight PDF using jsPDF text methods
    let pdfBase64 = '';
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'letter');
      const w = doc.internal.pageSize.getWidth();
      let y = 15;
      const lm = 20; // left margin
      const rm = w - 20; // right margin
      const cw = rm - lm; // content width

      // Header
      doc.setFont('times', 'bold'); doc.setFontSize(18);
      doc.text('LIVESTOCK BILL OF SALE', w / 2, y, { align: 'center' }); y += 7;
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      doc.text('State of Arkansas', w / 2, y, { align: 'center' }); y += 5;
      doc.setLineWidth(0.5); doc.line(lm, y, rm, y); y += 5;
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('Cashmere Cottontail Farm, LLC \u2014 Winslow, Arkansas', w / 2, y, { align: 'center' }); y += 3;
      doc.setLineWidth(0.2); doc.line(lm, y, rm, y); y += 8;

      // Seller
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('SELLER', lm, y); y += 5;
      doc.setLineWidth(0.1); doc.line(lm, y, rm, y); y += 5;
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      const sellerLines = [
        ['Business:', 'Cashmere Cottontail Farm, LLC'],
        ['Representative:', 'Raegon Barnes'],
        ['Address:', '17799 Bethlehem Rd, Winslow, AR 72762'],
        ['Phone:', '(479) 531-0849'],
      ];
      sellerLines.forEach(([l, v]) => { doc.setFont('times', 'bold'); doc.text(l, lm, y); doc.setFont('times', 'normal'); doc.text(v, lm + 32, y); y += 5; });
      y += 3;

      // Buyer
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('BUYER', lm, y); y += 5;
      doc.line(lm, y, rm, y); y += 5;
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      const buyerAddr = [buyer.address, buyer.city, buyer.state, buyer.zip].filter(Boolean).join(', ');
      const buyerLines = [
        ['Name:', buyer.name],
        ['Address:', buyerAddr || 'N/A'],
        ['Phone:', buyer.phone || 'N/A'],
        ['Email:', buyer.email || 'N/A'],
      ];
      buyerLines.forEach(([l, v]) => { doc.setFont('times', 'bold'); doc.text(l, lm, y); doc.setFont('times', 'normal'); doc.text(v, lm + 32, y); y += 5; });
      y += 3;

      // Animal
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('ANIMAL DESCRIPTION', lm, y); y += 5;
      doc.line(lm, y, rm, y); y += 5;
      doc.setFontSize(10);
      const animalLines = [
        ['Name:', selectedAnimal.name],
        ['Description:', selectedAnimal.description || 'N/A'],
        ['Sex:', selectedAnimal.sex],
        ['Date of Birth:', selectedAnimal.date_of_birth || 'N/A'],
        ['Registration #:', selectedAnimal.registration || 'N/A'],
        ['Sire:', selectedAnimal.sire_name || 'N/A'],
        ['Dam:', selectedAnimal.dam_name || 'N/A'],
      ];
      animalLines.forEach(([l, v]) => {
        doc.setFont('times', 'bold'); doc.text(l, lm, y);
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(String(v), cw - 35);
        doc.text(lines, lm + 32, y); y += lines.length * 4.5;
      });
      y += 3;

      // Transaction
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('TRANSACTION', lm, y); y += 5;
      doc.line(lm, y, rm, y); y += 5;
      doc.setFontSize(10);
      [['Sale Date:', today], ['Sale Price:', '$' + price.toLocaleString() + '.00'], ['Payment:', 'Paid in full at time of sale']].forEach(([l, v]) => {
        doc.setFont('times', 'bold'); doc.text(l, lm, y); doc.setFont('times', 'normal'); doc.text(v, lm + 32, y); y += 5;
      });
      y += 3;

      // Terms
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('TERMS & CONDITIONS', lm, y); y += 5;
      doc.line(lm, y, rm, y); y += 5;
      doc.setFont('times', 'normal'); doc.setFontSize(8.5);
      const terms = [
        '1. Transfer of Ownership. Seller hereby transfers to Buyer all right, title, and interest in the above-described animal.',
        '2. AS-IS Sale. The animal is sold "AS-IS" without warranties regarding health, condition, or fitness for any purpose.',
        '3. Health. Seller represents that the animal is in good health at the time of sale. Buyer should have the animal examined by a veterinarian within 72 hours.',
        '4. Assumption of Risk. Upon transfer, Buyer assumes all responsibility for the animal.',
        '5. All Sales Final. No refunds or exchanges.',
        '6. Governing Law. This Bill of Sale is governed by the laws of the State of Arkansas.',
        '7. Entire Agreement. This document constitutes the entire agreement between the parties.',
      ];
      terms.forEach(t => { const lines = doc.splitTextToSize(t, cw); doc.text(lines, lm, y); y += lines.length * 3.5 + 1; });
      y += 5;

      // Signatures
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFont('times', 'bold'); doc.setFontSize(10);
      doc.text('Seller:', lm, y);
      doc.setFont('times', 'italic'); doc.setFontSize(18);
      doc.text('Raegon Barnes', lm, y + 8);
      doc.setFont('times', 'normal'); doc.setFontSize(8);
      doc.text('Cashmere Cottontail Farm, LLC', lm, y + 14);
      doc.text('Date: ' + today, lm, y + 18);

      // Buyer signature image
      doc.text('Buyer:', w / 2 + 5, y);
      try { doc.addImage(buyerSig, 'PNG', w / 2 + 5, y + 1, 50, 15); } catch (e) {}
      doc.setFontSize(8);
      doc.text(buyer.name, w / 2 + 5, y + 18);
      doc.text('Date: ' + today, w / 2 + 5, y + 22);
      y += 28;

      // Footer
      doc.setLineWidth(0.1); doc.line(lm, y, rm, y); y += 4;
      doc.setFontSize(7); doc.setFont('times', 'normal');
      doc.text('Cashmere Cottontail Farm, LLC \u00b7 17799 Bethlehem Rd \u00b7 Winslow, AR 72762 \u00b7 (479) 531-0849 \u00b7 cashmerecottontailfarm.com', w / 2, y, { align: 'center' });

      pdfBase64 = doc.output('datauristring').split(',')[1];
    } catch (e) {
      console.error('PDF generation error:', e);
    }

    // Send emails via Resend with PDF attachment
    let emailSent = false;
    try {
      const key = sessionStorage.getItem('ccf_admin_key');
      const emailRes = await fetch(BILL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({
          buyer_email: buyer.email || null,
          buyer_name: buyer.name,
          animal_name: selectedAnimal.name,
          html: billHtml,
          pdf_base64: pdfBase64 || null,
        })
      });
      const emailResult = await emailRes.json();
      emailSent = emailResult.success;
      if (!emailResult.success) console.warn('Email issue:', emailResult);
    } catch (e) { console.error('Email error:', e); }

    // Mark sold
    try {
      const key = sessionStorage.getItem('ccf_admin_key');
      await fetch(`${ADMIN_API}/animals/${selectedAnimal.id}/sold`, { method: 'PUT', headers: { 'x-admin-key': key } });
    } catch (e) { console.error(e); }

    setEmailSent(emailSent);

    setDone(true); setSending(false);
  };

  if (checking) return null;
  if (!authed) return (<><SEO title="Bill of Sale" /><div className="max-w-sm mx-auto px-4 py-24 text-center"><a href="/admin" className="bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Log in via Admin</a></div></>);

  if (done) return (
    <><SEO title="Bill of Sale Complete" />
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Sale Complete!</h1>
      {emailSent ? (
        <div className="mb-6">
          <p className="font-body text-charcoal-400 mb-1">Bill of sale emailed successfully.</p>
          {buyer.email && <p className="font-body text-sm text-charcoal-300">Buyer copy sent to: {buyer.email}</p>}
        </div>
      ) : (
        <p className="font-body text-charcoal-400 mb-6">There was an issue sending the email. Please try again from Admin.</p>
      )}
      <p className="font-body text-sm text-charcoal-300 mb-6">{selectedAnimal?.name} has been marked as sold.</p>
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

      {/* Seller (read-only) */}
      <div className="bg-cream-100 rounded-xl p-4 mb-5 border border-cream-200">
        <p className="text-[10px] font-bold uppercase text-charcoal-300 mb-1">Seller</p>
        <p className="font-display font-bold text-charcoal-600 text-sm">{SELLER.business}</p>
        <p className="text-xs text-charcoal-400">{SELLER.address}, {SELLER.cityStateZip}</p>
        <p className="text-xs text-charcoal-400">{SELLER.phone}</p>
        <div className="mt-2 border-t border-cream-200 pt-2">
          <p className="text-[10px] text-charcoal-300 mb-0.5">Pre-signed by:</p>
          <p className="text-2xl text-charcoal-700" style={{ fontFamily: "'Dancing Script', cursive" }}>Raegon Barnes</p>
        </div>
      </div>

      {/* Date */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-charcoal-500 block mb-1">Sale Date</label>
        <p className="px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-charcoal-600">{today}</p>
      </div>

      {/* Animal */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-charcoal-500 block mb-2">Animal</label>
        <select value={selectedAnimal?.id || ''} onChange={e => setSelectedAnimal(animals.find(x => x.id === e.target.value) || null)}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-charcoal-600">
          <option value="">Choose an animal...</option>
          {animals.filter(a => a.role === 'available').map(a => (
            <option key={a.id} value={a.id}>{a.name} — {a.sex} — ${a.price || '0'}</option>
          ))}
        </select>
      </div>

      {selectedAnimal && (
        <>
          <div className="bg-cream-100 rounded-xl p-4 mb-5 border border-cream-200">
            <p className="font-display font-bold text-charcoal-600">{selectedAnimal.name}</p>
            <p className="text-xs text-charcoal-400">{selectedAnimal.sex} · {selectedAnimal.description || ''}</p>
            <p className="text-lg font-bold text-charcoal-700 mt-1">${Number(selectedAnimal.price || 0).toLocaleString()}.00</p>
          </div>

          <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Buyer Information</h2>
          <div className="space-y-3 mb-5">
            <input placeholder="Full legal name *" value={buyer.name} onChange={e => set('name', e.target.value)} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <input placeholder="Email (to send them a copy)" value={buyer.email} onChange={e => set('email', e.target.value)} type="email" className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <input placeholder="Street address" value={buyer.address} onChange={e => set('address', e.target.value)} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="City" value={buyer.city} onChange={e => set('city', e.target.value)} className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
              <input placeholder="State" value={buyer.state} onChange={e => set('state', e.target.value)} className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
              <input placeholder="Zip" value={buyer.zip} onChange={e => set('zip', e.target.value)} className="px-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
            </div>
            <input placeholder="Phone" value={buyer.phone} onChange={e => set('phone', e.target.value)} type="tel" className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm" />
          </div>

          <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Buyer Signature</h2>
          <div className="mb-6">
            <SignaturePad label="Sign below with your finger" onSave={setBuyerSig} saved={!!buyerSig} />
          </div>

          <button onClick={submit} disabled={sending || !buyer.name || !buyerSig}
            className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
            {sending ? <><Loader className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-5 h-5" /> Complete Sale</>}
          </button>
          <p className="text-[10px] text-charcoal-300 text-center mt-3">Opens bill of sale for printing/sharing{buyer.email ? ' and drafts an email' : ''}. Marks animal as sold.</p>
        </>
      )}
    </div></>
  );
}

function buildBillHtml(animal, buyer, price, date, buyerSig) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bill of Sale - ${animal.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;max-width:700px;margin:0 auto;padding:24px;color:#1a1816;font-size:13px;line-height:1.6}
h1{font-size:22px;text-align:center;margin-bottom:2px;letter-spacing:2px;text-transform:uppercase}
.sub{text-align:center;font-size:12px;color:#666;margin-bottom:20px}
.bar{border-top:2px solid #1a1816;border-bottom:1px solid #1a1816;padding:6px 0;margin-bottom:20px;text-align:center;font-weight:bold;font-size:13px}
.s{margin-bottom:14px}
.st{font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:6px}
.r{display:flex;gap:12px;margin-bottom:4px;font-size:12px}
.r .l{font-weight:bold;min-width:110px}
.terms{font-size:10.5px;line-height:1.5;color:#333}
.terms p{margin-bottom:6px}
.sigs{display:flex;gap:32px;margin-top:28px}
.sb{flex:1}
.sb img{height:50px;display:block;margin-bottom:2px}
.sl{border-top:1px solid #1a1816;padding-top:3px;font-size:10px}
.cs{font-family:'Dancing Script',cursive;font-size:28px;color:#1a1816;margin-bottom:2px}
.ft{margin-top:28px;text-align:center;font-size:9px;color:#888;border-top:1px solid #ccc;padding-top:10px}
@media print{body{padding:12px}}
</style></head><body>
<h1>Livestock Bill of Sale</h1>
<p class="sub">State of Arkansas</p>
<div class="bar">Cashmere Cottontail Farm, LLC &mdash; Winslow, Arkansas</div>
<div class="s"><div class="st">Seller</div>
<div class="r"><span class="l">Business:</span> Cashmere Cottontail Farm, LLC</div>
<div class="r"><span class="l">Representative:</span> Raegon Barnes</div>
<div class="r"><span class="l">Address:</span> 17799 Bethlehem Rd, Winslow, AR 72762</div>
<div class="r"><span class="l">Phone:</span> (479) 531-0849</div></div>
<div class="s"><div class="st">Buyer</div>
<div class="r"><span class="l">Name:</span> ${buyer.name}</div>
<div class="r"><span class="l">Address:</span> ${buyer.address || 'N/A'}${buyer.city ? ', ' + buyer.city : ''}${buyer.state ? ', ' + buyer.state : ''} ${buyer.zip || ''}</div>
<div class="r"><span class="l">Phone:</span> ${buyer.phone || 'N/A'}</div>
<div class="r"><span class="l">Email:</span> ${buyer.email}</div></div>
<div class="s"><div class="st">Animal Description</div>
<div class="r"><span class="l">Name:</span> ${animal.name}</div>
<div class="r"><span class="l">Description:</span> ${animal.description || 'N/A'}</div>
<div class="r"><span class="l">Sex:</span> ${animal.sex}</div>
<div class="r"><span class="l">Date of Birth:</span> ${animal.date_of_birth || 'N/A'}</div>
<div class="r"><span class="l">Registration #:</span> ${animal.registration || 'N/A'}</div>
<div class="r"><span class="l">Sire:</span> ${animal.sire_name || 'N/A'}</div>
<div class="r"><span class="l">Dam:</span> ${animal.dam_name || 'N/A'}</div></div>
<div class="s"><div class="st">Transaction</div>
<div class="r"><span class="l">Sale Date:</span> ${date}</div>
<div class="r"><span class="l">Sale Price:</span> $${price.toLocaleString()}.00</div>
<div class="r"><span class="l">Payment:</span> Paid in full at time of sale</div></div>
<div class="s"><div class="st">Terms &amp; Conditions</div>
<div class="terms">
<p>1. <strong>Transfer of Ownership.</strong> Seller hereby transfers and conveys to Buyer all right, title, and interest in the above-described animal in exchange for the purchase price stated above.</p>
<p>2. <strong>AS-IS Sale.</strong> The animal is sold "AS-IS" without any express or implied warranties regarding health, condition, temperament, or fitness for any particular purpose, except as separately agreed in writing.</p>
<p>3. <strong>Health.</strong> Seller represents that to the best of their knowledge, the animal is in good health at the time of sale. Buyer is encouraged to have the animal examined by a licensed veterinarian within 72 hours.</p>
<p>4. <strong>Assumption of Risk.</strong> Upon execution of this Bill of Sale and transfer of possession, Buyer assumes all risk and responsibility for the care, feeding, housing, and well-being of the animal.</p>
<p>5. <strong>All Sales Final.</strong> No refunds or exchanges will be provided.</p>
<p>6. <strong>Governing Law.</strong> This Bill of Sale shall be governed by the laws of the State of Arkansas.</p>
<p>7. <strong>Entire Agreement.</strong> This document constitutes the entire agreement between the parties regarding this transaction.</p>
</div></div>
<div class="sigs">
<div class="sb"><div class="cs">Raegon Barnes</div>
<div class="sl"><strong>Seller:</strong> Raegon Barnes<br/>Cashmere Cottontail Farm, LLC<br/>Date: ${date}</div></div>
<div class="sb"><img src="${buyerSig}" alt="Buyer signature"/>
<div class="sl"><strong>Buyer:</strong> ${buyer.name}<br/>Date: ${date}</div></div></div>
<div class="ft">Cashmere Cottontail Farm, LLC &middot; 17799 Bethlehem Rd &middot; Winslow, AR 72762 &middot; (479) 531-0849 &middot; cashmerecottontailfarm.com<br/>This document constitutes a binding bill of sale for the transfer of livestock in the State of Arkansas.</div>
</body></html>`;
}

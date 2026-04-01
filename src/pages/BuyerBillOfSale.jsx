import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Loader, Send } from 'lucide-react';
import SEO from '../components/SEO';

const API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/buyer-bill-of-sale';

function SignaturePad({ onSave, saved }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#1a1816';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const start = (e) => { e.preventDefault(); setDrawing(true); const ctx = canvasRef.current.getContext('2d'); ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const end = () => setDrawing(false);
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  const save = () => { const data = canvasRef.current.toDataURL('image/png'); onSave(data); };

  return (
    <div>
      <canvas ref={canvasRef} className="w-full bg-white border-2 border-cream-200 rounded-xl touch-none" style={{ height: '140px' }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <div className="flex gap-2 mt-2">
        <button onClick={clear} className="flex-1 py-2.5 bg-cream-100 text-charcoal-400 rounded-full text-sm font-medium">Clear</button>
        <button onClick={save} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${saved ? 'bg-green-500 text-white' : 'bg-sage-500 text-white'}`}>
          {saved ? '✓ Signature Saved' : '✓ Accept Signature'}
        </button>
      </div>
    </div>
  );
}

export default function BuyerBillOfSale() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animal, setAnimal] = useState(null);
  const [saleDate, setSaleDate] = useState('');
  const [buyer, setBuyer] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '', phone: '' });
  const [sig, setSig] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setBuyer(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    fetch(`${API}/info/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); }
        else { setAnimal(data.animal); setSaleDate(data.sale_date); }
        setLoading(false);
      })
      .catch(() => { setError('Could not load. Please contact the seller.'); setLoading(false); });
  }, [token]);

  const submit = async () => {
    if (!buyer.name || !sig || !termsAccepted) return;
    setSending(true);
    const addr = [buyer.address, buyer.city, buyer.state, buyer.zip].filter(Boolean).join(', ');
    const sd = saleDate;

    // Generate PDF on buyer's phone
    let pdfBase64 = '';
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'letter');
      const w = doc.internal.pageSize.getWidth();
      let y = 18;
      const lm = 22, rm = w - 22, cw = rm - lm, labelW = 38;
      const addRow = (label, value) => {
        doc.setFont('times', 'bold'); doc.setFontSize(10);
        doc.text(label, lm + 2, y);
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(String(value || 'N/A'), cw - labelW - 4);
        doc.text(lines, lm + labelW, y);
        y += lines.length * 5;
      };
      const addSection = (title) => {
        y += 2; doc.setFillColor(240, 238, 233);
        doc.rect(lm, y - 4, cw, 7, 'F');
        doc.setFont('times', 'bold'); doc.setFontSize(10);
        doc.text(title, lm + 2, y); y += 6;
      };
      doc.setFont('times', 'bold'); doc.setFontSize(20);
      doc.text('LIVESTOCK BILL OF SALE', w/2, y, {align:'center'}); y+=6;
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      doc.text('State of Arkansas', w/2, y, {align:'center'}); y+=4;
      doc.setDrawColor(30,28,24); doc.setLineWidth(0.6); doc.line(lm,y,rm,y); y+=6;
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      doc.text('Cashmere Cottontail Farm, LLC  \u2014  Winslow, Arkansas', w/2, y, {align:'center'}); y+=2;
      doc.setLineWidth(0.3); doc.line(lm,y,rm,y); y+=6;

      addSection('SELLER');
      addRow('Business:', 'Cashmere Cottontail Farm, LLC');
      addRow('Representative:', 'Raegon Barnes');
      addRow('Address:', '17799 Bethlehem Rd, Winslow, AR 72762');
      addRow('Phone:', '(479) 531-0849');

      addSection('BUYER');
      addRow('Name:', buyer.name);
      addRow('Address:', addr || 'N/A');
      addRow('Phone:', buyer.phone || 'N/A');
      addRow('Email:', buyer.email || 'N/A');

      addSection('ANIMAL DESCRIPTION');
      addRow('Name:', animal.name);
      addRow('Description:', animal.description || 'N/A');
      addRow('Sex:', animal.sex || 'N/A');
      addRow('Date of Birth:', animal.date_of_birth || 'N/A');
      addRow('Registration #:', animal.registration || 'N/A');
      addRow('Sire:', animal.sire_name || 'N/A');
      addRow('Dam:', animal.dam_name || 'N/A');

      addSection('TRANSACTION');
      addRow('Sale Date:', sd);
      addRow('Sale Price:', '$' + Number(animal.price || 0).toLocaleString() + '.00');
      addRow('Payment:', 'Paid in full at time of sale');

      addSection('TERMS & CONDITIONS');
      doc.setFont('times', 'normal'); doc.setFontSize(8.5);
      ['1. Transfer of Ownership. Seller transfers to Buyer all right, title, and interest in the above-described animal.',
       '2. AS-IS Sale. The animal is sold "AS-IS" without warranties regarding health, condition, or fitness.',
       '3. Health. Seller represents the animal is in good health. Buyer should have it examined within 72 hours.',
       '4. Assumption of Risk. Buyer assumes all responsibility upon transfer.',
       '5. All Sales Final. No refunds or exchanges.',
       '6. No Resale for Slaughter. Animal shall not be resold for slaughter or inhumane purposes.',
       '7. Governing Law. Governed by the laws of the State of Arkansas.',
       '8. Entire Agreement. This document constitutes the entire agreement.'
      ].forEach(t => { const lines = doc.splitTextToSize(t, cw); doc.text(lines, lm, y); y += lines.length * 3.5 + 1; });
      y += 5;

      if (y > 220) { doc.addPage(); y = 20; }
      doc.setDrawColor(180,176,164); doc.setLineWidth(0.3);
      doc.setFont('times', 'bold'); doc.setFontSize(9);
      doc.text('Seller:', lm, y);
      doc.setFont('times', 'italic'); doc.setFontSize(20);
      doc.text('Raegon Barnes', lm, y + 10);
      doc.line(lm, y+12, lm+65, y+12);
      doc.setFont('times', 'normal'); doc.setFontSize(8);
      doc.text('Raegon Barnes', lm, y+16);
      doc.text('Cashmere Cottontail Farm, LLC', lm, y+20);
      doc.text('Date: ' + sd, lm, y+24);

      doc.setFont('times', 'bold'); doc.setFontSize(9);
      doc.text('Buyer:', w/2+5, y);
      try { doc.addImage(sig, 'PNG', w/2+5, y+1, 55, 14); } catch(e) {}
      doc.line(w/2+5, y+16, w/2+70, y+16);
      doc.setFont('times', 'normal'); doc.setFontSize(8);
      doc.text(buyer.name, w/2+5, y+20);
      doc.text('Date: ' + sd, w/2+5, y+24);
      y += 32;

      doc.setLineWidth(0.1); doc.setDrawColor(30,28,24); doc.line(lm,y,rm,y); y+=4;
      doc.setFontSize(7);
      doc.text('Cashmere Cottontail Farm, LLC \u00b7 17799 Bethlehem Rd \u00b7 Winslow, AR 72762 \u00b7 (479) 531-0849 \u00b7 cashmerecottontailfarm.com', w/2, y, {align:'center'});

      pdfBase64 = doc.output('datauristring').split(',')[1];
    } catch (e) { console.error('PDF generation error:', e); }

    try {
      const res = await fetch(`${API}/submit/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: buyer.name,
          buyer_email: buyer.email,
          buyer_address: addr,
          buyer_phone: buyer.phone,
          buyer_sig: sig,
          terms_accepted: termsAccepted,
          pdf_base64: pdfBase64 || null,
        })
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setError(data.error || 'Something went wrong');
    } catch (e) { setError('Failed to submit. Please try again.'); }
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-charcoal-500 mb-2">{error}</p>
        <p className="text-sm text-charcoal-300">Contact Cashmere Cottontail Farm: (479) 531-0849</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <SEO title="Bill of Sale Complete" />
      <div className="text-center max-w-sm">
        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-charcoal-600 mb-2">Thank You!</h1>
        <p className="text-charcoal-400 mb-1">Your Bill of Sale for <strong>{animal.name}</strong> is complete.</p>
        {buyer.email && <p className="text-sm text-charcoal-300 mb-4">A copy has been emailed to {buyer.email}</p>}
        <p className="text-sm text-charcoal-300">Congratulations on your new family member!</p>
        <div className="mt-6 pt-4 border-t border-cream-200">
          <p className="text-xs text-charcoal-300">Cashmere Cottontail Farm, LLC</p>
          <p className="text-xs text-charcoal-300">(479) 531-0849 · cashmerecottontailfarm.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={`Bill of Sale - ${animal?.name}`} />
      <div className="min-h-screen bg-cream-50">
        {/* Header */}
        <div className="bg-white border-b border-cream-200 px-4 py-4 text-center">
          <img src="/logo.jpeg" alt="Cashmere Cottontail Farm" className="h-12 mx-auto mb-2 rounded-md" />
          <h1 className="font-display text-lg font-bold text-charcoal-600">Bill of Sale</h1>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Animal info */}
          <div className="bg-white rounded-xl border border-cream-200 p-4">
            <h2 className="font-display font-semibold text-charcoal-600 text-lg">{animal.name}</h2>
            <p className="text-sm text-charcoal-400 mt-1">{animal.breed_name} · {animal.sex}</p>
            {animal.description && <p className="text-sm text-charcoal-300 mt-1">{animal.description}</p>}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-sage-600">${Number(animal.price).toLocaleString()}</span>
              <span className="text-xs text-charcoal-300">Sale Date: {saleDate}</span>
            </div>
          </div>

          {/* Buyer info */}
          <div>
            <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Your Information</h2>
            <div className="space-y-3">
              <input placeholder="Full Name *" value={buyer.name} onChange={e => set('name', e.target.value)} className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
              <input placeholder="Email (for your copy)" value={buyer.email} onChange={e => set('email', e.target.value)} type="email" className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
              <input placeholder="Street Address" value={buyer.address} onChange={e => set('address', e.target.value)} className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="City" value={buyer.city} onChange={e => set('city', e.target.value)} className="px-3 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
                <input placeholder="State" value={buyer.state} onChange={e => set('state', e.target.value)} className="px-3 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
                <input placeholder="Zip" value={buyer.zip} onChange={e => set('zip', e.target.value)} className="px-3 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
              </div>
              <input placeholder="Phone" value={buyer.phone} onChange={e => set('phone', e.target.value)} type="tel" className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm" />
            </div>
          </div>

          {/* Terms */}
          <div>
            <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Terms & Conditions</h2>
            <div className="bg-white border border-cream-200 rounded-xl p-4 max-h-56 overflow-y-auto mb-3 text-xs text-charcoal-500 leading-relaxed space-y-2">
              <p><strong>1. Transfer of Ownership.</strong> Seller hereby transfers and conveys to Buyer all right, title, and interest in the above-described animal in exchange for the purchase price stated above.</p>
              <p><strong>2. AS-IS Sale.</strong> The animal is sold "AS-IS" without any express or implied warranties regarding health, condition, temperament, or fitness for any particular purpose, except as separately agreed in writing.</p>
              <p><strong>3. Health.</strong> Seller represents that to the best of their knowledge, the animal is in good health at the time of sale. Buyer is encouraged to have the animal examined by a licensed veterinarian within 72 hours.</p>
              <p><strong>4. Assumption of Risk.</strong> Upon execution of this Bill of Sale and transfer of possession, Buyer assumes all risk and responsibility for the care, feeding, housing, and well-being of the animal.</p>
              <p><strong>5. All Sales Final.</strong> No refunds or exchanges will be provided.</p>
              <p><strong>6. No Resale for Slaughter.</strong> Buyer agrees that the animal is being purchased as a pet, breeding animal, or show animal, and shall not be resold for slaughter or inhumane purposes.</p>
              <p><strong>7. Governing Law.</strong> This Bill of Sale shall be governed by the laws of the State of Arkansas.</p>
              <p><strong>8. Entire Agreement.</strong> This document constitutes the entire agreement between the parties regarding this transaction.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-cream-300 text-sage-500 focus:ring-sage-500" />
              <span className="text-sm text-charcoal-500">I have read and agree to the above Terms & Conditions</span>
            </label>
          </div>

          {/* Signature */}
          <div>
            <h2 className="text-sm font-semibold text-charcoal-500 mb-3">Your Signature</h2>
            <div className={!termsAccepted ? 'opacity-40 pointer-events-none' : ''}>
              <SignaturePad onSave={setSig} saved={!!sig} />
              {!termsAccepted && <p className="text-[10px] text-center text-charcoal-300 mt-1">Please accept the terms above to sign</p>}
            </div>
          </div>

          {/* Submit */}
          <button onClick={submit} disabled={sending || !buyer.name || !sig || !termsAccepted}
            className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg">
            {sending ? <><Loader className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-5 h-5" /> Complete Purchase</>}
          </button>
          <p className="text-[10px] text-charcoal-300 text-center">Emails bill of sale to you and to Cashmere Cottontail Farm.</p>

          <div className="text-center pt-4 border-t border-cream-200">
            <p className="text-xs text-charcoal-300">Cashmere Cottontail Farm, LLC</p>
            <p className="text-xs text-charcoal-300">17799 Bethlehem Rd, Winslow, AR 72762 · (479) 531-0849</p>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ClipboardList } from 'lucide-react';
import SEO from '../components/SEO';

const API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/animal-records-public';

const RECORD_TYPES = {
  vaccination: { label: 'Vaccination', icon: '💉', color: 'bg-blue-100 text-blue-700' },
  care: { label: 'Care', icon: '✂️', color: 'bg-green-100 text-green-700' },
  medical: { label: 'Medical', icon: '🏥', color: 'bg-red-100 text-red-700' },
  breeding: { label: 'Breeding', icon: '❤️', color: 'bg-pink-100 text-pink-700' },
  note: { label: 'Note', icon: '📝', color: 'bg-yellow-100 text-yellow-700' },
  document: { label: 'Document', icon: '📄', color: 'bg-purple-100 text-purple-700' },
};

export default function PublicAnimalRecord() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/view/${token}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false); })
      .catch(() => { setError('Could not load records.'); setLoading(false); });
  }, [token]);

  const downloadPdf = async () => {
    if (!data) return;
    const { animal, records } = data;
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'letter');
      const w = doc.internal.pageSize.getWidth();
      let y = 18;
      const lm = 20, rm = w - 20, cw = rm - lm;

      doc.setFont('times', 'bold'); doc.setFontSize(18);
      doc.text('ANIMAL RECORD', w / 2, y, { align: 'center' }); y += 6;
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      doc.text('Cashmere Cottontail Farm, LLC', w / 2, y, { align: 'center' }); y += 4;
      doc.setDrawColor(30, 28, 24); doc.setLineWidth(0.5); doc.line(lm, y, rm, y); y += 8;

      doc.setFillColor(240, 238, 233); doc.rect(lm, y - 4, cw, 7, 'F');
      doc.setFont('times', 'bold'); doc.setFontSize(10);
      doc.text('ANIMAL INFORMATION', lm + 2, y); y += 7;
      doc.setFontSize(9);
      [['Name:', animal.name], ['Breed:', animal.breed_name || 'N/A'], ['Sex:', animal.sex],
       ['DOB:', animal.date_of_birth || 'N/A'], ['Registration:', animal.registration || 'N/A'],
       ['Sire:', animal.sire_name || 'N/A'], ['Dam:', animal.dam_name || 'N/A']
      ].forEach(([l, v]) => { doc.setFont('times', 'bold'); doc.text(l, lm + 2, y); doc.setFont('times', 'normal'); doc.text(v, lm + 30, y); y += 4.5; });
      y += 4;

      doc.setFillColor(240, 238, 233); doc.rect(lm, y - 4, cw, 7, 'F');
      doc.setFont('times', 'bold'); doc.setFontSize(10);
      doc.text(`RECORDS (${records.length})`, lm + 2, y); y += 7;

      if (records.length === 0) {
        doc.setFont('times', 'italic'); doc.setFontSize(9); doc.text('No records on file.', lm + 2, y);
      } else {
        doc.setFont('times', 'bold'); doc.setFontSize(8);
        doc.text('Date', lm + 2, y); doc.text('Type', lm + 28, y); doc.text('Title', lm + 55, y); doc.text('Notes', lm + 105, y);
        y += 2; doc.setLineWidth(0.2); doc.line(lm, y, rm, y); y += 4;
        doc.setFont('times', 'normal');
        records.forEach(r => {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.text(new Date(r.record_date).toLocaleDateString(), lm + 2, y);
          doc.text(r.record_type, lm + 28, y);
          doc.text((r.title || '').substring(0, 30), lm + 55, y);
          doc.text((r.description || '').substring(0, 25), lm + 105, y);
          y += 4.5;
        });
      }
      y += 6;
      doc.setLineWidth(0.1); doc.line(lm, y, rm, y); y += 4;
      doc.setFontSize(7);
      doc.text(`Generated ${new Date().toLocaleDateString()} \u00b7 Cashmere Cottontail Farm, LLC \u00b7 (479) 531-0849`, w / 2, y, { align: 'center' });
      doc.save(`${animal.name.replace(/\s+/g, '_')}_Records.pdf`);
    } catch (e) { alert('PDF generation failed'); }
  };

  if (loading) return <div className="min-h-screen bg-cream-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" /></div>;
  if (error) return <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4"><p className="text-charcoal-500">{error}</p></div>;
  if (!data) return null;

  const { animal, records, breeding } = data;

  return (
    <>
      <SEO title={`${animal.name} - Records`} />
      <div className="min-h-screen bg-cream-50">
        <div className="bg-white border-b border-cream-200 px-4 py-4 text-center">
          <img src="/logo.jpeg" alt="Cashmere Cottontail Farm" className="h-10 mx-auto mb-2 rounded-md" />
          <h1 className="font-display text-lg font-bold text-charcoal-600">Animal Record</h1>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {/* Animal info */}
          <div className="bg-white rounded-xl border border-cream-200 p-4">
            <h2 className="font-display text-xl font-bold text-charcoal-600">{animal.name}</h2>
            <p className="text-sm text-charcoal-400 mt-1">{animal.breed_name} · {animal.sex}</p>
            {animal.date_of_birth && <p className="text-xs text-charcoal-300 mt-0.5">Born: {new Date(animal.date_of_birth).toLocaleDateString()}</p>}
            {animal.registration && <p className="text-xs text-charcoal-300">Reg #: {animal.registration}</p>}
            {animal.sire_name && <p className="text-xs text-charcoal-300">Sire: {animal.sire_name} · Dam: {animal.dam_name}</p>}
          </div>

          {/* Download button */}
          <button onClick={downloadPdf}
            className="w-full bg-charcoal-700 hover:bg-charcoal-600 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Download Records PDF
          </button>

          {/* Records */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal-500 mb-2">Records ({records.length})</h3>
            {records.length === 0 ? (
              <div className="bg-white rounded-xl border border-cream-200 p-6 text-center">
                <ClipboardList className="w-8 h-8 text-cream-300 mx-auto mb-2" />
                <p className="text-sm text-charcoal-400">No records on file</p>
              </div>
            ) : (
              <div className="space-y-2">
                {records.map(r => {
                  const t = RECORD_TYPES[r.record_type] || RECORD_TYPES.note;
                  return (
                    <div key={r.id} className="bg-white border border-cream-200 rounded-xl p-3 flex items-start gap-3">
                      <span className="text-base mt-0.5">{t.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-charcoal-600">{r.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${t.color}`}>{t.label}</span>
                        </div>
                        <p className="text-xs text-charcoal-300 mt-0.5">{new Date(r.record_date).toLocaleDateString()}</p>
                        {r.description && <p className="text-xs text-charcoal-400 mt-1">{r.description}</p>}
                        {r.document_url && <a href={r.document_url} target="_blank" rel="noopener" className="text-[10px] text-blue-500 mt-1 inline-block">View Document</a>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-center pt-4 border-t border-cream-200">
            <p className="text-xs text-charcoal-300">Cashmere Cottontail Farm, LLC · (479) 531-0849</p>
            <p className="text-xs text-charcoal-300">cashmerecottontailfarm.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

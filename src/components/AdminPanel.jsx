import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X, Camera, FileText, Share2, ClipboardList, MessageSquare, LayoutDashboard, Heart, Bell, LogOut, Smartphone, ChevronRight, ExternalLink } from 'lucide-react';
import { clearAdminKey, getBreeds, getAnimals, getContacts } from '../lib/adminApi';
import { clearSession, removeDeviceToken, getDeviceToken } from '../lib/adminAuth';

const API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';
const adminKey = () => sessionStorage.getItem('ccf_admin_key') || '';
const hdrs = () => ({ 'Content-Type': 'application/json', 'x-admin-key': adminKey() });

export default function AdminPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ animals: 0, available: 0, sold: 0, messages: 0, unread: 0, expecting: 0 });
  const [loading, setLoading] = useState(true);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    loadStats();
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [animals, contacts, breeding] = await Promise.all([
        fetch(`${API}/animals`, { headers: hdrs() }).then(r => r.json()).catch(() => []),
        fetch(`${API}/contacts`, { headers: hdrs() }).then(r => r.json()).catch(() => []),
        fetch(`${API}/breeding?status=expecting`, { headers: hdrs() }).then(r => r.json()).catch(() => []),
      ]);
      setStats({
        animals: Array.isArray(animals) ? animals.length : 0,
        available: Array.isArray(animals) ? animals.filter(a => a.role === 'available').length : 0,
        sold: Array.isArray(animals) ? animals.filter(a => a.role === 'sold').length : 0,
        messages: Array.isArray(contacts) ? contacts.length : 0,
        unread: Array.isArray(contacts) ? contacts.filter(c => !c.read).length : 0,
        expecting: Array.isArray(breeding) ? breeding.length : 0,
      });
    } catch {}
    setLoading(false);
  };

  const goTo = (path) => { onClose(); navigate(path); };
  const logout = () => { clearAdminKey(); clearSession(); removeDeviceToken(); onClose(); navigate('/'); window.location.reload(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2c2826]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — slides down from top */}
      <div className="relative bg-[#faf8f5] min-h-screen overflow-y-auto animate-slideDown">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#2c2826] text-white px-5 pt-safe">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="" className="h-9 w-auto rounded-md opacity-90" />
              <div>
                <p className="font-display text-sm font-bold tracking-wide">CASHMERE COTTONTAIL</p>
                <p className="text-[10px] text-[#c8c1b4] tracking-widest uppercase">Farm Management</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-[#2c2826] px-5 pb-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Animals', value: stats.animals, sub: `${stats.available} available` },
              { label: 'Messages', value: stats.messages, sub: stats.unread > 0 ? `${stats.unread} unread` : 'all read', highlight: stats.unread > 0 },
              { label: 'Expecting', value: stats.expecting, sub: 'breeding', highlight: stats.expecting > 0 },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-3 py-3 text-center">
                <p className={`text-2xl font-bold ${s.highlight ? 'text-green-400' : 'text-white'}`}>{loading ? '—' : s.value}</p>
                <p className="text-[10px] text-[#c8c1b4] uppercase tracking-wider mt-0.5">{s.label}</p>
                <p className="text-[9px] text-[#a09888] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="px-4 py-5 pb-24 space-y-3">

          {/* PORTFOLIO section — like Podium */}
          <SectionHeader label="PORTFOLIO" />
          <NavCard icon={LayoutDashboard} label="Admin Panel" desc="Manage animals, photos & media" onClick={() => goTo('/admin')} />
          <NavCard icon={Camera} label="Quick Post" desc="Camera-first animal posting" onClick={() => goTo('/post')} />

          {/* RECORDS section */}
          <SectionHeader label="RECORDS & BREEDING" />
          <NavCard icon={ClipboardList} label="Animal Records" desc="Health, vaccinations, care logs" onClick={() => goTo('/records')}
            badge={stats.expecting > 0 ? `${stats.expecting} expecting` : null} />
          <NavCard icon={Heart} label="Breeding" desc="Breeding logs & due date countdowns" onClick={() => { goTo('/records'); /* will default to breeding tab */ }} />
          <NavCard icon={Bell} label="Alerts" desc="Milestone SMS & email notifications" onClick={() => { goTo('/records'); }} />

          {/* SALES section */}
          <SectionHeader label="SALES" />
          <NavCard icon={FileText} label="Bill of Sale" desc="In-person bill of sale with signature" onClick={() => goTo('/bill-of-sale')} />

          {/* MARKETING section */}
          <SectionHeader label="MARKETING" />
          <NavCard icon={Share2} label="Social Media" desc="Create & schedule social posts" onClick={() => goTo('/social-post')} />

          {/* COMMUNICATIONS section */}
          <SectionHeader label="COMMUNICATIONS" />
          <NavCard icon={MessageSquare} label="Messages" desc="Customer inquiries & contact forms"
            badge={stats.unread > 0 ? `${stats.unread} new` : null}
            onClick={() => goTo('/admin')} />

          {/* Device info + logout */}
          <div className="pt-4 mt-4 border-t border-[#e4ddd2]">
            {getDeviceToken() && (
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span className="text-xs text-[#6b6259]">Trusted device · Auto-login active</span>
              </div>
            )}
            <button onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2c2826] text-white rounded-xl text-sm font-semibold hover:bg-[#3d3832] transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out & Remove Device
            </button>
            <p className="text-center text-[10px] text-[#a09888] mt-4">Cashmere Cottontail Farm, LLC · cashmerecottontailfarm.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a09888] pt-4 pb-1 px-1">{label}</p>
  );
}

function NavCard({ icon: Icon, label, desc, onClick, badge }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-4 bg-white rounded-xl px-4 py-3.5 border border-[#e8e3db] hover:border-[#c8c1b4] hover:shadow-sm active:scale-[0.99] transition-all text-left group">
      <div className="w-10 h-10 rounded-xl bg-[#f0ece5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e4ddd2] transition-colors">
        <Icon className="w-5 h-5 text-[#6b6259]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-[#2c2826]">{label}</span>
          {badge && <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{badge}</span>}
        </div>
        <p className="text-xs text-[#807a72] mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#c8c1b4] group-hover:text-[#6b6259] transition-colors flex-shrink-0" />
    </button>
  );
}

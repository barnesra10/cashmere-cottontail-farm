import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageCircle, MessageSquare, Settings, Camera, FileText, Share2, ClipboardList } from 'lucide-react';
import ChatWidget from './ChatWidget';
import { useBreeds } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import { getDeviceToken } from '../lib/adminAuth';

function NavDropdown({ label, items, mobile, onClose, highlight }) {
  const [open, setOpen] = useState(false);
  // Colors from logo palette
  const availColor = '#2c2826';  // dark sheep
  const noAvailColor = '#807a72'; // silkies

  if (mobile) {
    return (
      <div>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1 w-full py-2 font-body text-charcoal-600 hover:text-sage-500 transition-colors">
          {label} <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="pl-4 space-y-1">
            {items.map(item => (
              <NavLink key={item.to} to={item.to} onClick={onClose}
                className="block py-1.5 text-sm flex items-center gap-2"
                style={{ color: item.count > 0 ? availColor : noAvailColor, fontWeight: item.count > 0 ? 600 : 400 }}>
                {item.label}
                {item.count > 0 && <span style={{ backgroundColor: availColor }} className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.count}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="relative group" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 font-body text-sm tracking-wide transition-colors uppercase"
        style={{ color: highlight ? availColor : '#9A9085', fontWeight: highlight ? 600 : 400 }}>
        {label} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-cream-200 py-2 min-w-[200px] z-50">
          {items.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `block px-4 py-2 text-sm flex items-center justify-between hover:bg-cream-100 ${isActive ? 'bg-cream-100' : ''}`}
              style={{ color: item.count > 0 ? availColor : noAvailColor, fontWeight: item.count > 0 ? 600 : 400 }}>
              {item.label}
              {item.count > 0 && <span style={{ backgroundColor: availColor }} className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.count}</span>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const { breeds } = useBreeds();
  const [availableCounts, setAvailableCounts] = useState({});

  useEffect(() => {
    supabase.from('animals').select('breed_id').eq('role', 'available').then(({ data }) => {
      if (data) {
        const counts = {};
        data.forEach(a => { counts[a.breed_id] = (counts[a.breed_id] || 0) + 1; });
        setAvailableCounts(counts);
      }
    });
  }, [location.pathname]);

  const animalItems = breeds.map(b => ({ to: `/${b.slug}`, label: b.name, count: availableCounts[b.id] || 0 }));
  const availableItems = breeds.map(b => ({ to: `/${b.slug}/available`, label: b.short_name || b.name, count: availableCounts[b.id] || 0 }));
  const totalAvailable = Object.values(availableCounts).reduce((sum, c) => sum + c, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.jpeg" alt="Cashmere Cottontail Farm" className="h-12 md:h-14 w-auto rounded-md shadow-sm group-hover:shadow-md transition-shadow" />
              <div className="hidden sm:block">
                <span className="font-script text-xl text-charcoal-600 leading-none">Cashmere</span>
                <span className="block font-display text-sm tracking-widest text-charcoal-400 uppercase -mt-0.5">Cottontail Farm</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/about"
                className={({ isActive }) => `font-body text-sm tracking-wide uppercase ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500 hover:text-charcoal-700'} transition-colors`}>
                Our Farm
              </NavLink>
              <NavDropdown label="Our Animals" items={animalItems} highlight={totalAvailable > 0} />
              <NavDropdown label="Available" items={availableItems} highlight={totalAvailable > 0} />
              <NavLink to="/produce"
                className={({ isActive }) => `font-body text-sm tracking-wide uppercase ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500 hover:text-charcoal-700'} transition-colors`}>
                Produce
              </NavLink>
              <NavLink to="/contact"
                className={({ isActive }) => `font-body text-sm tracking-wide uppercase ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500 hover:text-charcoal-700'} transition-colors`}>
                Contact
              </NavLink>
            </nav>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-charcoal-500">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-cream-200 px-4 py-4 space-y-2 shadow-lg">
            <NavLink to="/about" onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block py-2 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
              Our Farm
            </NavLink>
            <NavDropdown label="Our Animals" items={animalItems} highlight={totalAvailable > 0} mobile onClose={() => setMobileOpen(false)} />
            <NavDropdown label="Available" items={availableItems} highlight={totalAvailable > 0} mobile onClose={() => setMobileOpen(false)} />
            <NavLink to="/produce" onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block py-2 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
              Produce
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block py-2 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
              Contact
            </NavLink>

            {/* Admin section — only visible on trusted devices */}
            {getDeviceToken() && (
              <>
                <div className="border-t border-cream-200 mt-3 pt-3">
                  <p className="text-[10px] uppercase tracking-widest text-charcoal-300 font-semibold mb-2">Farm Management</p>
                  <NavLink to="/admin" onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 py-2.5 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
                    <Settings className="w-4 h-4" />
                    <div>
                      <span className="block text-sm font-medium">Admin Panel</span>
                      <span className="block text-[10px] text-charcoal-300">Manage animals, photos, messages</span>
                    </div>
                  </NavLink>
                  <NavLink to="/post" onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 py-2.5 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
                    <Camera className="w-4 h-4" />
                    <div>
                      <span className="block text-sm font-medium">Quick Post</span>
                      <span className="block text-[10px] text-charcoal-300">Camera-first animal posting</span>
                    </div>
                  </NavLink>
                  <NavLink to="/bill-of-sale" onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 py-2.5 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
                    <FileText className="w-4 h-4" />
                    <div>
                      <span className="block text-sm font-medium">Bill of Sale</span>
                      <span className="block text-[10px] text-charcoal-300">Generate & email sale documents</span>
                    </div>
                  </NavLink>
                  <NavLink to="/social-post" onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 py-2.5 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
                    <Share2 className="w-4 h-4" />
                    <div>
                      <span className="block text-sm font-medium">Social Media</span>
                      <span className="block text-[10px] text-charcoal-300">Create & schedule social posts</span>
                    </div>
                  </NavLink>
                  <NavLink to="/records" onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 py-2.5 ${isActive ? 'text-sage-500 font-semibold' : 'text-charcoal-500'}`}>
                    <ClipboardList className="w-4 h-4" />
                    <div>
                      <span className="block text-sm font-medium">Animal Records</span>
                      <span className="block text-[10px] text-charcoal-300">Health, vaccinations, breeding logs</span>
                    </div>
                  </NavLink>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-700 text-cream-200 plaid-bg">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.jpeg" alt="Cashmere Cottontail Farm" className="h-16 w-auto rounded-md mb-4 brightness-110" />
              <p className="font-body text-sm text-cream-300 leading-relaxed max-w-xs">
                Breeding luxury & boutique miniature animals in Winslow, Arkansas. Every animal born to a purpose.
              </p>
              <p className="font-body text-xs text-cream-300/60 mt-2">Winslow, AR · Established 2025</p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4 text-cream-100">Our Animals</h4>
              <ul className="space-y-2">
                {breeds.map(b => (
                  <li key={b.slug}>
                    <Link to={`/${b.slug}`} className="font-body text-sm text-cream-300 hover:text-wheat-300 transition-colors">
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4 text-cream-100">Connect</h4>
              <ul className="space-y-2 font-body text-sm text-cream-300">
                <li><a href="sms:4795310849" className="hover:text-wheat-300 transition-colors">Text Us: (479) 531-0849</a></li>
                <li><Link to="/contact" className="hover:text-wheat-300 transition-colors">Contact Form</Link></li>
                <li><a href="https://facebook.com" target="_blank" rel="noopener" className="hover:text-wheat-300 transition-colors">Facebook</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener" className="hover:text-wheat-300 transition-colors">Instagram</a></li>
                <li><a href="https://tiktok.com" target="_blank" rel="noopener" className="hover:text-wheat-300 transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cream-300/10 mt-10 pt-6 text-center">
            <p className="font-body text-xs text-cream-300/50">&copy; {new Date().getFullYear()} Cashmere Cottontail Farm. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
        {chatOpen ? (
          <ChatWidget onClose={() => setChatOpen(false)} />
        ) : (
          <>
            {/* Text Us button */}
            <a href="sms:4795310849"
              className="flex items-center gap-2 bg-charcoal-700 hover:bg-charcoal-800 text-white rounded-full pl-4 pr-5 py-3 shadow-xl hover:shadow-2xl transition-all group">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm font-semibold">Text Us</span>
            </a>
            {/* AI Chat button */}
            <button onClick={() => setChatOpen(true)}
              className="bg-sage-500 hover:bg-sage-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all group"
              aria-label="Chat with AI">
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

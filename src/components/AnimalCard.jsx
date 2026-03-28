import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Placeholder silhouettes matching the logo style for each breed
const silhouettes = {
  'valais-blacknose-sheep': (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <ellipse cx="60" cy="50" rx="35" ry="30" fill="currentColor" />
      <circle cx="60" cy="28" r="18" fill="currentColor" />
      <ellipse cx="60" cy="32" rx="8" ry="5" fill="white" />
      <rect x="42" y="72" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="72" y="72" width="6" height="20" rx="2" fill="currentColor" />
      <path d="M40 22 Q35 12 30 18" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M80 22 Q85 12 90 18" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  ),
  'pygmy-goats': (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <ellipse cx="55" cy="55" rx="28" ry="22" fill="currentColor" />
      <circle cx="75" cy="38" r="14" fill="currentColor" />
      <path d="M72 28 L68 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 28 L84 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="35" y="70" width="5" height="22" rx="2" fill="currentColor" />
      <rect x="50" y="70" width="5" height="22" rx="2" fill="currentColor" />
      <rect x="62" y="70" width="5" height="22" rx="2" fill="currentColor" />
      <rect x="75" y="70" width="5" height="22" rx="2" fill="currentColor" />
      <path d="M87 38 Q95 40 92 36" fill="currentColor" />
    </svg>
  ),
  'mini-rex-rabbits': (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <ellipse cx="60" cy="65" rx="25" ry="20" fill="currentColor" />
      <circle cx="60" cy="40" r="16" fill="currentColor" />
      <ellipse cx="52" cy="18" rx="5" ry="18" fill="currentColor" />
      <ellipse cx="68" cy="18" rx="5" ry="18" fill="currentColor" />
      <circle cx="54" cy="38" r="2" fill="white" />
      <circle cx="66" cy="38" r="2" fill="white" />
      <ellipse cx="60" cy="44" rx="3" ry="2" fill="white" />
    </svg>
  ),
  'miniature-dachshunds': (
    <svg viewBox="0 0 140 80" className="w-full h-full">
      <ellipse cx="70" cy="40" rx="42" ry="16" fill="currentColor" />
      <circle cx="108" cy="32" r="12" fill="currentColor" />
      <ellipse cx="118" cy="28" rx="6" ry="8" fill="currentColor" />
      <rect x="35" y="50" width="5" height="18" rx="2" fill="currentColor" />
      <rect x="50" y="50" width="5" height="18" rx="2" fill="currentColor" />
      <rect x="85" y="50" width="5" height="18" rx="2" fill="currentColor" />
      <rect x="100" y="50" width="5" height="18" rx="2" fill="currentColor" />
      <path d="M28 38 Q18 30 22 42" fill="currentColor" />
      <circle cx="114" cy="30" r="1.5" fill="white" />
    </svg>
  ),
  'silkie-chickens': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="60" rx="22" ry="25" fill="currentColor" />
      <circle cx="50" cy="30" r="16" fill="currentColor" />
      <circle cx="50" cy="22" r="10" fill="currentColor" />
      <circle cx="48" cy="18" r="4" fill="currentColor" />
      <circle cx="54" cy="16" r="3" fill="currentColor" />
      <circle cx="50" cy="14" r="3" fill="currentColor" />
      <circle cx="56" cy="30" r="1.5" fill="white" />
      <path d="M58 34 L64 32 L58 36" fill="currentColor" />
      <rect x="42" y="80" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="54" y="80" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  )
};

const breedStyles = {
  'valais-blacknose-sheep': { bg: '#2c2826', hover: '#1a1816' },     // darkest black
  'pygmy-goats':            { bg: '#6b6259', hover: '#5c534a' },     // warm brown
  'mini-rex-rabbits':       { bg: '#c0b8aa', hover: '#b0a99d' },     // light warm taupe
  'miniature-dachshunds':   { bg: '#4a4440', hover: '#3d3832' },     // dark charcoal
  'silkie-chickens':        { bg: '#807a72', hover: '#6b6259' },     // medium gray-brown
};

export default function AnimalCard({ breed, index }) {
  const style = breedStyles[breed.slug] || { bg: '#3d3832', hover: '#2c2826' };
  return (
    <Link to={`/${breed.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-cream-200 hover:border-cream-400"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Silhouette area */}
      <div className="aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden"
        style={{ backgroundColor: style.bg }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-plaid-pattern" />
        </div>
        <div className="w-24 h-24 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300">
          {silhouettes[breed.slug]}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-charcoal-600 group-hover:text-sage-500 transition-colors">
          {breed.name}
        </h3>
        <p className="font-body text-sm text-charcoal-300 mt-1 leading-relaxed line-clamp-2">
          {breed.tagline}
        </p>
        <div className="mt-3 flex items-center gap-1 text-sage-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

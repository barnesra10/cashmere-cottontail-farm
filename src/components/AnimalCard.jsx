import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Silhouettes traced from the CCF logo
const silhouettes = {
  'valais-blacknose-sheep': (
    <svg viewBox="0 0 120 110" className="w-full h-full">
      {/* Fluffy wool body - irregular edges for wool texture */}
      <path d="M30 65 Q28 55 32 48 Q30 42 35 38 Q33 32 38 28 Q40 22 48 20 Q52 16 60 16 Q68 16 72 20 Q80 22 82 28 Q87 32 85 38 Q90 42 88 48 Q92 55 90 65 Q88 75 82 80 Q70 85 60 85 Q50 85 38 80 Q32 75 30 65Z" fill="currentColor"/>
      {/* White face */}
      <ellipse cx="60" cy="52" rx="10" ry="12" fill="white"/>
      {/* Nose/mouth */}
      <circle cx="60" cy="56" r="2" fill="currentColor"/>
      <line x1="60" y1="58" x2="60" y2="61" stroke="currentColor" strokeWidth="1"/>
      {/* Floppy ears */}
      <path d="M42 38 Q34 35 30 42 Q28 48 32 50" fill="currentColor"/>
      <path d="M78 38 Q86 35 90 42 Q92 48 88 50" fill="currentColor"/>
      {/* Hooves */}
      <rect x="42" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="52" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="62" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="72" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      {/* Black hooves at bottom */}
      <rect x="42" y="94" width="7" height="5" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="52" y="94" width="7" height="5" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="62" y="94" width="7" height="5" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="72" y="94" width="7" height="5" rx="1" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
  'pygmy-goats': (
    <svg viewBox="0 0 110 100" className="w-full h-full">
      {/* Body */}
      <ellipse cx="50" cy="55" rx="30" ry="20" fill="currentColor"/>
      {/* Neck */}
      <path d="M70 48 Q75 38 78 30" fill="currentColor" stroke="currentColor" strokeWidth="10"/>
      {/* Head */}
      <ellipse cx="82" cy="28" rx="14" ry="11" fill="currentColor"/>
      {/* Horns */}
      <path d="M76 20 L72 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M86 18 L90 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Ear */}
      <path d="M92 24 Q98 22 96 28" fill="currentColor"/>
      {/* Snout */}
      <path d="M94 30 Q98 32 96 28" fill="currentColor"/>
      {/* Legs */}
      <rect x="28" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="40" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="60" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="72" y="68" width="6" height="24" rx="2" fill="currentColor"/>
      {/* Tail */}
      <path d="M20 48 Q14 42 18 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  'mini-rex-rabbits': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Body - sitting position */}
      <ellipse cx="50" cy="68" rx="22" ry="20" fill="currentColor"/>
      {/* Head */}
      <circle cx="62" cy="40" r="15" fill="currentColor"/>
      {/* Ears - upright */}
      <ellipse cx="56" cy="16" rx="5" ry="16" fill="currentColor"/>
      <ellipse cx="68" cy="16" rx="5" ry="16" fill="currentColor"/>
      {/* Inner ear */}
      <ellipse cx="56" cy="18" rx="2.5" ry="10" fill="white" opacity="0.15"/>
      <ellipse cx="68" cy="18" rx="2.5" ry="10" fill="white" opacity="0.15"/>
      {/* Eye */}
      <circle cx="67" cy="37" r="2" fill="white"/>
      {/* Nose */}
      <circle cx="74" cy="42" r="1.5" fill="white" opacity="0.5"/>
      {/* Front paws */}
      <ellipse cx="68" cy="82" rx="6" ry="4" fill="currentColor"/>
      {/* Back haunch */}
      <ellipse cx="35" cy="72" rx="14" ry="12" fill="currentColor"/>
      {/* Tail - small cotton ball */}
      <circle cx="28" cy="60" r="5" fill="currentColor"/>
    </svg>
  ),
  'miniature-dachshunds': (
    <svg viewBox="0 0 140 80" className="w-full h-full">
      {/* Long body */}
      <ellipse cx="68" cy="38" rx="40" ry="14" fill="currentColor"/>
      {/* Chest/front body thicker */}
      <ellipse cx="100" cy="36" rx="16" ry="16" fill="currentColor"/>
      {/* Head */}
      <ellipse cx="118" cy="28" rx="12" ry="10" fill="currentColor"/>
      {/* Long snout */}
      <ellipse cx="130" cy="30" rx="8" ry="5" fill="currentColor"/>
      {/* Ear - floppy */}
      <path d="M112 24 Q106 18 108 28 Q110 34 114 30" fill="currentColor"/>
      {/* Eye */}
      <circle cx="122" cy="26" r="1.5" fill="white"/>
      {/* Nose */}
      <circle cx="136" cy="29" r="2" fill="currentColor"/>
      {/* Short legs */}
      <rect x="38" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="52" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="92" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="106" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      {/* Tail - curved up */}
      <path d="M28 36 Q18 30 20 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  'silkie-chickens': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Fluffy body */}
      <path d="M30 60 Q25 50 30 42 Q28 35 35 30 Q38 22 45 20 Q48 15 55 14 Q62 15 65 20 Q72 22 70 30 Q75 35 73 42 Q78 50 73 60 Q70 72 55 75 Q40 75 30 60Z" fill="currentColor"/>
      {/* Tail feathers - fluffy poof */}
      <path d="M28 45 Q18 38 15 42 Q12 48 18 52 Q22 55 28 55" fill="currentColor"/>
      <path d="M25 40 Q15 32 14 38 Q13 44 20 46" fill="currentColor"/>
      {/* Head poof/crest */}
      <circle cx="55" cy="14" r="5" fill="currentColor"/>
      <circle cx="50" cy="12" r="4" fill="currentColor"/>
      <circle cx="58" cy="11" r="3.5" fill="currentColor"/>
      <circle cx="53" cy="9" r="3" fill="currentColor"/>
      {/* Eye */}
      <circle cx="62" cy="24" r="1.5" fill="white"/>
      {/* Beak */}
      <path d="M68 28 L74 26 L68 30Z" fill="currentColor"/>
      {/* Wattle */}
      <path d="M66 30 Q68 35 64 34" fill="currentColor"/>
      {/* Fluffy feet */}
      <rect x="40" y="72" width="5" height="16" rx="1" fill="currentColor"/>
      <rect x="55" y="72" width="5" height="16" rx="1" fill="currentColor"/>
      {/* Foot toes */}
      <path d="M38 88 L35 92 M42 88 L42 92 M45 88 L48 92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M53 88 L50 92 M57 88 L57 92 M60 88 L63 92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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

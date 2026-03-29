import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Silhouettes extracted from the CCF logo
const silhouettes = {
  'valais-blacknose-sheep': '/silhouettes/sheep.png',
  'pygmy-goats': '/silhouettes/goat.png',
  'mini-rex-rabbits': '/silhouettes/rabbit.png',
  'miniature-dachshunds': '/silhouettes/dachshund.png',
  'silkie-chickens': '/silhouettes/chicken.png',
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
        <div className="w-28 h-28 relative z-10 group-hover:scale-110 transition-transform duration-300">
          <img src={silhouettes[breed.slug]} alt={breed.name} className="w-full h-full object-contain drop-shadow-lg" />
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

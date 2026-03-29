import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Shield, Camera } from 'lucide-react';
import SEO from '../components/SEO';
import MediaGallery from '../components/MediaGallery';
import { useAnimals } from '../hooks/useData';

const breedSilhouettes = {
  'valais-blacknose-sheep': (
    <svg viewBox="0 0 120 110" className="w-full h-full">
      <path d="M30 65 Q28 55 32 48 Q30 42 35 38 Q33 32 38 28 Q40 22 48 20 Q52 16 60 16 Q68 16 72 20 Q80 22 82 28 Q87 32 85 38 Q90 42 88 48 Q92 55 90 65 Q88 75 82 80 Q70 85 60 85 Q50 85 38 80 Q32 75 30 65Z" fill="currentColor"/>
      <ellipse cx="60" cy="52" rx="10" ry="12" fill="white"/>
      <circle cx="60" cy="56" r="2" fill="currentColor"/>
      <line x1="60" y1="58" x2="60" y2="61" stroke="currentColor" strokeWidth="1"/>
      <path d="M42 38 Q34 35 30 42 Q28 48 32 50" fill="currentColor"/>
      <path d="M78 38 Q86 35 90 42 Q92 48 88 50" fill="currentColor"/>
      <rect x="42" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="52" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="62" y="82" width="7" height="16" rx="2" fill="currentColor"/>
      <rect x="72" y="82" width="7" height="16" rx="2" fill="currentColor"/>
    </svg>
  ),
  'pygmy-goats': (
    <svg viewBox="0 0 110 100" className="w-full h-full">
      <ellipse cx="50" cy="55" rx="30" ry="20" fill="currentColor"/>
      <path d="M70 48 Q75 38 78 30" fill="currentColor" stroke="currentColor" strokeWidth="10"/>
      <ellipse cx="82" cy="28" rx="14" ry="11" fill="currentColor"/>
      <path d="M76 20 L72 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M86 18 L90 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M92 24 Q98 22 96 28" fill="currentColor"/>
      <rect x="28" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="40" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="60" y="70" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="72" y="68" width="6" height="24" rx="2" fill="currentColor"/>
      <path d="M20 48 Q14 42 18 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  'mini-rex-rabbits': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="68" rx="22" ry="20" fill="currentColor"/>
      <circle cx="62" cy="40" r="15" fill="currentColor"/>
      <ellipse cx="56" cy="16" rx="5" ry="16" fill="currentColor"/>
      <ellipse cx="68" cy="16" rx="5" ry="16" fill="currentColor"/>
      <circle cx="67" cy="37" r="2" fill="white"/>
      <ellipse cx="68" cy="82" rx="6" ry="4" fill="currentColor"/>
      <ellipse cx="35" cy="72" rx="14" ry="12" fill="currentColor"/>
      <circle cx="28" cy="60" r="5" fill="currentColor"/>
    </svg>
  ),
  'miniature-dachshunds': (
    <svg viewBox="0 0 140 80" className="w-full h-full">
      <ellipse cx="68" cy="38" rx="40" ry="14" fill="currentColor"/>
      <ellipse cx="100" cy="36" rx="16" ry="16" fill="currentColor"/>
      <ellipse cx="118" cy="28" rx="12" ry="10" fill="currentColor"/>
      <ellipse cx="130" cy="30" rx="8" ry="5" fill="currentColor"/>
      <path d="M112 24 Q106 18 108 28 Q110 34 114 30" fill="currentColor"/>
      <circle cx="122" cy="26" r="1.5" fill="white"/>
      <rect x="38" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="52" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="92" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <rect x="106" y="48" width="6" height="16" rx="2" fill="currentColor"/>
      <path d="M28 36 Q18 30 20 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  'silkie-chickens': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M30 60 Q25 50 30 42 Q28 35 35 30 Q38 22 45 20 Q48 15 55 14 Q62 15 65 20 Q72 22 70 30 Q75 35 73 42 Q78 50 73 60 Q70 72 55 75 Q40 75 30 60Z" fill="currentColor"/>
      <path d="M28 45 Q18 38 15 42 Q12 48 18 52 Q22 55 28 55" fill="currentColor"/>
      <path d="M25 40 Q15 32 14 38 Q13 44 20 46" fill="currentColor"/>
      <circle cx="55" cy="14" r="5" fill="currentColor"/>
      <circle cx="50" cy="12" r="4" fill="currentColor"/>
      <circle cx="58" cy="11" r="3.5" fill="currentColor"/>
      <circle cx="53" cy="9" r="3" fill="currentColor"/>
      <circle cx="62" cy="24" r="1.5" fill="white"/>
      <path d="M68 28 L74 26 L68 30Z" fill="currentColor"/>
      <rect x="40" y="72" width="5" height="16" rx="1" fill="currentColor"/>
      <rect x="55" y="72" width="5" height="16" rx="1" fill="currentColor"/>
    </svg>
  )
};

const breedBgColors = {
  'valais-blacknose-sheep': '#2c2826',
  'pygmy-goats': '#6b6259',
  'mini-rex-rabbits':       '#c0b8aa',
  'miniature-dachshunds': '#4a4440',
  'silkie-chickens':        '#807a72'
};

export default function BreedPage({ breed }) {
  const { animals: parents, loading } = useAnimals(breed.id, 'parent');
  const heroColor = breedBgColors[breed.slug] || '#2c2826';

  return (
    <>
      <SEO title={breed.name}
        description={`${breed.tagline} Learn about our ${breed.name} breeding program at Cashmere Cottontail Farm.`}
        path={`/${breed.slug}`} />

      <section style={{ backgroundColor: heroColor }} className="plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="w-20 h-20 text-white/90 mx-auto mb-4">
            {breedSilhouettes[breed.slug]}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{breed.name}</h1>
          <p className="mt-4 font-accent text-lg italic text-white/80 max-w-xl mx-auto">{breed.tagline}</p>
          <Link to={`/${breed.slug}/available`}
            className="inline-flex items-center gap-2 mt-8 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold px-8 py-3 rounded-full transition-colors border border-white/30">
            See Available Babies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-display text-2xl font-bold text-charcoal-600">About Our {breed.short_name}</h2>
            <p className="font-body text-charcoal-500 leading-relaxed">{breed.description}</p>
          </div>
          <div className="bg-cream-200/50 rounded-2xl p-6 border border-cream-300">
            <h3 className="font-display text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Quick Care</h3>
            <p className="font-body text-sm text-charcoal-500 leading-relaxed">{breed.care_note}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream-200/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-sage-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-bold text-charcoal-600 mb-3">Breed Standard</h2>
              <p className="font-body text-charcoal-500 leading-relaxed">{breed.breed_standard}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="font-display text-2xl font-bold text-charcoal-600 text-center mb-4">
          Our <span className="font-script text-sage-500 font-normal">Breeding Stock</span>
        </h2>
        <p className="text-center font-body text-charcoal-300 mb-10 max-w-xl mx-auto">
          Know exactly where your baby is coming from. Meet the sires and dams behind our program.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
          </div>
        ) : parents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parents.map((parent) => (
              <div key={parent.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-lg transition-shadow">
                {parent.animal_media?.length > 0 ? (
                  <MediaGallery media={parent.animal_media} name={parent.name} />
                ) : (
                  <div className="aspect-square bg-cream-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-cream-300" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      parent.sex === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>{parent.sex === 'male' ? 'Sire' : 'Dam'}</span>
                    {parent.show_quality && <Star className="w-4 h-4 text-wheat-500" />}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-600">{parent.name}</h3>
                  {parent.registration && <p className="text-xs text-charcoal-300 font-body mt-0.5">Reg: {parent.registration}</p>}
                  {parent.description && <p className="text-sm text-charcoal-400 font-body mt-2 leading-relaxed">{parent.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-cream-100 rounded-2xl p-12 border border-cream-200">
            <Camera className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <p className="font-body text-charcoal-400">Breeding stock profiles coming soon!</p>
            <p className="font-body text-sm text-charcoal-300 mt-1">Check back for photos, pedigrees, and details.</p>
          </div>
        )}
      </section>

      <section className="bg-sage-500 plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Heart className="w-8 h-8 mx-auto mb-3 text-white/70" />
          <h2 className="font-display text-2xl font-bold mb-3">Interested in a {breed.short_name}?</h2>
          <p className="font-body text-white/80 mb-6">See what babies are coming up or currently available.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${breed.slug}/available`} className="bg-white text-sage-600 hover:bg-cream-100 font-semibold px-8 py-3 rounded-full transition-colors">View Available</Link>
            <Link to="/contact" className="border-2 border-white/40 hover:border-white/70 text-white font-semibold px-8 py-3 rounded-full transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

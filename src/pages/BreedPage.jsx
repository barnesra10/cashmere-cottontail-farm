import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Shield, Camera } from 'lucide-react';
import SEO from '../components/SEO';
import MediaGallery from '../components/MediaGallery';
import { useAnimals } from '../hooks/useData';

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
          <span className="text-6xl mb-4 block">{breed.emoji}</span>
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

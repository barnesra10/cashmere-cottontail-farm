import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Camera, Bell, Heart, Award, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import SEO from '../components/SEO';
import MediaGallery from '../components/MediaGallery';
import { useAnimals, useLitters } from '../hooks/useData';

const breedBgColors = {
  'valais-blacknose-sheep': '#2c2826',
  'pygmy-goats': '#6b6259',
  'mini-rex-rabbits':       '#c0b8aa',
  'miniature-dachshunds': '#4a4440',
  'silkie-chickens':        '#807a72'
};

export default function AvailablePage({ breed }) {
  const { animals: available, loading: loadingAnimals } = useAnimals(breed.id, 'available');
  const { animals: sold, loading: loadingSold } = useAnimals(breed.id, 'sold');
  const { litters, loading: loadingLitters } = useLitters(breed.id);
  const heroColor = breedBgColors[breed.slug] || '#2c2826';

  return (
    <>
      <SEO title={`Available ${breed.short_name}`}
        description={`See available and upcoming ${breed.name} babies at Cashmere Cottontail Farm.`}
        path={`/${breed.slug}/available`} />

      <section style={{ backgroundColor: heroColor }} className="plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link to={`/${breed.slug}`} className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm font-body mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {breed.short_name}
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Available {breed.short_name}</h1>
          <p className="mt-2 font-body text-white/70">Upcoming litters & babies ready for their forever homes.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-sage-500" />
            <h2 className="font-display text-2xl font-bold text-charcoal-600">Available Now</h2>
          </div>

          {loadingAnimals ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
            </div>
          ) : available.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {available.map((animal) => (
                <div key={animal.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-lg transition-shadow">
                  {animal.animal_media?.length > 0 ? (
                    <MediaGallery media={animal.animal_media} name={animal.name} />
                  ) : (
                    <div className="aspect-square bg-cream-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-cream-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        animal.sex === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>{animal.sex}</span>
                      {animal.status && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          animal.status === 'available' ? 'bg-green-100 text-green-700' :
                          animal.status === 'reserved' ? 'bg-wheat-100 text-wheat-500' :
                          'bg-charcoal-50 text-charcoal-400'
                        }`}>{animal.status}</span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-charcoal-600">{animal.name}</h3>
                    {animal.date_of_birth && <p className="text-xs text-charcoal-300 font-body">Born {new Date(animal.date_of_birth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>}
                    {animal.sire_name && animal.dam_name && <p className="text-xs text-charcoal-300 font-body mt-0.5">{animal.sire_name} × {animal.dam_name}</p>}
                    {animal.description && <p className="text-sm text-charcoal-400 font-body mt-2 leading-relaxed">{animal.description}</p>}
                    {animal.price && <p className="mt-3 font-display text-lg font-bold text-sage-600">${Number(animal.price).toLocaleString()}</p>}
                    <Link to="/contact" className="mt-3 block text-center bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold py-2 rounded-full transition-colors">Inquire</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cream-100 rounded-2xl p-10 border border-cream-200 text-center">
              <Heart className="w-10 h-10 text-cream-300 mx-auto mb-3" />
              <p className="font-display text-lg text-charcoal-500 mb-1">No babies available right now</p>
              <p className="font-body text-sm text-charcoal-300">Check back soon or contact us to get on our waiting list!</p>
              <Link to="/contact" className="inline-block mt-4 bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">Join Waiting List</Link>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-wheat-500" />
            <h2 className="font-display text-2xl font-bold text-charcoal-600">Upcoming Litters</h2>
          </div>
          {loadingLitters ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" /></div>
          ) : litters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {litters.map((litter) => (
                <div key={litter.id} className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-charcoal-600">{litter.title}</h3>
                      <p className="text-sm text-charcoal-300 font-body">{litter.sire_name} × {litter.dam_name}</p>
                    </div>
                    <span className="bg-wheat-100 text-wheat-500 text-xs font-bold px-3 py-1 rounded-full">{litter.expected_date}</span>
                  </div>
                  {litter.description && <p className="text-sm text-charcoal-400 font-body leading-relaxed">{litter.description}</p>}
                  {litter.spots_left !== null && (
                    <p className="mt-3 text-sm font-semibold text-sage-600">
                      {litter.spots_left > 0 ? `${litter.spots_left} spots on waiting list` : 'Waiting list full'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cream-100 rounded-2xl p-10 border border-cream-200 text-center">
              <Calendar className="w-10 h-10 text-cream-300 mx-auto mb-3" />
              <p className="font-display text-lg text-charcoal-500 mb-1">No litters currently planned</p>
              <p className="font-body text-sm text-charcoal-300">Contact us to learn about future breeding plans!</p>
            </div>
          )}
        </section>

        {/* Previously Placed */}
        {!loadingSold && sold.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-plaid-dark" />
              <h2 className="font-display text-2xl font-bold text-charcoal-600">Previously Placed</h2>
            </div>
            <p className="font-body text-sm text-charcoal-300 mb-6">These beauties have found their forever homes. See the quality we produce!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sold.map((animal) => (
                <SoldAnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          </section>
        )}

        <section className="bg-charcoal-700 rounded-2xl p-8 md:p-10 text-center plaid-bg overflow-hidden">
          <div className="relative z-10">
            <Bell className="w-8 h-8 text-wheat-400 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-cream-100 mb-2">Don't Miss Out</h3>
            <p className="font-body text-cream-300 text-sm mb-5 max-w-md mx-auto">Get notified when new {breed.short_name} babies are available.</p>
            <Link to="/contact" className="inline-block bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">Get Notified</Link>
          </div>
        </section>
      </div>
    </>
  );
}

function SoldAnimalCard({ animal }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDelta, setTouchDelta] = useState(0);

  const allMedia = (animal.animal_media || []).filter(m => !m.url?.includes('.pdf'));
  const photos = allMedia.filter(m => m.media_type === 'photo');
  const videos = allMedia.filter(m => m.media_type === 'video');
  const primaryPhoto = photos.find(m => m.is_primary) || photos[0];
  // All viewable items: photos first, then videos
  const gallery = [...photos, ...videos];

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const next = () => setLightboxIdx(i => (i + 1) % gallery.length);
  const prev = () => setLightboxIdx(i => (i - 1 + gallery.length) % gallery.length);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-cream-200 shadow-sm">
      {/* Main image */}
      {primaryPhoto ? (
        <div className="aspect-[4/3] relative cursor-pointer" onClick={() => openLightbox(photos.indexOf(primaryPhoto))}>
          <img src={primaryPhoto.url} alt={animal.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-charcoal-700/80 text-cream-100 text-[9px] font-bold px-2 py-0.5 rounded-full">
            Found their home
          </div>
          {gallery.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-charcoal-700/70 text-white text-[10px] px-2 py-0.5 rounded-full">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}{videos.length > 0 ? ` · ${videos.length} video` : ''}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[4/3] bg-cream-200 flex items-center justify-center">
          <Camera className="w-10 h-10 text-cream-300" />
        </div>
      )}

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide">
          {gallery.map((m, i) => (
            <button key={m.id} onClick={() => openLightbox(i)}
              className={`flex-none w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                m.id === primaryPhoto?.id ? 'border-sage-500' : 'border-cream-200 hover:border-cream-400'
              }`}>
              {m.media_type === 'video' ? (
                <div className="w-full h-full bg-charcoal-700 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white/80" />
                </div>
              ) : (
                <img src={m.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="px-4 pb-4 pt-1">
        <p className="font-display font-semibold text-charcoal-600">{animal.name}</p>
        <p className="text-xs text-charcoal-300 mt-0.5">{animal.sex}{animal.description ? ` · ${animal.description.substring(0, 60)}${animal.description.length > 60 ? '...' : ''}` : ''}</p>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchMove={(e) => { if (touchStart !== null) setTouchDelta(e.touches[0].clientX - touchStart); }}
          onTouchEnd={() => {
            if (Math.abs(touchDelta) > 60) {
              if (touchDelta > 0) prev(); else next();
            }
            setTouchStart(null); setTouchDelta(0);
          }}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2" onClick={closeLightbox}>
            <X className="w-7 h-7" />
          </button>

          {gallery.length > 1 && (
            <>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-50"
                onClick={(e) => { e.stopPropagation(); prev(); }}>
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-50"
                onClick={(e) => { e.stopPropagation(); next(); }}>
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-3xl max-h-[85vh] w-full mx-4 transition-transform duration-150"
            style={{ transform: `translateX(${touchDelta * 0.5}px)` }}
            onClick={(e) => e.stopPropagation()}>
            {gallery[lightboxIdx]?.media_type === 'video' ? (
              <video controls autoPlay playsInline className="w-full max-h-[80vh] rounded-lg">
                <source src={gallery[lightboxIdx].url} />
              </video>
            ) : (
              <img src={gallery[lightboxIdx]?.url} alt={animal.name}
                className="w-full max-h-[80vh] object-contain rounded-lg select-none" draggable={false} />
            )}
            <div className="text-center mt-3 text-white/60 text-sm">
              {lightboxIdx + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

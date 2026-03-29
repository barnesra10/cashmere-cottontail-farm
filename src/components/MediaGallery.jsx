import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function MediaGallery({ media = [], name = '' }) {
  const [lightbox, setLightbox] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDelta, setTouchDelta] = useState(0);

  if (!media || media.length === 0) return null;

  const sorted = [...media]
    .filter(m => !m.url?.includes('.pdf'))
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  const photos = sorted.filter(m => m.media_type === 'photo');
  const videos = sorted.filter(m => m.media_type === 'video');
  const primary = photos[0] || sorted[0];

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => { setLightbox(null); setTouchDelta(0); setTouchStart(null); };
  const prev = () => setLightbox(i => (i > 0 ? i - 1 : sorted.length - 1));
  const next = () => setLightbox(i => (i < sorted.length - 1 ? i + 1 : 0));

  return (
    <>
      <div className="space-y-0">
        {/* Primary image */}
        <div className="aspect-[4/3] bg-cream-100 overflow-hidden cursor-pointer relative group"
          onClick={() => openLightbox(sorted.indexOf(primary))}>
          {primary.media_type === 'video' ? (
            <>
              <video src={primary.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-charcoal-700 ml-0.5" />
                </div>
              </div>
            </>
          ) : (
            <img src={primary.url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          )}
          {sorted.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-charcoal-700/70 text-white text-[10px] px-2 py-0.5 rounded-full">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}{videos.length > 0 ? ` \u00b7 ${videos.length} video` : ''}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {sorted.length > 1 && (
          <div className="flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide">
            {sorted.map((m, i) => (
              <button key={m.id} onClick={() => openLightbox(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  m.id === primary.id ? 'border-sage-500' : 'border-cream-200 hover:border-cream-400'
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
      </div>

      {/* Lightbox with swipe */}
      {lightbox !== null && (
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
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2">
            <X className="w-7 h-7" />
          </button>

          {sorted.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-50">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-50">
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-3xl max-h-[85vh] w-full mx-4 transition-transform duration-150"
            style={{ transform: `translateX(${touchDelta * 0.5}px)` }}
            onClick={e => e.stopPropagation()}>
            {sorted[lightbox].media_type === 'video' ? (
              <video src={sorted[lightbox].url} controls autoPlay playsInline
                className="w-full max-h-[80vh] rounded-lg" />
            ) : (
              <img src={sorted[lightbox].url} alt={name}
                className="w-full max-h-[80vh] object-contain rounded-lg select-none" draggable={false} />
            )}
            <div className="text-center mt-3 text-white/60 text-sm">
              {lightbox + 1} / {sorted.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function MediaGallery({ media = [], name = '' }) {
  const [lightbox, setLightbox] = useState(null);

  if (!media || media.length === 0) return null;

  const sorted = [...media].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const primary = sorted[0];
  const rest = sorted.slice(1);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(i => (i > 0 ? i - 1 : sorted.length - 1));
  const next = () => setLightbox(i => (i < sorted.length - 1 ? i + 1 : 0));

  return (
    <>
      {/* Main display */}
      <div className="space-y-2">
        {/* Primary media */}
        <div className="aspect-square bg-cream-100 rounded-xl overflow-hidden cursor-pointer relative group"
          onClick={() => openLightbox(0)}>
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
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              1/{sorted.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {rest.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {sorted.map((m, i) => (
              <button key={m.id} onClick={() => openLightbox(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === 0 ? 'border-sage-400' : 'border-cream-200 hover:border-sage-300'
                } relative`}>
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

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2">
            <X className="w-7 h-7" />
          </button>

          {sorted.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10">
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full mx-4" onClick={e => e.stopPropagation()}>
            {sorted[lightbox].media_type === 'video' ? (
              <video src={sorted[lightbox].url} controls autoPlay playsInline
                className="w-full max-h-[85vh] rounded-lg" />
            ) : (
              <img src={sorted[lightbox].url} alt={name}
                className="w-full max-h-[85vh] object-contain rounded-lg" />
            )}
            <p className="text-center text-white/50 text-sm mt-2">
              {lightbox + 1} of {sorted.length} {sorted[lightbox].media_type === 'video' ? '(video)' : ''}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

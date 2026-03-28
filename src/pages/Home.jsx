import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Sprout, Award } from 'lucide-react';
import SEO from '../components/SEO';
import AnimalCard from '../components/AnimalCard';
import { useBreeds } from '../hooks/useData';

export default function Home() {
  const { breeds, loading } = useBreeds();

  return (
    <>
      <SEO
        description="Cashmere Cottontail Farm in Winslow, Arkansas breeds luxury Valais Blacknose sheep, Pygmy goats, Mini Rex rabbits, Miniature Dachshunds, and Silkie chickens. Find your dream boutique animal."
        path="/"
      />

      {/* Hero */}
      <section className="relative bg-charcoal-700 overflow-hidden">
        <div className="absolute inset-0 plaid-bg opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <img src="/logo.jpeg" alt="Cashmere Cottontail Farm Logo" className="mx-auto h-40 md:h-56 w-auto rounded-xl shadow-2xl mb-8" />
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-cream-100 font-bold leading-tight">
            Luxury & Boutique<br />
            <span className="font-script text-wheat-400 font-normal">Miniature Animals</span>
          </h1>
          <p className="mt-5 font-body text-lg md:text-xl text-cream-200/80 max-w-2xl mx-auto leading-relaxed">
            Whether you have show aspirations or want the most unique companion that stands out
            in the pasture — or even your backyard — every animal we breed was <em className="text-wheat-300">born to a purpose</em>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => {
              const target = document.getElementById('animals');
              if (!target) return;
              const start = window.scrollY;
              const end = target.getBoundingClientRect().top + window.scrollY - 80;
              const distance = end - start;
              const duration = 1800; // 1.8 seconds — slow and elegant
              let startTime = null;
              function ease(t) {
                // Custom ease-in-out cubic for a luxurious feel
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
              }
              function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                window.scrollTo(0, start + distance * ease(progress));
                if (progress < 1) requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            }}
              className="inline-flex items-center gap-2 text-charcoal-700 font-body font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg hover:shadow-xl cursor-pointer" style={{ backgroundColor: '#c0b8aa' }}>
              Meet Our Animals <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-transparent border-2 border-cream-200/40 hover:border-cream-200/70 text-cream-100 font-body font-semibold px-8 py-3.5 rounded-full transition-colors">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-cream-200/50 border-y border-cream-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { icon: Award, label: 'Breed Standard Focused', desc: 'Show-quality genetics' },
              { icon: Heart, label: 'Born to a Purpose', desc: 'Every animal matters' },
              { icon: Sprout, label: 'Organic Produce', desc: 'Farm-fresh goodness' },
              { icon: Star, label: 'Boutique Quality', desc: 'Rare & unique breeds' }
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <v.icon className="w-7 h-7 text-sage-500" />
                <p className="font-display text-sm font-semibold text-charcoal-600">{v.label}</p>
                <p className="font-body text-xs text-charcoal-300">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal Grid */}
      <section id="animals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-4xl text-charcoal-600 font-bold">
            Our <span className="font-script text-sage-500 font-normal">Animals</span>
          </h2>
          <p className="mt-3 font-body text-charcoal-300 max-w-xl mx-auto">
            From the world's cutest sheep to velvet-furred rabbits, explore our carefully bred boutique breeds.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {breeds.map((breed, i) => (
              <AnimalCard key={breed.id} breed={breed} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Mission */}
      <section className="bg-sage-500 plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
          <p className="font-accent text-lg md:text-xl italic leading-relaxed text-white/90">
            "Our goal is to provide any family with the luxury or boutique animal of their dreams —
            whether they have show aspirations or just want the most unique pet that stands out in
            the pasture or even their backyard."
          </p>
          <p className="mt-6 font-body text-sm text-white/70">
            We are focused on breed standards but we also know that those that don't meet show quality
            standards are sometimes the best friend you ever had — so every animal we breed was born to a purpose.
          </p>
        </div>
      </section>

      {/* Produce teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-wheat-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-wheat-300">
          <div className="flex-1">
            <Sprout className="w-10 h-10 text-sage-500 mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-charcoal-600 font-bold">
              Farm-Fresh <span className="font-script text-sage-500 font-normal">Organic Produce</span>
            </h2>
            <p className="mt-3 font-body text-charcoal-400 leading-relaxed">
              We grow organic produce that we use to nourish our animals and offer for sale
              to clients who value how their food is grown. Straight from our farm to your table.
            </p>
            <Link to="/produce" className="inline-flex items-center gap-2 mt-5 text-sage-500 hover:text-sage-600 font-semibold font-body transition-colors">
              View Produce <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-40 h-40 bg-sage-100 rounded-2xl flex items-center justify-center">
            <Sprout className="w-20 h-20 text-sage-400" />
          </div>
        </div>
      </section>
    </>
  );
}

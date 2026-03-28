import { Link } from 'react-router-dom';
import { Sprout, Leaf, Sun, Droplets } from 'lucide-react';
import SEO from '../components/SEO';

export default function Produce() {
  return (
    <>
      <SEO
        title="Organic Produce"
        description="Farm-fresh organic produce from Cashmere Cottontail Farm. Grown with care for our animals and available for our clients who value how their food is grown."
        path="/produce"
      />

      {/* Hero */}
      <section className="bg-sage-500 plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <Sprout className="w-12 h-12 mx-auto mb-4 text-white/80" />
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            Organic <span className="font-script font-normal text-wheat-300">Produce</span>
          </h1>
          <p className="mt-4 font-body text-lg text-white/80 max-w-xl mx-auto">
            Grown with care on our farm — for our animals and for families who value how their food is raised.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-charcoal-600">
            From Our Farm to <span className="font-script text-sage-500 font-normal">Your Table</span>
          </h2>
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            At Cashmere Cottontail Farm, we grow organic produce that serves a dual purpose — it
            nourishes our animals with the best possible nutrition, and it's available to our clients
            who want to know exactly how their food was grown.
          </p>
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            No pesticides, no shortcuts. Just honest, sun-grown food from our farm to yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Sun, title: 'Sun-Grown', desc: 'Natural sunlight and seasonal growing for peak flavor and nutrition.' },
            { icon: Leaf, title: 'Certified Organic', desc: 'No synthetic pesticides or fertilizers — just clean, honest growing practices.' },
            { icon: Droplets, title: 'Sustainably Irrigated', desc: 'Responsible water use that supports our farm ecosystem.' }
          ].map((item, i) => (
            <div key={i} className="bg-cream-100 rounded-2xl p-6 border border-cream-200 text-center">
              <item.icon className="w-8 h-8 text-sage-500 mx-auto mb-3" />
              <h3 className="font-display text-sm font-semibold text-charcoal-600 mb-1">{item.title}</h3>
              <p className="font-body text-xs text-charcoal-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal availability placeholder */}
      <section className="bg-cream-200/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sprout className="w-10 h-10 text-sage-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-charcoal-600 mb-3">Seasonal Availability</h2>
          <p className="font-body text-charcoal-400 max-w-lg mx-auto mb-6">
            Our produce availability changes with the seasons. Contact us to learn what's currently
            growing and available for purchase.
          </p>
          <Link to="/contact"
            className="inline-block bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Ask About Current Produce
          </Link>
        </div>
      </section>
    </>
  );
}

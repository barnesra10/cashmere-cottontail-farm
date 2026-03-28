import { Link } from 'react-router-dom';
import { Heart, Award, Sprout, Users } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="Our Farm"
        description="Learn about Cashmere Cottontail Farm in Winslow, Arkansas — our mission, our values, and our commitment to breeding luxury and boutique miniature animals with purpose."
        path="/about"
      />

      {/* Hero */}
      <section className="bg-charcoal-700 plaid-bg text-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            Our <span className="font-script text-wheat-400 font-normal">Story</span>
          </h1>
          <p className="mt-4 font-body text-lg text-cream-200/80 max-w-2xl mx-auto leading-relaxed">
            Established in 2025, Cashmere Cottontail Farm was built on a simple belief:
            every family deserves the luxury or boutique animal of their dreams.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="prose-style space-y-6">
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            At Cashmere Cottontail Farm, we breed luxury Valais Blacknose sheep and other boutique
            miniatures including Pygmy goats, Mini Rex rabbits, Miniature Dachshunds, and Silkie
            chickens — specializing in rare satin mottled, black splits from mottled, and mottled varieties.
          </p>
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            Whether our clients have show aspirations or simply want the most unique pet that stands
            out in the pasture or even their backyard, we are here to make that dream a reality.
          </p>
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            We are deeply focused on breed standards — our breeding programs are built around producing
            animals that meet or exceed the standards for their respective registries. But we also know
            that the animals that don't quite meet show-quality standards are sometimes the best friend
            you ever had.
          </p>
          <p className="font-accent text-xl italic text-sage-600 border-l-4 border-sage-300 pl-6 my-8">
            Every animal we breed was born to a purpose.
          </p>
          <p className="font-body text-lg text-charcoal-500 leading-relaxed">
            Beyond our animals, we grow organic produce that nourishes both our livestock and our
            clients. We believe in knowing exactly where your food comes from and how it was grown.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-200/50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal-600 font-bold text-center mb-12">
            What We <span className="font-script text-sage-500 font-normal">Stand For</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Award, title: 'Breed Standard Excellence', text: 'Every breeding decision is guided by established breed standards. We invest in the best genetics to produce exceptional animals.' },
              { icon: Heart, title: 'Purpose in Every Life', text: 'Show quality or beloved companion — every animal born on our farm has a purpose and a loving home waiting.' },
              { icon: Sprout, title: 'Organic & Sustainable', text: 'Our produce is organically grown, nourishing our animals and available to families who care about how their food is raised.' },
              { icon: Users, title: 'Family First', text: 'We work with each family to match them with the right animal for their lifestyle, experience, and dreams.' }
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm">
                <v.icon className="w-8 h-8 text-sage-500 mb-4" />
                <h3 className="font-display text-lg font-semibold text-charcoal-600 mb-2">{v.title}</h3>
                <p className="font-body text-sm text-charcoal-400 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-600 mb-4">
          Ready to Find Your Dream Animal?
        </h2>
        <p className="font-body text-charcoal-400 mb-6">
          Browse our breeds or get in touch — we'd love to help you find the perfect match.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/valais-blacknose-sheep" className="bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Browse Animals
          </Link>
          <Link to="/contact" className="border-2 border-sage-500 text-sage-500 hover:bg-sage-50 font-semibold px-8 py-3 rounded-full transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

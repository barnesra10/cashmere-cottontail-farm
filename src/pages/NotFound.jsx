import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="This page doesn't exist." />
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <span className="text-7xl mb-6 block">🐑</span>
        <h1 className="font-display text-4xl font-bold text-charcoal-600 mb-3">Oops — Lost in the Pasture</h1>
        <p className="font-body text-charcoal-400 mb-8">The page you're looking for doesn't exist. Let's get you back on track.</p>
        <Link to="/" className="bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
          Back to Home
        </Link>
      </div>
    </>
  );
}

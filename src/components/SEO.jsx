import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '', image = '/logo.jpeg' }) {
  const siteUrl = 'https://cashmerecottontailfarm.com';
  const fullUrl = `${siteUrl}${path}`;
  const fullTitle = title
    ? `${title} — Cashmere Cottontail Farm`
    : 'Cashmere Cottontail Farm — Luxury & Boutique Miniature Animals';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

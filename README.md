# Cashmere Cottontail Farm Website

Luxury & boutique miniature animal breeder — Valais Blacknose sheep, Pygmy goats, Mini Rex rabbits, Miniature Dachshunds & Silkie chickens.

## Tech Stack

- **React 18** + **Vite** — fast builds and HMR
- **Tailwind CSS** — utility-first styling with custom farm brand tokens
- **React Router** — client-side routing with SEO-ready pages
- **react-helmet-async** — dynamic meta tags per page
- **Framer Motion** — animations (ready to add)
- **PWA** — installable app for phone-based photo uploads
- **Claude AI Chat** — embedded chat widget for visitor Q&A

## Quick Start

```bash
npm install
npm run dev
```

## Deploy

### Cloudflare Pages
1. Connect this repo in Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Output directory: `dist`
4. Point your domain DNS in Cloudflare

### Netlify
1. Connect this repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

## Adding Animals

Edit `src/data/breeds.js` to add:
- **Parents** (sires/dams) — add to the `parents` array for each breed
- **Available babies** — add to the `available` array
- **Upcoming litters** — add to the `upcoming` array

Example parent:
```js
{
  name: 'Highland King',
  sex: 'male',
  photo: '/photos/highland-king.jpg',
  registration: 'VBSSA-1234',
  showQuality: true,
  description: 'Imported Swiss genetics with perfect facial markings.'
}
```

Example available animal:
```js
{
  name: 'Snowflake',
  sex: 'female',
  photo: '/photos/snowflake.jpg',
  dob: 'March 2026',
  sire: 'Highland King',
  dam: 'Alpine Rose',
  status: 'available',
  price: 3500,
  description: 'Stunning ewe lamb with excellent markings.'
}
```

## Social Media Auto-Posting

Use **IFTTT**, **Zapier**, or **Make.com** to auto-post:
1. Set up an RSS feed from your site (add a blog/updates section)
2. Connect RSS → Facebook, Instagram, TikTok
3. Or use the PWA to post directly → triggers webhook → posts to socials

## SEO Features

- Structured data (JSON-LD) for local business + product catalog
- Dynamic meta tags per page via react-helmet-async
- Semantic HTML structure
- robots.txt and sitemap-ready
- Open Graph + Twitter Card meta tags

## Future Enhancements

- Supabase backend for dynamic animal data + photo uploads
- PWA camera integration for phone-based posting
- Webhook → social media auto-posting pipeline
- Blog/updates section with RSS feed
- Email notification system for waiting lists

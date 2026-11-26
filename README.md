# Ena’s Beauty Salon — website v2 (Next.js)

Bilingual site: English at `/`, Spanish at `/es`. Domain: **https://enasbeautysalon.com**.
Replaces `dist/` and the earlier `next-site/` wrapper (both kept untouched).

## Commands

```powershell
npm install
npm run dev      # http://localhost:4176  (4174 is used by the old static server)
npm run check
npm run build
npm run assets   # regenerate favicons + og-image.jpg from brand/logos originals (Python + Pillow)
```

## Structure

| Path | Content |
|---|---|
| `lib/site.ts` | Contact data (from the original card — confirm before publishing) |
| `lib/i18n.ts` | All EN/ES copy, meta titles and descriptions, reels list |
| `lib/google-reviews.ts` | Server-only Google Places API (New) client, cached 12 h (ISR) |
| `app/[lang]/` | Layout (metadata, hreflang, Open Graph) and page |
| `components/` | Header + drawer, video player, reel controls, reviews, JSON-LD |
| `public/` | Favicons (crop of the original symbol), `og-image.jpg` (1200×630, 68 KB), images, videos |

## SEO included

- Unique title/description per language, canonical + `hreflang`, Open Graph/Twitter cards.
- `HairSalon`, `WebSite`, `WebPage`, `FAQPage` JSON-LD with confirmed facts only (no hours or prices).
- `sitemap.xml`, `robots.txt`, manifest, favicons; `next/image` for every image; hero preloaded.

## Before publishing (see `../docs/REVISION-ANTES-DE-PUBLICAR.md`)

Confirm phone/WhatsApp, email, hours, services and pricing with Ena; rights to the Instagram/TikTok videos.
Service photos and the hero are illustrative and labeled as such.

## Deploy (Vercel)

Create a project from this folder (Framework: Next.js), add `enasbeautysalon.com` + `www` in
Settings › Domains (apex primary), apply the DNS records shown, then submit
`https://enasbeautysalon.com/sitemap.xml` in Google Search Console.

## Google reviews

Ena has no Google Business Profile yet, so the Reviews section is hidden. Once the profile is created and verified:

1. Set the profile website to `https://enasbeautysalon.com`, with name/phone/address identical to `lib/site.ts`.
2. Google Cloud › enable **Places API (New)** › create a key restricted to that API.
3. Vercel env vars: `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` (required here, to avoid matching another salon).
4. Redeploy: the section and its menu link appear automatically, refreshed every 12 h.

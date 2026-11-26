import {dictionaries, pathFor, type Lang} from '@/lib/i18n';
import {site} from '@/lib/site';

/** HairSalon structured data with confirmed facts only (no invented hours, prices or ratings). */
export function JsonLd({lang}: {lang: Lang}) {
  const d = dictionaries[lang];
  const pageUrl = `${site.url}${pathFor(lang) === '/' ? '/' : pathFor(lang)}`;
  const inLanguage = lang === 'en' ? 'en-US' : 'es-US';
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HairSalon',
        '@id': `${site.url}/#salon`,
        name: site.name,
        description: d.meta.description,
        url: site.url,
        telephone: site.phoneE164,
        email: site.email,
        image: `${site.url}/og-image.jpg`,
        logo: `${site.url}/icon-512.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        areaServed: {'@type': 'City', name: 'Katy, Texas'},
        hasMap: site.mapsUrl,
        sameAs: [site.social.instagram, site.social.tiktok],
        knowsLanguage: ['en', 'es'],
        employee: {'@type': 'Person', name: site.stylist, jobTitle: 'Hairstylist & Barber'},
        makesOffer: d.services.items.map(item => ({'@type': 'Offer', itemOffered: {'@type': 'Service', name: item.title, description: item.text}})),
      },
      {'@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, inLanguage: ['en-US', 'es-US'], publisher: {'@id': `${site.url}/#salon`}},
      {'@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: d.meta.title, inLanguage, isPartOf: {'@id': `${site.url}/#website`}, about: {'@id': `${site.url}/#salon`}},
      {'@type': 'FAQPage', '@id': `${pageUrl}#faq`, inLanguage, mainEntity: d.faq.items.map(item => ({'@type': 'Question', name: item.q, acceptedAnswer: {'@type': 'Answer', text: item.a}}))},
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(graph).replace(/</g, '\\u003c')}} />;
}

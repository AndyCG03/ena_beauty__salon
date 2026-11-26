// Single source of truth for business data. Contacts come from Ena's original card:
// confirm they are current before publishing (docs/REVISION-ANTES-DE-PUBLICAR.md).
export const site = {
  // Primary host configured in Vercel (apex redirects to www).
  url: 'https://www.enasbeautysalon.com',
  // Set when Ena's Google Business Profile is verified: https://search.google.com/local/writereview?placeid=<PLACE_ID>
  googleWriteReview: undefined as string | undefined,
  name: 'Ena’s Beauty Salon',
  stylist: 'Ena Ramirez',
  phoneDisplay: '713-820-5793',
  phoneE164: '+17138205793',
  whatsapp: '17138205793',
  email: 'enaramires62@gmail.com',
  address: {street: '21126 Terrace View Dr', city: 'Katy', region: 'TX', postalCode: '77449', country: 'US'},
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=21126%20Terrace%20View%20Dr%2C%20Katy%2C%20TX%2077449',
  social: {
    instagram: 'https://www.instagram.com/enaramires62/',
    tiktok: 'https://www.tiktok.com/@enasbeautysalon',
  },
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
export const whatsappUrl = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

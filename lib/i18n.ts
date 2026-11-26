export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];
export const isLang = (value: string): value is Lang => (languages as readonly string[]).includes(value);
export const pathFor = (lang: Lang) => (lang === 'en' ? '/' : '/es');

type Service = {image: string; width: number; height: number; title: string; text: string; message: string; alt: string};

export type Dictionary = {
  meta: {title: string; description: string; ogAlt: string; locale: string};
  nav: {home: string; services: string; work: string; about: string; reviews: string; contact: string; skip: string; menu: string; open: string; close: string; explore: string; talk: string; switchTo: string; switchLabel: string; main: string};
  hero: {kicker: string; eyebrow: string; copy: string; book: string; services: string};
  services: {eyebrow: string; title: string; intro: string; cta: string; items: Service[]; note: string; more: string};
  portfolio: {title: string; visit: string; reel: (n: number) => string; prev: string; next: string};
  about: {play: string; title: string; text: string};
  reviews: {eyebrow: string; title: string; basedOn: (n: number) => string; readAll: string; write: string; fromGoogle: string};
  rate: {eyebrow: string; title: string; text: string; nav: string};
  faq: {eyebrow: string; title: string; items: {q: string; a: string}[]};
  visit: {eyebrow: string; title: string; text: string; address: string; hours: string; hoursValue: string; pricing: string; pricingValue: string; directions: string};
  footer: {tagline: string; book: string; explore: string; connect: string; top: string; rights: string};
  mobile: {call: string; whatsapp: string; directions: string; whatsappText: string};
  video: {chair: string; meet: string; close: string; original: string; label: string};
};

const img = (image: string, width: number, height: number) => ({image, width, height});

export const dictionaries: Record<Lang, Dictionary> = {
  en: {
    meta: {
      title: 'Ena’s Beauty Salon | Hairstylist & Barber in Katy, TX',
      description: 'Hair salon and barber in Katy, Texas. Haircuts, color, styling and barber cuts with Ena Ramirez. Call or text 713-820-5793 to book your appointment.',
      ogAlt: 'Ena’s Beauty Salon — hairstylist & barber in Katy, Texas. Book an appointment: 713-820-5793.',
      locale: 'en_US',
    },
    nav: {home: 'Home', services: 'Services', work: 'Portfolio', about: 'Meet Ena', reviews: 'Reviews', contact: 'Contact', skip: 'Skip to content', menu: 'EXPLORE ENA’S', open: 'Open menu', close: 'Close menu', explore: 'Sections', talk: 'Let’s talk about your look', switchTo: 'ES', switchLabel: 'Ver en español', main: 'Main navigation'},
    hero: {kicker: 'Hair salon & barber in Katy, Texas', eyebrow: 'HAIRSTYLIST & BARBER · KATY, TX', copy: 'Explore Ena’s work and find inspiration for your next appointment.', book: 'Book an appointment', services: 'View services'},
    services: {
      eyebrow: 'YOUR NEXT LOOK',
      title: 'A little inspiration.',
      intro: 'From a subtle refresh to a new direction. Explore these ideas, then talk with Ena about your hair and the look you have in mind.',
      cta: 'Prepare your visit',
      items: [
        {...img('cut', 900, 1350), title: 'Cut & shape', alt: 'Illustrative haircut reference', text: 'Length, layers and texture can change the feel of a haircut. Start with the shape you love and how you like to wear it every day.', message: 'Hi Ena! I would like to book a haircut. Could you share your availability and pricing?'},
        {...img('color', 900, 1200), title: 'Color inspiration', alt: 'Illustrative hair color reference', text: 'Soft dimension, luminous tones or a fresh shade. Your starting color, hair history and maintenance routine help guide the conversation.', message: 'Hi Ena! I am interested in hair color. Could you share your availability and pricing for a consultation?'},
        {...img('styling', 900, 600), title: 'Styling & finish', alt: 'Illustrative salon styling reference', text: 'Smooth movement, soft waves or a polished finish. Bring a reference for an everyday look or a special occasion.', message: 'Hi Ena! I would like to book a hairstyling appointment. Could you share your availability and pricing?'},
        {...img('barber', 900, 1350), title: 'Barber details', alt: 'Illustrative barber haircut reference', text: 'Clean lines, proportion and a tidy finish. Discuss your preferred length, shape and upkeep with Ena before your appointment.', message: 'Hi Ena! I am interested in a barber haircut. Could you share your availability and pricing?'},
      ],
      note: 'Illustrative photos. Ask Ena about available services, timing and pricing when booking.',
      more: 'Find your next look',
    },
    portfolio: {title: 'From Ena’s chair', visit: 'Visit Instagram', reel: n => `Watch reel ${n}`, prev: 'Previous video', next: 'Next video'},
    about: {play: 'Meet Ena · Play video', title: 'Meet Ena', text: 'Ena Ramirez is the hairstylist and barber behind Ena’s Beauty Salon in Katy, Texas. Explore her work on Instagram, or get in touch to talk about the look you have in mind.'},
    reviews: {eyebrow: 'GOOGLE REVIEWS', title: 'Kind words from the chair.', basedOn: n => `Based on ${n} Google review${n === 1 ? '' : 's'}`, readAll: 'Read all reviews on Google', write: 'Leave a review', fromGoogle: 'Review from Google'},
    rate: {eyebrow: 'YOUR OPINION', title: 'How was your visit?', text: 'Your feedback helps Ena keep every appointment special. Choose your stars, leave a comment and send it to Ena.', nav: 'Rate us'},
    faq: {
      eyebrow: 'GOOD TO KNOW',
      title: 'Before your visit.',
      items: [
        {q: 'How do I book an appointment?', a: 'Call or text 713-820-5793, or use the “Prepare your visit” button on any service to send Ena a WhatsApp message. She will confirm availability with you.'},
        {q: 'How much does a service cost?', a: 'Pricing depends on the service and on your hair. Ask Ena when booking and she will share current pricing before your appointment.'},
        {q: 'Do you offer barber cuts?', a: 'Yes. Ena works as a hairstylist and barber. Tell her the cut or look you want and she will confirm the details.'},
        {q: 'What should I bring?', a: 'A reference photo of the look you like is a great start. If you are thinking about color, share your hair history, especially previous color.'},
        {q: 'Where is the salon?', a: 'Ena’s Beauty Salon is at 21126 Terrace View Dr, Katy, TX 77449. Use “Get directions” to open Google Maps.'},
      ],
    },
    visit: {eyebrow: 'GET IN TOUCH', title: 'Let’s book your next visit.', text: 'Send a text', address: 'Address', hours: 'Opening hours', hoursValue: 'Call or text to confirm availability', pricing: 'Services & pricing', pricingValue: 'Ask Ena when booking', directions: 'Get directions'},
    footer: {tagline: 'A fresh look starts with a conversation.', book: 'Book an appointment', explore: 'EXPLORE', connect: 'LET’S CONNECT', top: 'Back to top', rights: 'All rights reserved.'},
    mobile: {call: 'Call', whatsapp: 'WhatsApp', directions: 'Directions', whatsappText: 'Hi Ena! I would like to book an appointment. Could you share your availability?'},
    video: {chair: 'From Ena’s chair', meet: 'Meet Ena', close: 'Close video', original: 'View original', label: 'Ena’s Beauty Salon video'},
  },
  es: {
    meta: {
      title: 'Ena’s Beauty Salon | Peluquería y Barbería en Katy, TX',
      description: 'Peluquería y barbería en Katy, Texas. Cortes, color, peinados y cortes de barbería con Ena Ramirez. Llama o escribe al 713-820-5793 para agendar tu cita.',
      ogAlt: 'Ena’s Beauty Salon — peluquería y barbería en Katy, Texas. Agenda tu cita: 713-820-5793.',
      locale: 'es_US',
    },
    nav: {home: 'Inicio', services: 'Servicios', work: 'Portafolio', about: 'Conoce a Ena', reviews: 'Reseñas', contact: 'Contacto', skip: 'Ir al contenido', menu: 'DESCUBRE ENA’S', open: 'Abrir menú', close: 'Cerrar menú', explore: 'Secciones', talk: 'Hablemos de tu look', switchTo: 'EN', switchLabel: 'View in English', main: 'Navegación principal'},
    hero: {kicker: 'Peluquería y barbería en Katy, Texas', eyebrow: 'PELUQUERÍA Y BARBERÍA · KATY, TX', copy: 'Conoce el trabajo de Ena e inspírate para tu próxima cita.', book: 'Agenda tu cita', services: 'Ver servicios'},
    services: {
      eyebrow: 'TU PRÓXIMO LOOK',
      title: 'Un poco de inspiración.',
      intro: 'Desde un cambio sutil hasta un nuevo estilo. Explora estas ideas y habla con Ena sobre tu cabello y el look que tienes en mente.',
      cta: 'Prepara tu visita',
      items: [
        {...img('cut', 900, 1350), title: 'Corte y forma', alt: 'Referencia ilustrativa de corte de cabello', text: 'El largo, las capas y la textura pueden transformar un corte. Empieza por la forma que te gusta y cómo prefieres llevarlo cada día.', message: 'Hola Ena, me gustaría agendar un corte de cabello. ¿Me compartes disponibilidad y precios?'},
        {...img('color', 900, 1200), title: 'Ideas de color', alt: 'Referencia ilustrativa de color de cabello', text: 'Dimensión sutil, tonos luminosos o un nuevo color. Tu tono actual, el historial de tu cabello y tu rutina ayudan a orientar la conversación.', message: 'Hola Ena, me interesa un servicio de color. ¿Me compartes disponibilidad y precios para una valoración?'},
        {...img('styling', 900, 600), title: 'Peinado y acabado', alt: 'Referencia ilustrativa de peinado', text: 'Movimiento natural, ondas suaves o un acabado pulido. Trae una referencia para un look de diario o una ocasión especial.', message: 'Hola Ena, me gustaría agendar un peinado. ¿Me compartes disponibilidad y precios?'},
        {...img('barber', 900, 1350), title: 'Detalles de barbería', alt: 'Referencia ilustrativa de corte de barbería', text: 'Líneas definidas, proporción y un acabado cuidado. Comenta con Ena el largo, la forma y el mantenimiento que prefieres antes de tu cita.', message: 'Hola Ena, me interesa un corte de barbería. ¿Me compartes disponibilidad y precios?'},
      ],
      note: 'Fotos ilustrativas. Consulta con Ena los servicios disponibles, la duración y los precios al agendar.',
      more: 'Encuentra tu próximo look',
    },
    portfolio: {title: 'Desde la silla de Ena', visit: 'Visita Instagram', reel: n => `Ver reel ${n}`, prev: 'Video anterior', next: 'Siguiente video'},
    about: {play: 'Conoce a Ena · Ver video', title: 'Conoce a Ena', text: 'Ena Ramirez es la estilista y barbera detrás de Ena’s Beauty Salon en Katy, Texas. Conoce sus trabajos en Instagram o escríbele para hablar del look que tienes en mente.'},
    reviews: {eyebrow: 'RESEÑAS DE GOOGLE', title: 'Lo que dicen nuestras clientas y clientes.', basedOn: n => `Según ${n} reseña${n === 1 ? '' : 's'} en Google`, readAll: 'Ver todas las reseñas en Google', write: 'Dejar una reseña', fromGoogle: 'Reseña de Google'},
    rate: {eyebrow: 'TU OPINIÓN', title: '¿Cómo fue tu visita?', text: 'Tu opinión ayuda a Ena a que cada cita sea especial. Elige tus estrellas, deja un comentario y envíaselo a Ena.', nav: 'Califícanos'},
    faq: {
      eyebrow: 'BUENO SABERLO',
      title: 'Antes de tu visita.',
      items: [
        {q: '¿Cómo agendo una cita?', a: 'Llama o envía un SMS al 713-820-5793, o usa el botón “Prepara tu visita” de cualquier servicio para escribirle a Ena por WhatsApp. Ella te confirmará la disponibilidad.'},
        {q: '¿Cuánto cuesta un servicio?', a: 'El precio depende del servicio y de tu cabello. Pregúntale a Ena al agendar y te compartirá los precios vigentes antes de tu cita.'},
        {q: '¿Hacen cortes de barbería?', a: 'Sí. Ena trabaja como estilista y barbera. Cuéntale el corte o el look que quieres y te confirmará los detalles.'},
        {q: '¿Qué debo llevar?', a: 'Una foto de referencia del look que te gusta es un gran comienzo. Si piensas en color, cuéntale el historial de tu cabello, sobre todo los tintes anteriores.'},
        {q: '¿Dónde está el salón?', a: 'Ena’s Beauty Salon está en 21126 Terrace View Dr, Katy, TX 77449. Usa “Cómo llegar” para abrir Google Maps.'},
      ],
    },
    visit: {eyebrow: 'CONTACTO', title: 'Agendemos tu próxima visita.', text: 'Enviar SMS', address: 'Dirección', hours: 'Horario', hoursValue: 'Llama o escribe para confirmar disponibilidad', pricing: 'Servicios y precios', pricingValue: 'Consulta con Ena al agendar', directions: 'Cómo llegar'},
    footer: {tagline: 'Un nuevo look empieza con una conversación.', book: 'Agenda tu cita', explore: 'EXPLORA', connect: 'HABLEMOS', top: 'Volver al inicio', rights: 'Todos los derechos reservados.'},
    mobile: {call: 'Llamar', whatsapp: 'WhatsApp', directions: 'Cómo llegar', whatsappText: 'Hola Ena, me gustaría agendar una cita. ¿Me compartes tu disponibilidad?'},
    video: {chair: 'Desde la silla de Ena', meet: 'Conoce a Ena', close: 'Cerrar video', original: 'Ver original', label: 'Video de Ena’s Beauty Salon'},
  },
};

export const reels = [
  {id: 'DZ22XwVxoMV', poster: 'reel-1.jpg', w: 360, h: 460},
  {id: 'DZvMYifp_4r', poster: 'reel-2.jpg', w: 360, h: 460},
  {id: 'DY7siB8oRlQ', poster: 'reel-3.jpg', w: 360, h: 460},
  {id: 'DXqB_0sjKpM', poster: 'reel-4-work.jpg', w: 720, h: 1280},
] as const;
export const tiktok = {id: '7680172820210404622', poster: 'tiktok-1.jpg', w: 720, h: 960} as const;

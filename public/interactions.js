const button = document.querySelector('.language');
const translations = document.querySelectorAll('[data-en][data-es]');
const menu = document.querySelector('.section-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const videoModal = document.querySelector('.video-modal');
const player = videoModal.querySelector('video');
const videoClose = document.querySelector('.video-close');
document.documentElement.classList.add('js');
const applyLanguage = language => {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  for (const element of translations) element.textContent = element.dataset[language];
  document.querySelectorAll('.service-whatsapp').forEach(link => {
    const message = language === 'es' ? link.dataset.messageEs : link.dataset.messageEn;
    link.href = `https://wa.me/17138205793?text=${encodeURIComponent(message)}`;
  });
  button.textContent = language === 'en' ? 'ES' : 'EN';
  button.setAttribute('aria-label', language === 'en' ? 'Ver en español' : 'View in English');
  document.querySelector('.skip').textContent = language === 'en' ? 'Skip to content' : 'Ir al contenido';
  document.querySelector('.masthead nav').setAttribute('aria-label', language === 'en' ? 'Main navigation' : 'Navegación principal');
  document.querySelector('.footer-nav').setAttribute('aria-label', language === 'en' ? 'Explore' : 'Explora');
  document.querySelector('.reel-prev').setAttribute('aria-label', language === 'en' ? 'Previous video' : 'Video anterior');
  document.querySelector('.reel-next').setAttribute('aria-label', language === 'en' ? 'Next video' : 'Siguiente video');
  menuToggle.setAttribute('aria-label', language === 'en' ? 'Open menu' : 'Abrir menú');
  menuClose.setAttribute('aria-label', language === 'en' ? 'Close menu' : 'Cerrar menú');
  menu.querySelector('nav').setAttribute('aria-label', language === 'en' ? 'Sections' : 'Secciones');
  videoClose.setAttribute('aria-label', language === 'en' ? 'Close video' : 'Cerrar video');
  player.setAttribute('aria-label', language === 'en' ? 'Ena’s Beauty Salon video' : 'Video de Ena’s Beauty Salon');
  document.querySelector('meta[name="description"]').content = language === 'en'
    ? 'Ena’s Beauty Salon · Hairstylist & Barber. Explore Ena’s work and call to book an appointment.'
    : 'Ena’s Beauty Salon · Peluquería y barbería. Conoce el trabajo de Ena y llama para agendar tu cita.';
};
button.addEventListener('click', () => {
  const language = document.documentElement.lang === 'en' ? 'es' : 'en';
  applyLanguage(language);
  try { localStorage.setItem('ena-language', language); } catch {}
});
try { if (localStorage.getItem('ena-language') === 'es') applyLanguage('es'); } catch {}

menuToggle.addEventListener('click', () => {
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  menuClose.focus();
});
menuClose.addEventListener('click', () => menu.close());
const trapDialogFocus = event => {
  if (event.key !== 'Tab') return;
  const controls = [...event.currentTarget.querySelectorAll('a[href], button:not([disabled]), video[controls]')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
menu.addEventListener('keydown', trapDialogFocus);
videoModal.addEventListener('keydown', trapDialogFocus);
menu.addEventListener('close', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
});
menu.addEventListener('click', event => {
  if (event.target !== menu) return;
  const rect = menu.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) menu.close();
});
menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  menu.close();
  const section = document.querySelector(link.hash);
  section.setAttribute('tabindex', '-1');
  section.focus({preventScroll: true});
}));
matchMedia('(min-width: 900px)').addEventListener('change', event => {
  if (event.matches && menu.open) menu.close();
});

document.querySelectorAll('[data-video]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    player.poster = link.querySelector('img').src;
    player.src = link.dataset.video;
    const title = videoModal.querySelector('h2');
    title.dataset.en = link.closest('#about') ? 'Meet Ena' : 'From Ena’s chair';
    title.dataset.es = link.closest('#about') ? 'Conoce a Ena' : 'Desde la silla de Ena';
    title.textContent = title.dataset[document.documentElement.lang];
    videoModal.querySelector('.video-original').href = link.href;
    videoModal.showModal();
    document.body.classList.add('player-open');
    videoClose.focus();
    // Explicit user activation only; never download clips during initial page load.
    player.play().catch(() => {});
  });
});
videoClose.addEventListener('click', () => videoModal.close());
videoModal.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  document.body.classList.remove('player-open');
});
videoModal.addEventListener('click', event => {
  if (event.target !== videoModal) return;
  const rect = videoModal.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) videoModal.close();
});
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let observer;
const configureMotion = () => {
  observer?.disconnect();
  document.documentElement.classList.remove('motion-ready');
  if (!('IntersectionObserver' in window) || motionPreference.matches) return;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('.reveal:not(.enter)').forEach(element => observer.observe(element));
};
configureMotion();
motionPreference.addEventListener('change', configureMotion);

// A short visual welcome, bounded even when images or fonts cannot load.
const heroImage = new Image();
heroImage.src = 'assets/hero.webp';
Promise.all([
  new Promise(resolve => setTimeout(resolve, motionPreference.matches ? 100 : 700)),
  Promise.race([
    Promise.allSettled([heroImage.decode(), document.fonts.ready]),
    new Promise(resolve => setTimeout(resolve, 1800)),
  ]),
]).finally(() => document.documentElement.classList.remove('is-loading'));

const reelStrip = document.querySelector('.reels');
const reelCards = [...reelStrip.querySelectorAll('.reel')];
const previous = document.querySelector('.reel-prev');
const next = document.querySelector('.reel-next');
const updateReelControls = () => {
  const index = reelCards.reduce((nearest, card, candidate) =>
    Math.abs(card.offsetLeft - reelCards[0].offsetLeft - reelStrip.scrollLeft) <
    Math.abs(reelCards[nearest].offsetLeft - reelCards[0].offsetLeft - reelStrip.scrollLeft) ? candidate : nearest, 0);
  document.querySelector('.reel-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(reelCards.length).padStart(2, '0')}`;
  previous.disabled = reelStrip.scrollLeft <= 1;
  next.disabled = reelStrip.scrollLeft + reelStrip.clientWidth >= reelStrip.scrollWidth - 1;
};
const moveReels = direction => reelStrip.scrollBy({left: direction * reelStrip.clientWidth * .75, behavior: motionPreference.matches ? 'instant' : 'smooth'});
previous.addEventListener('click', () => moveReels(-1));
next.addEventListener('click', () => moveReels(1));
reelStrip.addEventListener('scroll', updateReelControls, {passive:true});
window.addEventListener('resize', updateReelControls);
updateReelControls();

let scrollScheduled = false;
const updateReadingProgress = () => {
  const available = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--reading-progress', available > 0 ? String(scrollY / available) : '0');
  scrollScheduled = false;
};
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {scrollScheduled = true; requestAnimationFrame(updateReadingProgress);}
}, {passive:true});
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

// Keep the header useful as readers move through the page, without a scroll loop.
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.masthead nav a, .section-menu nav a')];
  const navigation = new IntersectionObserver(entries => {
    for (const entry of entries) {
      links.filter(item => item.hash === `#${entry.target.id}`).forEach(link => {
        if (entry.isIntersecting) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-18% 0px -35% 0px' });
  document.querySelectorAll('#top, #services, #work, #about, #visit').forEach(section => navigation.observe(section));
}

import Image from 'next/image';
import {notFound} from 'next/navigation';
import {Header} from '@/components/Header';
import {JsonLd} from '@/components/JsonLd';
import {Motion} from '@/components/Motion';
import {RateService} from '@/components/RateService';
import {Reviews} from '@/components/Reviews';
import {ReelControls, VideoPlayer} from '@/components/VideoPlayer';
import {getPlaceReviews} from '@/lib/google-reviews';
import {dictionaries, isLang, reels, tiktok} from '@/lib/i18n';
import {fullAddress, site, whatsappUrl} from '@/lib/site';

// Static HTML, re-generated in the background so Google reviews stay fresh (ISR).
export const revalidate = 43200;

export default async function Home({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params;
  if (!isLang(lang)) notFound();
  const d = dictionaries[lang];
  const reviews = await getPlaceReviews(`${site.name}, ${fullAddress}`, lang);
  const hasReviews = Boolean(reviews && reviews.reviews.length > 0);
  const tel = `tel:${site.phoneE164}`;

  return (
    <>
      <JsonLd lang={lang} />
      <Motion selector=".section-head, .services-intro, .service-card, .reel, .about > *, .appointment-grid > *, .faq-list details, .review-card" />
      <a className="skip" href="#main">{d.nav.skip}</a>
      <Header lang={lang} hasReviews={hasReviews} />

      <main id="main">
        <section className="hero" id="top" aria-labelledby="heading">
          <Image className="hero-bg" src="/images/hero.webp" alt="" fill priority fetchPriority="high" sizes="100vw" />
          <div className="hero-inner">
            <h1 id="heading">
              <span className="eyebrow h1-kicker">{d.hero.eyebrow}</span>
              <span>Ena’s</span><em>Beauty Salon</em>
            </h1>
            <p className="hero-copy">{d.hero.copy}</p>
            <div className="hero-actions">
              <a className="pill light" href={tel}>{d.hero.book}</a>
              <a className="pill hero-secondary" href="#services">{d.hero.services}</a>
            </div>
          </div>
          <svg className="ribbon" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 92C430 128 897-57 1440 55v55H0Z" /></svg>
        </section>

        <section className="services wrap" id="services" aria-labelledby="services-heading">
          <div className="section-head"><div><p className="eyebrow">{d.services.eyebrow}</p><h2 id="services-heading">{d.services.title}</h2></div></div>
          <p className="services-intro">{d.services.intro}</p>
          <div className="service-grid">
            {d.services.items.map((item, index) => (
              <article className="service-card" key={item.image}>
                <Image className="service-photo" src={`/images/services/${item.image}.jpg`} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                <span className="service-number" aria-hidden="true">0{index + 1} /</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a className="service-whatsapp" href={whatsappUrl(item.message)} target="_blank" rel="noopener noreferrer">{d.services.cta}</a>
              </article>
            ))}
          </div>
          <div className="services-footer"><p>{d.services.note}</p><a className="text-link" href="#visit">{d.services.more}</a></div>
        </section>

        <section className="portfolio wrap" id="work" aria-labelledby="work-heading">
          <div className="section-head">
            <div><p className="eyebrow">INSTAGRAM / @ENARAMIRES62</p><h2 id="work-heading">{d.portfolio.title}</h2></div>
            <div className="social-links">
              <a className="text-link" href={site.social.instagram} target="_blank" rel="noopener noreferrer">{d.portfolio.visit}</a>
              <a className="text-link" href={site.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
          <div className="reels-viewport">
          <div className="reels">
            {reels.map((reel, index) => (
              <a className="reel" key={reel.id} data-video={`/videos/${reel.id}.mp4`} href={`https://www.instagram.com/enaramires62/reel/${reel.id}/`} target="_blank" rel="noopener noreferrer">
                <Image src={`/images/${reel.poster}`} alt="" width={reel.w} height={reel.h} sizes="(max-width: 660px) 68vw, (max-width: 1100px) 50vw, 25vw" />
                <span className="reel-label"><span>{d.portfolio.reel(index + 1)}</span><span aria-hidden="true">▶</span></span>
              </a>
            ))}
          </div>
          </div>
          <ReelControls lang={lang} count={reels.length} />
        </section>

        <section className="about wrap" id="about" aria-labelledby="about-heading">
          <a className="about-film" data-video={`/videos/${tiktok.id}.mp4`} href={`https://www.tiktok.com/@enasbeautysalon/video/${tiktok.id}`} target="_blank" rel="noopener noreferrer">
            <Image src={`/images/${tiktok.poster}`} alt="" width={tiktok.w} height={tiktok.h} sizes="(max-width: 700px) 100vw, 390px" />
            <span className="reel-label"><span>{d.about.play}</span><span aria-hidden="true">▶</span></span>
          </a>
          <div>
            <p className="eyebrow">ENA’S BEAUTY SALON</p>
            <h2 id="about-heading">{d.about.title}</h2>
            <p>{d.about.text}</p>
            <a className="text-link" href={site.social.instagram} target="_blank" rel="noopener noreferrer">@enaramires62</a>
          </div>
        </section>

        {hasReviews && reviews && <Reviews lang={lang} data={reviews} />}

        <section className="rate wrap" id="opinion" aria-labelledby="rate-heading">
          <div>
            <p className="eyebrow">{d.rate.eyebrow}</p>
            <h2 id="rate-heading">{d.rate.title}</h2>
            <p>{d.rate.text}</p>
          </div>
          <RateService lang={lang} business={site.name} whatsapp={site.whatsapp} googleUrl={site.googleWriteReview} />
        </section>

        <section className="faq wrap" id="faq" aria-labelledby="faq-heading">
          <div className="section-head"><div><p className="eyebrow">{d.faq.eyebrow}</p><h2 id="faq-heading">{d.faq.title}</h2></div></div>
          <div className="faq-list">
            {d.faq.items.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary><h3>{item.q}</h3></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" id="visit" aria-labelledby="visit-heading">
          <div className="wrap appointment-grid">
            <div>
              <p className="eyebrow">{d.visit.eyebrow}</p>
              <h2 id="visit-heading">{d.visit.title}</h2>
              <div className="contact-actions">
                <a className="pill light" href={tel}>{site.phoneDisplay}</a>
                <a className="pill outline" href={`sms:${site.phoneE164}`}>{d.visit.text}</a>
                <a className="pill outline" href={whatsappUrl(d.mobile.whatsappText)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
              <a className="email" href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="visit-detail">
              <dl>
                <div><dt>{d.visit.address}</dt><dd className="address-value"><address>{fullAddress}</address></dd></div>
                <div><dt>{d.visit.hours}</dt><dd className="address-value">{d.visit.hoursValue}</dd></div>
                <div><dt>{d.visit.pricing}</dt><dd className="address-value">{d.visit.pricingValue}</dd></div>
                <div><dt>Google Maps</dt><dd><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">{d.visit.directions}</a></dd></div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-main">
          <div className="footer-brand">
            <a href="#top" className="footer-wordmark"><Image className="brand-logo" src="/images/logo-horizontal.png" alt={site.name} width={2172} height={724} sizes="290px" /></a>
            <p>{d.footer.tagline}</p>
            <a className="footer-book" href={tel}>{d.footer.book}</a>
          </div>
          <nav className="footer-nav" aria-label={d.footer.explore}>
            <p className="eyebrow">{d.footer.explore}</p>
            <a href="#services">{d.nav.services}</a>
            <a href="#work">{d.nav.work}</a>
            <a href="#about">{d.nav.about}</a>
            <a href="#opinion">{d.rate.nav}</a>
            <a href="#visit">{d.nav.contact}</a>
          </nav>
          <div className="footer-contact">
            <p className="eyebrow">{d.footer.connect}</p>
            <a href={tel}>{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a className="footer-address" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">{fullAddress}</a>
            <div className="social-links">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
        </div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {site.name}. {d.footer.rights}</span><a href="#top">{d.footer.top}</a></div>
      </footer>

      <nav className="mobile-actions" aria-label={lang === 'en' ? 'Quick contact' : 'Contacto rápido'}>
        <a href={tel}>{d.mobile.call}</a>
        <a href={whatsappUrl(d.mobile.whatsappText)} target="_blank" rel="noopener noreferrer">{d.mobile.whatsapp}</a>
        <a className="primary" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">{d.mobile.directions}</a>
      </nav>
      <VideoPlayer lang={lang} />
    </>
  );
}

import Image from 'next/image';
import {dictionaries, type Lang} from '@/lib/i18n';
import type {PlaceReviews} from '@/lib/google-reviews';

function Stars({value}: {value: number}) {
  const rounded = Math.round(value);
  return (
    <span className="stars" role="img" aria-label={`${value.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= rounded ? 'on' : undefined} aria-hidden="true">★</span>)}
    </span>
  );
}

/** Google reviews (social proof). Rendered only when a verified profile is configured. */
export function Reviews({lang, data}: {lang: Lang; data: PlaceReviews}) {
  const t = dictionaries[lang].reviews;
  return (
    <section id="reviews" className="reviews wrap" aria-labelledby="reviews-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="reviews-heading">{t.title}</h2>
        </div>
        {data.rating ? (
          <div className="rating-summary">
            <strong>{data.rating.toFixed(1)}</strong>
            <div><Stars value={data.rating} /><p>{t.basedOn(data.total ?? data.reviews.length)}</p></div>
          </div>
        ) : null}
      </div>
      <ul className="review-grid">
        {data.reviews.map((review, index) => (
          <li className="review-card" key={`${review.author}-${index}`}>
            <Stars value={review.rating} />
            <blockquote><p>{review.text}</p></blockquote>
            <footer>
              {review.photo && <Image src={review.photo} alt="" width={40} height={40} />}
              <span>
                {review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer nofollow">{review.author}</a> : review.author}
                <small>{review.relativeTime} · {t.fromGoogle}</small>
              </span>
            </footer>
          </li>
        ))}
      </ul>
      <div className="review-actions">
        <a className="pill wine" href={data.writeReviewUrl} target="_blank" rel="noopener noreferrer">{t.write}</a>
        {data.mapsUrl && <a className="text-link" href={data.mapsUrl} target="_blank" rel="noopener noreferrer">{t.readAll}</a>}
        <span className="google-attribution">Google</span>
      </div>
    </section>
  );
}

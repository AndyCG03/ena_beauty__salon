'use client';

import {useEffect, useRef, useState} from 'react';
import {dictionaries, type Lang} from '@/lib/i18n';

/**
 * One modal player for every `a[data-video]` on the page (event delegation).
 * Links work without JavaScript (they open the original post). Clips are only
 * downloaded after an explicit click, never during page load.
 */
export function VideoPlayer({lang}: {lang: Lang}) {
  const t = dictionaries[lang].video;
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [state, setState] = useState({title: t.chair, original: ''});

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-video]');
      if (!link || !dialog.current?.showModal || !video.current) return;
      event.preventDefault();
      opener.current = link;
      setState({title: link.closest('#about') ? t.meet : t.chair, original: link.href});
      video.current.poster = link.querySelector('img')?.currentSrc ?? '';
      video.current.src = link.dataset.video ?? '';
      dialog.current.showModal();
      document.body.classList.add('player-open');
      video.current.play().catch(() => {});
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [t.chair, t.meet]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onClose = () => {
      video.current?.pause();
      video.current?.removeAttribute('src');
      video.current?.load();
      document.body.classList.remove('player-open');
      opener.current?.focus();
    };
    const onBackdrop = (event: MouseEvent) => event.target === element && element.close();
    element.addEventListener('close', onClose);
    element.addEventListener('click', onBackdrop);
    return () => {
      element.removeEventListener('close', onClose);
      element.removeEventListener('click', onBackdrop);
    };
  }, []);

  return (
    <dialog ref={dialog} className="video-modal" aria-labelledby="video-title">
      <div className="video-top">
        <h2 id="video-title">{state.title}</h2>
        <button className="video-close" type="button" aria-label={t.close} onClick={() => dialog.current?.close()}>×</button>
      </div>
      <video ref={video} controls playsInline preload="none" aria-label={t.label} />
      <a className="video-original" href={state.original || '#'} target="_blank" rel="noopener noreferrer">{t.original}</a>
    </dialog>
  );
}

/** Prev/next controls for the swipeable reel strip on phones. */
export function ReelControls({lang, count}: {lang: Lang; count: number}) {
  const t = dictionaries[lang].portfolio;
  const [position, setPosition] = useState({index: 0, start: true, end: false});

  useEffect(() => {
    const strip = document.querySelector<HTMLElement>('.reels');
    if (!strip) return;
    const update = () => {
      const cards = [...strip.children] as HTMLElement[];
      const origin = cards[0]?.offsetLeft ?? 0;
      const index = cards.reduce((best, card, i) =>
        Math.abs(card.offsetLeft - origin - strip.scrollLeft) < Math.abs(cards[best].offsetLeft - origin - strip.scrollLeft) ? i : best, 0);
      setPosition({index, start: strip.scrollLeft <= 1, end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1});
    };
    strip.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    update();
    return () => {
      strip.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const move = (direction: number) => {
    const strip = document.querySelector<HTMLElement>('.reels');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    strip?.scrollBy({left: direction * strip.clientWidth * 0.75, behavior: reduce ? 'instant' : 'smooth'});
  };

  return (
    <div className="portfolio-controls">
      <p className="reel-position" aria-live="polite">{String(position.index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
      <div>
        <button type="button" aria-label={t.prev} disabled={position.start} onClick={() => move(-1)}>‹</button>
        <button type="button" aria-label={t.next} disabled={position.end} onClick={() => move(1)}>›</button>
      </div>
    </div>
  );
}

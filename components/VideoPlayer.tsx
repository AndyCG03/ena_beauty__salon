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

/**
 * Phone carousel for the reels. The strip moves with a CSS transform instead of a scroll
 * container, and only listens to clear horizontal swipes (`touch-action: pan-y`): vertical
 * gestures over the videos always scroll the page. A swipe never opens a video by accident.
 * On wider screens the reels are a static grid and these controls are hidden by CSS.
 */
export function ReelControls({lang, count}: {lang: Lang; count: number}) {
  const t = dictionaries[lang].portfolio;
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(count - 1);
  const indexRef = useRef(0);
  const maxRef = useRef(count - 1);
  indexRef.current = index;
  maxRef.current = maxIndex;

  // Position the strip for the current index.
  useEffect(() => {
    const viewport = document.querySelector<HTMLElement>('.reels-viewport');
    const strip = viewport?.querySelector<HTMLElement>('.reels');
    if (!viewport || !strip) return;
    const place = () => {
      const phone = window.matchMedia('(max-width: 660px)').matches;
      const cards = [...strip.children] as HTMLElement[];
      if (!phone || !cards.length) {
        strip.style.removeProperty('--reel-shift');
        return;
      }
      const limit = Math.max(0, strip.scrollWidth - viewport.clientWidth);
      // Last index at which a further move still changes what is visible.
      const last = cards.findIndex(card => card.offsetLeft - cards[0].offsetLeft >= limit);
      setMaxIndex(last === -1 ? cards.length - 1 : last);
      const shift = Math.min(limit, cards[Math.min(index, cards.length - 1)].offsetLeft - cards[0].offsetLeft);
      strip.style.setProperty('--reel-shift', `${-shift}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [index]);

  // Swipe handling and keyboard focus.
  useEffect(() => {
    const viewport = document.querySelector<HTMLElement>('.reels-viewport');
    const strip = viewport?.querySelector<HTMLElement>('.reels');
    if (!viewport || !strip) return;
    let startX = 0, startY = 0, tracking = false, swiped = false;
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      tracking = true; swiped = false; startX = event.clientX; startY = event.clientY;
    };
    const move = (event: PointerEvent) => {
      if (!tracking) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - startY)) strip.style.setProperty('--reel-drag', `${dx * 0.6}px`);
    };
    const up = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      strip.style.removeProperty('--reel-drag');
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swiped = true;
        setIndex(i => Math.max(0, Math.min(maxRef.current, i + (dx < 0 ? 1 : -1))));
      }
    };
    const cancel = () => { tracking = false; strip.style.removeProperty('--reel-drag'); };
    // Capture phase: a swipe must not open the video player or follow the link.
    const click = (event: MouseEvent) => {
      if (!swiped) return;
      event.preventDefault();
      event.stopPropagation();
      swiped = false;
    };
    const focus = (event: FocusEvent) => {
      const card = (event.target as HTMLElement).closest('.reel');
      const i = card ? [...strip.children].indexOf(card) : -1;
      if (i >= 0 && i !== indexRef.current) setIndex(i);
    };
    viewport.addEventListener('pointerdown', down);
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerup', up);
    viewport.addEventListener('pointercancel', cancel);
    viewport.addEventListener('click', click, true);
    strip.addEventListener('focusin', focus);
    return () => {
      viewport.removeEventListener('pointerdown', down);
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', up);
      viewport.removeEventListener('pointercancel', cancel);
      viewport.removeEventListener('click', click, true);
      strip.removeEventListener('focusin', focus);
    };
  }, [count]);

  const go = (delta: number) => setIndex(i => Math.max(0, Math.min(maxIndex, i + delta)));
  const shown = Math.min(index, maxIndex);

  return (
    <div className="portfolio-controls">
      <p className="reel-position" aria-live="polite">{String(shown >= maxIndex ? count : shown + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
      <div>
        <button type="button" aria-label={t.prev} disabled={shown <= 0} onClick={() => go(-1)}>‹</button>
        <button type="button" aria-label={t.next} disabled={shown >= maxIndex} onClick={() => go(1)}>›</button>
      </div>
    </div>
  );
}

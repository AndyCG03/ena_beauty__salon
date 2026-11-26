'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {dictionaries, pathFor, type Lang} from '@/lib/i18n';
import {site} from '@/lib/site';


/** Sticky masthead with desktop nav and a native <dialog> drawer on smaller screens. */
export function Header({lang, hasReviews}: {lang: Lang; hasReviews: boolean}) {
  const t = dictionaries[lang].nav;
  const other: Lang = lang === 'en' ? 'es' : 'en';
  const drawer = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const links = [
    {id: 'top', label: t.home},
    {id: 'services', label: t.services},
    {id: 'work', label: t.work},
    {id: 'about', label: t.about},
    ...(hasReviews ? [{id: 'reviews', label: t.reviews}] : []),
    {id: 'visit', label: t.contact},
  ];

  useEffect(() => {
    const element = drawer.current;
    if (!element) return;
    const onClose = () => {
      setOpen(false);
      document.body.classList.remove('drawer-open');
      toggle.current?.focus();
    };
    const onClick = (event: MouseEvent) => event.target === element && element.close();
    element.addEventListener('close', onClose);
    element.addEventListener('click', onClick);
    const wide = window.matchMedia('(min-width: 900px)');
    const onWide = (event: MediaQueryListEvent) => event.matches && element.open && element.close();
    wide.addEventListener('change', onWide);
    return () => {
      element.removeEventListener('close', onClose);
      element.removeEventListener('click', onClick);
      wide.removeEventListener('change', onWide);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id));
    }, {rootMargin: '-18% 0px -60% 0px'});
    links.forEach(link => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [hasReviews]);

  const openDrawer = () => {
    drawer.current?.showModal();
    setOpen(true);
    document.body.classList.add('drawer-open');
  };

  return (
    <>
      <header className="masthead">
        <Link className="identity" href={pathFor(lang)} aria-label={`${site.name} — ${t.home}`}>
          <Image className="brand-logo" src="/images/logo-horizontal.png" alt={site.name} width={2172} height={724} sizes="174px" priority />
        </Link>
        <nav className="desktop-nav" aria-label={t.main}>
          {links.filter(link => link.id !== 'top').map(link => (
            <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="language" href={pathFor(other)} hrefLang={other} lang={other} aria-label={t.switchLabel}>{t.switchTo}</Link>
          <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="section-menu" aria-label={t.open} onClick={openDrawer}>
            <span /><span />
          </button>
        </div>
      </header>
      <dialog ref={drawer} className="section-menu" id="section-menu" aria-labelledby="menu-title">
        <div className="drawer-top">
          <p id="menu-title" className="eyebrow">{t.menu}</p>
          <button className="menu-close" type="button" aria-label={t.close} onClick={() => drawer.current?.close()}>×</button>
        </div>
        <nav aria-label={t.explore}>
          {links.map((link, index) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => drawer.current?.close()} aria-current={active === link.id ? 'location' : undefined}>
              <span className="menu-number" aria-hidden="true">0{index + 1}</span><span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="drawer-bottom">
          <p>{site.name}</p>
          <a className="pill wine" href={`tel:${site.phoneE164}`}>{t.talk}</a>
          <div className="social-links">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </dialog>
    </>
  );
}

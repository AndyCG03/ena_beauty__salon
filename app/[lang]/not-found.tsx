import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found wrap">
      <p className="eyebrow">404</p>
      <h1>Page not found<br /><em>Página no encontrada</em></h1>
      <p><Link className="pill wine" href="/">Ena’s Beauty Salon</Link></p>
    </main>
  );
}

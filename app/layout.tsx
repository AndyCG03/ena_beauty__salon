import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
export const metadata: Metadata = {title:'Ena’s Beauty Salon | Hairstylist & Barber',description:'Ena’s Beauty Salon in Katy, Texas. Haircuts, color inspiration and appointments.',icons:{icon:'/assets/logo-vertical.png'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" data-language="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:'document.documentElement.classList.add("is-loading");setTimeout(()=>document.documentElement.classList.remove("is-loading"),2800);'}} /><link rel="preload" href="/assets/hero.webp" as="image" /></head><body>{children}<Script src="/interactions.js" strategy="afterInteractive" /></body></html>}

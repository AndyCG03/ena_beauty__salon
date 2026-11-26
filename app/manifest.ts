import type {MetadataRoute} from 'next';
import {site} from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'Ena’s Beauty',
    description: 'Hairstylist & barber in Katy, Texas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff7ef',
    theme_color: '#790c32',
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png'},
    ],
  };
}

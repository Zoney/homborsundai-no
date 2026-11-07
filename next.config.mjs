// homborsundai.no runs on our own app server at Hetzner behind Caddy (from November 2026;
// before that on Vercel). Built as "standalone" (one node process, see husken/workshop/apper/).
// The app has no outbound network: everything the page needs is served from here.

const CSP = [
  "default-src 'self'",
  // Static Next.js pages need inline scripts (no nonce without per-request rendering)
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "connect-src 'self'",
  // QR codes are data: URLs; the door scanner draws the camera picture to blob:/canvas
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "media-src 'self' blob:",
  // The venue map, only after a click ("Show the map")
  "frame-src https://www.openstreetmap.org",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

// The camera is only for the admins' door scanner (/admin/verify), on our own address.
// Caddy sets a stricter Permissions-Policy only when the app has not set its own.
const TILLATELSER = 'camera=(self), microphone=(), geolocation=(), interest-cohort=()';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // The release folder is read-only on the app server: keep the ISR cache in memory
  experimental: { isrFlushToDisk: false },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: CSP },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: TILLATELSER },
      ],
    },
    {
      // The ticket token is in the address: never send it on as a referrer.
      source: '/ticket/:path*',
      headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Cache-Control', value: 'private, no-store' },
      ],
    },
  ],
};

export default nextConfig;

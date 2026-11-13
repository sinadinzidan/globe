import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const API_PREFIX = '/api';
const DEVELOPMENT_API_ORIGIN = 'http://localhost:3000';
const BUILD_COMMAND = 'build';
const HEAD_TAG = 'head-prepend';

/**
 * What the built application may load: only its own files and its own API. Inline styles are
 * allowed because React sets `style` attributes; scripts are not. Frame embedding has to be
 * refused by a response header where the application is hosted, since a meta tag cannot do it.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/** Adds the policy to the built page. The development server needs inline scripts, so it is left out there. */
const contentSecurityPolicy = (): Plugin => ({
  name: 'content-security-policy',
  apply: BUILD_COMMAND,
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
      injectTo: HEAD_TAG,
    },
  ],
});

// The API is served from the same origin as the pages, so its cookies are first-party.
const apiProxy = { [API_PREFIX]: DEVELOPMENT_API_ORIGIN };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
});

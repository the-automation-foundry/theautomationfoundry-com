// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

const isKeystatic = !!process.env.KEYSTATIC;

const integrations = [react(), markdoc()];

if (isKeystatic) {
  const keystatic = (await import('@keystatic/astro')).default;
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://theautomationfoundry.com',
  output: 'static',
  adapter: isKeystatic
    ? (await import('@astrojs/netlify')).default()
    : undefined,
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
});

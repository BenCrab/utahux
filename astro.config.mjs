import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Public project ID / public dataset — not secrets (the ID appears in every
// cdn.sanity.io asset URL), so safe to default here for CI builds.
const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '71kxkqkh';
const dataset = env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  site: 'https://www.utahux.com',
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: '2026-07-01',
      studioBasePath: '/studio',
    }),
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/proposals/') && !page.includes('/studio'),
    }),
  ],
});

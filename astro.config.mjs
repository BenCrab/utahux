import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'placeholder';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';

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

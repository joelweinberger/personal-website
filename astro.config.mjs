import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.joelweinberger.us',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: 'assets'
  }
});

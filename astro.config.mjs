import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.joelweinberger.us',
  output: 'static',
  build: {
    assets: 'assets'
  }
});

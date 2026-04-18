import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joelweinberger.us',
  output: 'static',
  build: {
    assets: 'assets'
  }
});

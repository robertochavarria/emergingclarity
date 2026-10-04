import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://emergingclarity.com',
  output: 'static',
  build: { format: 'directory' },
  integrations: [sitemap({
    filter: (page) => !page.endsWith('/essence/') && !page.endsWith('/404/'),
  })],
});

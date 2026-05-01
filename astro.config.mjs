import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // 1. Thêm dòng này để kích hoạt lai giữa tĩnh (tốc độ cao) và động (gọi AI)
  output: 'hybrid',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    // Note to self: Phải nạp đúng thứ tự: Math trước, Katex sau
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  integrations: [sitemap()],
  adapter: vercel(),
});
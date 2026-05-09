import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import remarkWikiLink from 'remark-wiki-link';

export default defineConfig({
  env: {
    schema: {
      GEMINI_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      remarkMath,
      [remarkWikiLink, { 
        pathFormat: 'obsidian-short',
        hrefTemplate: (permalink) => `/knowledge/${permalink.toLowerCase().replace(/ /g, '-')}`
      }]
    ],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    sitemap(),
    react()
  ],
  adapter: vercel(),
});
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import remarkWikiLink from 'remark-wiki-link';

import { visit } from 'unist-util-visit';

// Plugin xử lý ![[image.png]] của Obsidian
function remarkObsidianImages() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /!\[\[(.*?)\]\]/g;
      let match;
      if (regex.test(node.value)) {
        // Đây là một ví dụ đơn giản, trong thực tế cần xử lý phức tạp hơn để tạo node image
        node.value = node.value.replace(regex, (match, p1) => `![${p1}](/images/${p1})`);
      }
    });
  };
}

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
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
    remarkPlugins: [
      remarkMath,
      remarkObsidianImages,
      [remarkWikiLink, { 
        pathFormat: 'obsidian-short',
        hrefTemplate: (permalink) => `/blog/${permalink.toLowerCase().replace(/ /g, '-')}`
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
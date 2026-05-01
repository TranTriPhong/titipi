import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite"; // Nhập plugin mới
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()], // Nạp Tailwind qua Vite
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
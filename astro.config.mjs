import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Note to self: Phải nạp đúng thứ tự: Math trước, Katex sau
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
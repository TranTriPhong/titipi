// scripts/pre-process.mjs
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIRS = [
  'src/content/knowledge',
  'src/content/projects',
  'src/content/students',
  'src/content/blog'
];

async function processFiles() {
  for (const dir of CONTENT_DIRS) {
    const absoluteDir = path.resolve(process.cwd(), dir);
    try {
      const files = await fs.readdir(absoluteDir);
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(absoluteDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { data, content: body } = matter(content);
        
        let modified = false;

        // 1. Tự động lấy Title từ tên file nếu thiếu
        if (!data.title) {
          data.title = path.basename(file, '.md').replace(/-/g, ' ');
          modified = true;
        }

        // 2. Tự động lấy ngày hiện tại nếu thiếu
        if (!data.pubDate && !data.publishDate && !data.date) {
          const now = new Date().toISOString().split('T')[0];
          if (dir.includes('blog')) {
            data.pubDate = now;
          } else {
            data.publishDate = now;
          }
          modified = true;
        }

        // 3. Bóc tách Hashtag từ nội dung (#tag-name)
        // Regex này tìm các thẻ hashtag không nằm trong code block hoặc link
        const tagRegex = /(?<=^|\s)#([\w\u00C0-\u1EF9-]+)/g;
        const matches = body.match(tagRegex) || [];
        const foundTags = matches.map(t => t.replace('#', ''));
        
        if (foundTags.length > 0) {
          const currentTags = new Set(data.tags || data.techStack || []);
          const originalSize = currentTags.size;
          foundTags.forEach(t => currentTags.add(t));
          
          if (currentTags.size > originalSize) {
            data.tags = Array.from(currentTags);
            modified = true;
          }
        }

        if (modified) {
          const newContent = matter.stringify(body, data);
          await fs.writeFile(filePath, newContent);
          console.log(`[AUTOMATED] Optimized ${file} in ${dir}`);
        }
      }
    } catch (e) {
      // Bỏ qua nếu thư mục không tồn tại
    }
  }
}

processFiles().then(() => console.log('Digital Garden optimization complete.'));

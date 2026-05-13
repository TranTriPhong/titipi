import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';

interface Post {
  id: string;
  data: {
    title: string;
    tags: string[];
    pubDate?: Date;
    publishDate?: Date;
    description?: string;
  };
}

interface SearchProps {
  allPosts: Post[];
}

const Search: React.FC<SearchProps> = ({ allPosts }) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => {
      post.data.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allPosts]);

  const fuse = useMemo(() => new Fuse(allPosts, {
    keys: ['data.title', 'data.tags', 'data.description'],
    threshold: 0.3,
    includeMatches: true,
  }), [allPosts]);

  const filteredPosts = useMemo(() => {
    let results = query 
      ? fuse.search(query).map(r => r.item)
      : allPosts;

    if (selectedTag) {
      results = results.filter(post => post.data.tags?.includes(selectedTag));
    }

    return results.slice(0, 10);
  }, [query, selectedTag, allPosts, fuse]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-zinc-500/20 text-zinc-100 rounded px-0.5 border-b border-zinc-500/50">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Search Input Area */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm kiến thức... (Ctrl + K)"
          className="w-full bg-transparent border-b border-zinc-200 dark:border-white/10 py-4 pl-8 pr-4 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all placeholder:text-zinc-400"
        />
        <div className="absolute right-0 inset-y-0 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-medium text-zinc-400 border border-zinc-200 dark:border-white/10 rounded">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Tag Cloud - Fully Transparent */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${!selectedTag ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
        >
          Tất cả
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${tag === selectedTag ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <a
              key={post.id}
              href={`/knowledge/${post.id}`}
              className="group p-6 bg-zinc-900/20 border border-white/5 rounded-2xl hover:border-zinc-500/30 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                  {highlightText(post.data.title, query)}
                </h3>
                <time className="text-[10px] font-mono text-zinc-600 whitespace-nowrap ml-4">
                  {new Date(post.data.pubDate || post.data.publishDate || '').toLocaleDateString('vi-VN')}
                </time>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                {post.data.description ? highlightText(post.data.description, query) : 'Không có mô tả cho bài viết này...'}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.data.tags?.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-950/20 rounded-3xl border border-dashed border-white/5">
            <p className="text-zinc-600 text-sm font-medium">Không tìm thấy kết quả phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

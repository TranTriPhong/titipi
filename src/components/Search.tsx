import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';

interface Post {
  id: string;
  data: {
    title: string;
    tags: string[];
    publishDate: Date;
    description?: string;
  };
  filePath?: string;
}

interface SearchProps {
  allPosts: Post[];
}

const Search: React.FC<SearchProps> = ({ allPosts }) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // Can be toggled if needed
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

    return results.slice(0, 10); // Limit to top 10 for performance
  }, [query, selectedTag, allPosts, fuse]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-sm px-0.5">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm bài viết... (Ctrl + K)"
          className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm"
        />
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${!selectedTag ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
        >
          Tất cả
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${tag === selectedTag ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <a
              key={post.id}
              href={`/knowledge/${post.id}`}
              className="block p-5 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  {highlightText(post.data.title, query)}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  {new Date(post.data.publishDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                {post.data.description ? highlightText(post.data.description, query) : 'Không có mô tả...'}
              </p>
              <div className="flex gap-2">
                {post.data.tags?.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-bold uppercase">
                    #{tag}
                  </span>
                ))}
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 mb-4 font-medium">Không tìm thấy kết quả nào cho "{query}"</p>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-black">Gợi ý Hot Tags</p>
              <div className="flex justify-center flex-wrap gap-2 px-4">
                {allTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setSelectedTag(tag); setQuery(''); }}
                    className="px-3 py-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 hover:border-emerald-500 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

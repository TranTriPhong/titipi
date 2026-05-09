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

    return results.slice(0, 15);
  }, [query, selectedTag, allPosts, fuse]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-pink-500/30 text-pink-500 rounded-sm px-0.5">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 md:px-0">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Digital Garden... (Ctrl + K)"
          className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-zinc-600 shadow-[0_0_20px_rgba(236,72,153,0.05)]"
        />
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border transition-all ${!selectedTag ? 'bg-pink-500 border-pink-500 text-black' : 'bg-transparent border-white/10 text-zinc-500 hover:border-pink-500/50 hover:text-pink-500'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border transition-all ${tag === selectedTag ? 'bg-pink-500 border-pink-500 text-black' : 'bg-transparent border-white/10 text-zinc-500 hover:border-pink-500/50 hover:text-pink-500'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <a
              key={post.id}
              href={`/blog/${post.id}`}
              className="block p-4 bg-zinc-950 border border-white/5 rounded-xl hover:border-pink-500/30 hover:bg-zinc-900/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-pink-500 transition-colors">
                  {highlightText(post.data.title, query)}
                </h3>
                <span className="text-[9px] font-mono text-zinc-600">
                  {new Date(post.data.pubDate || post.data.publishDate || '').toLocaleDateString('en-US')}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-1 mb-2">
                {post.data.description ? highlightText(post.data.description, query) : 'No description...'}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {post.data.tags?.map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded font-black uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-10 bg-zinc-950/50 rounded-2xl border border-dashed border-white/5">
            <p className="text-zinc-600 text-xs">No entries found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

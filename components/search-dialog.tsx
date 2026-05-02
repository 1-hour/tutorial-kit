'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Fuse, { type FuseResult } from 'fuse.js';
import type { Locale } from '@/lib/types';

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string;
  duration: number;
  locale: string;
  url: string;
}

interface SearchDialogProps {
  locale: Locale;
  placeholder: string;
  noResults: string;
}

export function SearchDialog({ locale, placeholder, noResults }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load index on first open
  useEffect(() => {
    if (open && items.length === 0 && !loading) {
      setLoading(true);
      fetch('/search-index.json')
        .then((r) => r.json())
        .then((data: SearchItem[]) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open, items.length, loading]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter to current locale + build fuse
  const fuse = useMemo(() => {
    const localeItems = items.filter((i) => i.locale === locale);
    return new Fuse(localeItems, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.15 },
        { name: 'category', weight: 0.05 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
  }, [items, locale]);

  const results: FuseResult<SearchItem>[] = useMemo(() => {
    if (!query.trim()) {
      // Show all items when no query
      return items
        .filter((i) => i.locale === locale)
        .map((item, idx) => ({ item, refIndex: idx, score: 0 }));
    }
    return fuse.search(query).slice(0, 10);
  }, [query, fuse, items, locale]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-lg hover:border-foreground/30 transition-colors"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">{placeholder}</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs border rounded bg-muted">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-base"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 border rounded"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
              )}
              {!loading && results.length === 0 && query && (
                <div className="p-8 text-center text-sm text-muted-foreground">{noResults}</div>
              )}
              {!loading &&
                results.map(({ item }) => (
                  <Link
                    key={`${item.locale}-${item.slug}`}
                    href={`/${item.locale}/tutorials/${item.slug}/`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 border-b last:border-b-0 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                          <span className="px-1.5 py-0.5 bg-muted rounded">{item.category}</span>
                          <span>•</span>
                          <span>{item.duration} min</span>
                          <span>•</span>
                          <span>{item.difficulty}</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

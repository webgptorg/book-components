'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ComponentMetadata, searchComponents } from '@/lib/components';

interface SearchBarProps {
  onSearchResults: (results: ComponentMetadata[]) => void;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ onSearchResults, onSearchChange }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        const results = searchComponents(query);
        onSearchResults(results);
      } else {
        onSearchResults([]);
      }
      onSearchChange(query);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, onSearchResults, onSearchChange]);

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search components..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>
  );
}

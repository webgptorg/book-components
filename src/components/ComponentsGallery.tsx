'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComponentMetadata } from '@/lib/components';
import { Package, Tag, User } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

interface ComponentsGalleryProps {
  initialComponents: ComponentMetadata[];
  initialComponentsByCategory: Record<string, ComponentMetadata[]>;
}

export default function ComponentsGallery({ 
  initialComponents, 
  initialComponentsByCategory 
}: ComponentsGalleryProps) {
  const [searchResults, setSearchResults] = useState<ComponentMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const displayByCategory = searchQuery.trim() 
    ? { 'Search Results': searchResults }
    : initialComponentsByCategory;

  return (
    <>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Build Faster with Ready-to-Use Components
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover, preview, and copy high-quality React components built with Tailwind CSS. 
            Each component is self-contained and ready to integrate into your project.
          </p>
          <div className="flex justify-center">
            <SearchBar 
              onSearchResults={setSearchResults}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{initialComponents.length}</div>
              <div className="text-gray-600">Components</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{Object.keys(initialComponentsByCategory).length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-gray-600">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery.trim() && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No components found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all components below.</p>
            </div>
          ) : (
            Object.entries(displayByCategory).map(([category, categoryComponents]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="h-6 w-6 mr-2 text-blue-600" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryComponents.map((component) => (
                    <Link
                      key={component.id}
                      href={`/component/${component.id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {component.name}
                            </h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              v{component.version}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {component.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {component.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {component.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{component.tags.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {component.author}
                            </div>
                            <div className="text-blue-600 group-hover:text-blue-700">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  X,
  Sliders,
  Star,
  TrendingUp,
  Clock,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';

interface SearchResult {
  id: number;
  name: string;
  username: string;
  image: string;
  type: 'character' | 'tag' | 'location';
  rating?: number;
  category?: string;
}

const popularSearches = [
  'blonde',
  'asian',
  'twins',
  'roleplay',
  'voice call',
  'gamer girl',
  'cosplay',
];

const recentSearches = ['Claire', 'voice messages', 'JennyPinky', 'twins'];

const searchResults: SearchResult[] = [
  {
    id: 1,
    name: 'Claire',
    username: '@claire',
    image: '/claire-profile.png',
    type: 'character',
    rating: 4.9,
    category: 'Blonde',
  },
  {
    id: 2,
    name: 'JennyPinky',
    username: '@jennypinky',
    image: '/jennypinky-profile.png',
    type: 'character',
    rating: 4.8,
    category: 'Brunette',
  },
  {
    id: 3,
    name: 'Valeria & Camila',
    username: '@twins',
    image: '/valeria-camila-profile.png',
    type: 'character',
    rating: 4.9,
    category: 'Twins',
  },
  {
    id: 4,
    name: '#roleplay',
    username: 'Tag',
    image: '/placeholder.svg?key=39vbu',
    type: 'tag',
  },
  {
    id: 5,
    name: '#voicecall',
    username: 'Tag',
    image: '/placeholder.svg?key=gihwc',
    type: 'tag',
  },
  {
    id: 6,
    name: 'Tokyo',
    username: 'Location',
    image: '/tokyo-cityscape.png',
    type: 'location',
  },
];

interface AdvancedSearchProps {
  onSelectCharacter?: (characterId: number) => void;
}

export default function AdvancedSearch({
  onSelectCharacter,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (query.length > 0) {
      // Filter results based on query
      const filtered = searchResults.filter(
        (result) =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.username.toLowerCase().includes(query.toLowerCase()) ||
          (result.category &&
            result.category.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleFocus = () => {
    setIsSearching(true);
  };

  const handleClose = () => {
    setIsSearching(false);
    setQuery('');
    setResults([]);
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'character' && onSelectCharacter) {
      onSelectCharacter(result.id);
      handleClose();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search characters, tags, locations..."
          className={`w-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-full py-3 px-4 pl-10`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />
        <Search
          size={20}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        />
        {query && (
          <button
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
            onClick={() => setQuery('')}
          >
            <X size={18} className="text-zinc-400" />
          </button>
        )}
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Sliders
            size={18}
            className={showFilters ? 'text-pink-500' : 'text-zinc-400'}
          />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-2 p-4 rounded-xl ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'} shadow-lg overflow-hidden`}
          >
            <h3 className="font-semibold mb-3">Filter by</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'} flex items-center`}
              >
                <Star size={16} className="mr-2 text-yellow-500" /> Rating
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'} flex items-center`}
              >
                <TrendingUp size={16} className="mr-2 text-green-500" />{' '}
                Popularity
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'} flex items-center`}
              >
                <Clock size={16} className="mr-2 text-blue-500" /> Recent
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'} flex items-center`}
              >
                <Filter size={16} className="mr-2 text-purple-500" /> Categories
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute left-0 right-0 top-full mt-2 rounded-2xl ${
              theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
            } shadow-xl z-50 max-h-[80vh] overflow-y-auto`}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Search</h3>
                <button onClick={handleClose}>
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              {query.length > 0 ? (
                results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className={`flex items-center p-2 rounded-lg ${
                          theme === 'dark'
                            ? 'hover:bg-zinc-800'
                            : 'hover:bg-zinc-100'
                        } cursor-pointer`}
                        onClick={() => handleSelectResult(result)}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={
                              result.image
                                ? result.image
                                : `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(result.name)}`
                            }
                            alt={result.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">{result.name}</p>
                          <p
                            className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
                          >
                            {result.username}
                          </p>
                        </div>
                        {result.type === 'character' && result.rating && (
                          <div className="ml-auto flex items-center">
                            <Star
                              size={14}
                              className="text-yellow-400 mr-1"
                              fill="currentColor"
                            />
                            <span className="text-sm">{result.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p
                      className={
                        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                      }
                    >
                      No results found for "{query}"
                    </p>
                  </div>
                )
              ) : (
                <>
                  {/* Popular searches */}
                  <div className="mb-6">
                    <h4
                      className={`text-sm mb-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
                    >
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term, index) => (
                        <button
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'
                          }`}
                          onClick={() => setQuery(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent searches */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4
                        className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
                      >
                        Recent Searches
                      </h4>
                      <button className="text-xs text-pink-500">
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((term, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-2 rounded-lg ${
                            theme === 'dark'
                              ? 'hover:bg-zinc-800'
                              : 'hover:bg-zinc-100'
                          } cursor-pointer`}
                          onClick={() => setQuery(term)}
                        >
                          <Clock
                            size={16}
                            className={`mr-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
                          />
                          <span>{term}</span>
                          <button
                            className="ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Remove from recent searches logic would go here
                            }}
                          >
                            <X
                              size={14}
                              className={
                                theme === 'dark'
                                  ? 'text-zinc-400'
                                  : 'text-zinc-500'
                              }
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

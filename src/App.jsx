import React from 'react';
import { useAppSelector } from './hooks/useAppSelector';
import { selectIsSearching } from './features/search/searchSlice';
import SortSelector from './features/posts/SortSelector';
import PopularSubreddits from './features/subreddits/PopularSubreddits';
import MultiSubredditGrid from './features/posts/MultiSubredditGrid';
import SearchBar from './features/search/SearchBar';
import SearchFilters from './features/search/SearchFilters';
import SearchResults from './features/search/SearchResults';

function App() {
  const isSearching = useAppSelector(selectIsSearching);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reddit Client</h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {isSearching ? (
            // Search Mode
            <>
              {/* Search Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Filter Results</h2>
                <SearchFilters />
              </div>

              {/* Search Results */}
              <SearchResults />
            </>
          ) : (
            // Browse Mode
            <>
              {/* Sort Selector */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Sort Posts</h2>
                <SortSelector />
              </div>

              {/* Popular Subreddits Navigation */}
              <PopularSubreddits />

              {/* Multi-Subreddit Grid */}
              <MultiSubredditGrid />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

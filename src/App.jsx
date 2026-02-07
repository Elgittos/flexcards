import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from './hooks/useAppSelector';
import { selectIsSearching } from './features/search/searchSlice';
import { selectModalOpen, selectSelectedPostId, selectSelectedPostSubreddit, closeModal } from './features/ui/uiSlice';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import SortSelector from './features/posts/SortSelector';
import PopularSubreddits from './features/subreddits/PopularSubreddits';
import MultiSubredditGrid from './features/posts/MultiSubredditGrid';
import SearchFilters from './features/search/SearchFilters';
import SearchResults from './features/search/SearchResults';
import Modal from './components/common/Modal';
import PostDetail from './features/posts/PostDetail';

function App() {
  const dispatch = useDispatch();
  const isSearching = useAppSelector(selectIsSearching);
  const modalOpen = useAppSelector(selectModalOpen);
  const selectedPostId = useAppSelector(selectSelectedPostId);
  const selectedPostSubreddit = useAppSelector(selectSelectedPostSubreddit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Layout Container */}
      <div className="flex">
        {/* Sidebar - Desktop always visible, Mobile drawer */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-0">
          <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
            <div className="space-y-4 sm:space-y-6">
              {isSearching ? (
                // Search Mode
                <>
                  {/* Search Filters */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Filter Results
                    </h2>
                    <SearchFilters />
                  </div>

                  {/* Search Results */}
                  <SearchResults />
                </>
              ) : (
                // Browse Mode
                <>
                  {/* Sort Selector */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Sort Posts
                    </h2>
                    <SortSelector />
                  </div>

                  {/* Popular Subreddits Navigation */}
                  <PopularSubreddits />

                  {/* Multi-Subreddit Grid */}
                  <MultiSubredditGrid />
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Post Detail Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => dispatch(closeModal())}
        ariaLabel="Post Details"
      >
        {selectedPostId && selectedPostSubreddit && (
          <PostDetail 
            postId={selectedPostId}
            subreddit={selectedPostSubreddit}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;

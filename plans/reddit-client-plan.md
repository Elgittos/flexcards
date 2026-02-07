## Plan: Reddit Client Application

Build a full-featured Reddit client using React, Redux Toolkit, and the Reddit JSON API with search, filtering, detailed views, PWA support, and Lighthouse 90+ scores.

**Phases: 10 phases**

1. **Phase 1: Project Setup and Dependencies**
    - **Objective:** Install required dependencies, configure testing infrastructure (Vitest), and set up Reddit API base configuration
    - **Files/Functions to Modify/Create:**
        - package.json (add dependencies: react-markdown, remark-gfm, rehype-sanitize, framer-motion, react-window, date-fns, clsx, vitest, @testing-library/react, msw)
        - vitest.config.js
        - src/test/setup.js
        - src/test/utils.jsx (test utilities with providers)
        - src/app/api/redditApi.js (RTK Query base for Reddit)
        - Update src/app/store.js to include redditApi
        - Remove example slice files
    - **Tests to Write:**
        - redditApi.test.js - Test RTK Query configuration
        - store.test.js - Verify redditApi is properly configured in store
    - **Steps:**
        1. Write test for redditApi configuration (expect it to fail)
        2. Install all required npm packages
        3. Configure Vitest with jsdom environment
        4. Create test utilities (renderWithProviders)
        5. Create redditApi base with fetchBaseQuery pointing to reddit.com
        6. Wire redditApi into store with middleware
        7. Run tests to verify they pass
        8. Remove example slice to clean up scaffolding

2. **Phase 2: Core Reddit API Endpoints**
    - **Objective:** Implement RTK Query endpoints for fetching subreddit posts, searching, and getting post details with comments
    - **Files/Functions to Modify/Create:**
        - src/app/api/redditApi.js (add endpoints: getSubredditPosts, searchPosts, getPostWithComments)
        - src/utils/redditHelpers.js (transformResponse helpers, data normalization)
        - src/constants/subreddits.js (predefined categories)
    - **Tests to Write:**
        - redditApi.endpoints.test.js - Test each endpoint with MSW mocks
        - redditHelpers.test.js - Test data transformation functions
    - **Steps:**
        1. Write tests for getSubredditPosts endpoint (failing)
        2. Create MSW handlers for Reddit API mocking
        3. Implement getSubredditPosts query with transformResponse
        4. Run tests to verify endpoint works
        5. Write tests for searchPosts endpoint (failing)
        6. Implement searchPosts query
        7. Run tests to verify search works
        8. Write tests for getPostWithComments endpoint (failing)
        9. Implement getPostWithComments with comment tree parsing
        10. Run all tests to confirm they pass

3. **Phase 3: UI State Management and Post Display**
    - **Objective:** Create UI slice for app state, build PostCard and PostList components with tests
    - **Files/Functions to Modify/Create:**
        - src/features/ui/uiSlice.js (dark mode, view mode, active subreddit)
        - src/features/posts/PostCard.jsx
        - src/features/posts/PostList.jsx
        - src/features/posts/PostSkeleton.jsx
        - src/utils/formatDate.js
        - Update src/App.jsx to show initial PostList
    - **Tests to Write:**
        - uiSlice.test.js - Test reducers and selectors
        - PostCard.test.js - Test post rendering with mock data
        - PostList.test.js - Test list rendering and loading states
        - formatDate.test.js - Test date formatting utility
    - **Steps:**
        1. Write tests for uiSlice reducers (failing)
        2. Create uiSlice with initial state and reducers
        3. Run tests to verify slice works
        4. Write tests for PostCard component (failing)
        5. Build PostCard with Tailwind styling showing title, author, score, thumbnail
        6. Run tests to verify PostCard renders correctly
        7. Write tests for PostList component (failing)
        8. Build PostList using useGetSubredditPostsQuery hook
        9. Add PostSkeleton for loading state
        10. Update App.jsx to render PostList with default subreddit
        11. Run all tests to confirm they pass

4. **Phase 4: Subreddit Selection and Filtering**
    - **Objective:** Build subreddit selector, sort controls, and category filtering
    - **Files/Functions to Modify/Create:**
        - src/features/subreddits/SubredditSelector.jsx
        - src/features/subreddits/PopularSubreddits.jsx
        - src/features/posts/SortSelector.jsx
        - Update src/App.jsx to include subreddit navigation
        - Update uiSlice to handle active subreddit and sort
    - **Tests to Write:**
        - SubredditSelector.test.js - Test subreddit switching
        - SortSelector.test.js - Test sort option changes
        - PopularSubreddits.test.js - Test category display and selection
    - **Steps:**
        1. Write tests for SubredditSelector (failing)
        2. Build SubredditSelector component with dropdown/list
        3. Run tests to verify selection works
        4. Write tests for SortSelector (failing)
        5. Build SortSelector with hot/new/top/rising options
        6. Run tests to verify sort selection
        7. Write tests for PopularSubreddits (failing)
        8. Build PopularSubreddits with predefined categories
        9. Update App.jsx to include navigation components
        10. Run all tests to confirm they pass

5. **Phase 5: Search Functionality**
    - **Objective:** Implement search bar with query handling, search results display, and search history
    - **Files/Functions to Modify/Create:**
        - src/features/search/SearchBar.jsx
        - src/features/search/searchSlice.js (query history, active query)
        - src/features/search/SearchResults.jsx
        - src/features/search/SearchFilters.jsx
        - Update src/App.jsx to include search functionality
    - **Tests to Write:**
        - searchSlice.test.js - Test search state management
        - SearchBar.test.js - Test input and submission
        - SearchResults.test.js - Test results rendering
        - SearchFilters.test.js - Test filter options
    - **Steps:**
        1. Write tests for searchSlice (failing)
        2. Create searchSlice with query state and history
        3. Run tests to verify slice works
        4. Write tests for SearchBar (failing)
        5. Build SearchBar with controlled input and submit handler
        6. Run tests to verify search submission
        7. Write tests for SearchResults (failing)
        8. Build SearchResults using searchPosts query
        9. Write tests for SearchFilters (failing)
        10. Build SearchFilters with time range and sort options
        11. Integrate search into App.jsx
        12. Run all tests to confirm they pass

6. **Phase 6: Post Detail View with Comments**
    - **Objective:** Create modal/route for post details, implement comment tree with markdown rendering
    - **Files/Functions to Modify/Create:**
        - src/features/posts/PostDetail.jsx
        - src/features/comments/CommentTree.jsx
        - src/features/comments/Comment.jsx
        - src/components/common/Modal.jsx
        - src/components/common/MarkdownRenderer.jsx
        - Update uiSlice for modal state
    - **Tests to Write:**
        - PostDetail.test.js - Test detail view rendering
        - CommentTree.test.js - Test nested comment rendering
        - Comment.test.js - Test individual comment with markdown
        - Modal.test.js - Test modal open/close
        - MarkdownRenderer.test.js - Test markdown rendering and sanitization
    - **Steps:**
        1. Write tests for Modal component (failing)
        2. Build Modal with Framer Motion animations
        3. Run tests to verify modal behavior
        4. Write tests for MarkdownRenderer (failing)
        5. Implement MarkdownRenderer with react-markdown and sanitization
        6. Run tests to verify markdown renders safely
        7. Write tests for Comment component (failing)
        8. Build Comment with markdown body and metadata
        9. Write tests for CommentTree (failing)
        10. Build CommentTree with recursive rendering
        11. Write tests for PostDetail (failing)
        12. Build PostDetail combining post and comments
        13. Update PostCard to open modal on click
        14. Run all tests to confirm they pass

7. **Phase 7: Rate Limiting and Error Handling**
    - **Objective:** Implement rate limit handling, error boundaries, and user-friendly error states
    - **Files/Functions to Modify/Create:**
        - src/middleware/rateLimiter.js
        - src/app/api/redditApi.js (add retry logic to baseQuery)
        - src/components/common/ErrorBoundary.jsx
        - src/components/common/ErrorFallback.jsx
        - src/components/common/RateLimitError.jsx
        - src/utils/errors.js (error handling utilities)
    - **Tests to Write:**
        - rateLimiter.test.js - Test rate limit logic
        - ErrorBoundary.test.js - Test error catching
        - ErrorFallback.test.js - Test error display and recovery
        - redditApi.retry.test.js - Test retry logic with 429 responses
    - **Steps:**
        1. Write tests for rate limiter (failing)
        2. Implement token bucket rate limiter
        3. Run tests to verify rate limiting
        4. Write tests for retry logic (failing)
        5. Wrap baseQuery with retry mechanism for 429 errors
        6. Run tests to verify retries work
        7. Write tests for ErrorBoundary (failing)
        8. Implement ErrorBoundary component
        9. Write tests for error fallbacks (failing)
        10. Build error fallback components with recovery actions
        11. Wrap App in ErrorBoundary
        12. Run all tests to confirm they pass

8. **Phase 8: PWA Configuration**
    - **Objective:** Configure Progressive Web App with service worker, manifest, and offline support
    - **Files/Functions to Modify/Create:**
        - vite.config.js (add vite-plugin-pwa)
        - public/manifest.json
        - public/icon-192.png
        - public/icon-512.png
        - src/utils/serviceWorker.js (registration logic)
        - Update index.html with manifest link and meta tags
    - **Tests to Write:**
        - serviceWorker.test.js - Test SW registration
        - pwa.e2e.test.js - Test offline functionality
    - **Steps:**
        1. Install vite-plugin-pwa
        2. Write test for SW registration (failing)
        3. Configure vite-plugin-pwa with Workbox
        4. Set up manifest.json with app metadata
        5. Create app icons (192x192, 512x512)
        6. Configure caching strategies (NetworkFirst for API, CacheFirst for images)
        7. Implement SW registration utility
        8. Run tests to verify SW registers
        9. Test offline functionality manually
        10. Run all tests to confirm they pass

9. **Phase 9: Responsive Design and Animations**
    - **Objective:** Implement responsive layouts for mobile/tablet/desktop and smooth animations
    - **Files/Functions to Modify/Create:**
        - Update all components with Tailwind responsive classes
        - src/components/layout/Header.jsx
        - src/components/layout/Sidebar.jsx
        - src/components/layout/MobileNav.jsx
        - Add Framer Motion animations to modals, page transitions
        - tailwind.config.js (custom animations)
    - **Tests to Write:**
        - Header.test.js - Test responsive header
        - Sidebar.test.js - Test sidebar show/hide
        - MobileNav.test.js - Test mobile navigation
        - animations.test.js - Test animation presence
    - **Steps:**
        1. Write tests for Header component (failing)
        2. Build responsive Header with mobile menu toggle
        3. Run tests to verify header responsiveness
        4. Write tests for Sidebar (failing)
        5. Build Sidebar with Framer Motion slide animations
        6. Write tests for MobileNav (failing)
        7. Build MobileNav with drawer animation
        8. Add responsive grid layouts to PostList
        9. Add hover animations to PostCard
        10. Add modal enter/exit animations
        11. Test on different viewports
        12. Run all tests to confirm they pass

10. **Phase 10: Performance Optimization and E2E Testing**
    - **Objective:** Optimize for Lighthouse 90+ scores, implement virtual scrolling, and create E2E test suite
    - **Files/Functions to Modify/Create:**
        - Update PostList.jsx to use react-window
        - vite.config.js (code splitting, chunk optimization)
        - src/components/common/LazyImage.jsx
        - Add React.lazy for route-based code splitting
        - playwright.config.js
        - e2e/search.spec.js
        - e2e/postDetail.spec.js
        - e2e/navigation.spec.js
        - e2e/responsive.spec.js
        - README.md (project documentation with wireframes)
    - **Tests to Write:**
        - LazyImage.test.js - Test lazy loading behavior
        - E2E: Search flow (open app → search → view results → open detail)
        - E2E: Navigation flow (switch subreddits → sort → filter)
        - E2E: Responsive behavior (mobile viewport tests)
        - E2E: Error recovery (handle API failures gracefully)
    - **Steps:**
        1. Write tests for LazyImage (failing)
        2. Implement LazyImage with loading/error states
        3. Run tests to verify lazy loading
        4. Configure Playwright for E2E testing
        5. Write E2E test for search flow (failing)
        6. Ensure search flow works end-to-end
        7. Write E2E test for navigation (failing)
        8. Ensure navigation works across subreddits
        9. Write E2E test for responsive design (failing)
        10. Verify responsive behavior in tests
        11. Implement react-window for virtual scrolling
        12. Configure code splitting in Vite
        13. Add manual chunks for vendor code
        14. Run Lighthouse audits and optimize to 90+
        15. Write comprehensive README with wireframes and documentation
        16. Run all tests (unit + E2E) to confirm they pass

**Configuration Decisions:**

1. **Detailed View Preference:** Both - Modal by default with toggle to switch to route view (supports both UX patterns)
2. **Initial Default Subreddit:** Multiple in grid view (r/javascript, r/reactjs, r/webdev, r/programming)
3. **Comment Threading Depth:** Collapse after 4 levels to prevent clutter, show "Continue thread" links
4. **Image/Video Handling:** Thumbnails with click to expand (performance optimized)
5. **Dark Mode:** Toggle button for dark/light mode (user-controlled theme switching)

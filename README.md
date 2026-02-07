# Reddit Client

> A modern, performant Reddit client built with React, Redux Toolkit, and Vite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg)](https://vitejs.dev/)

## Overview

Modern Reddit client application featuring a clean interface, responsive design, and optimized performance. Built following Test-Driven Development (TDD) principles with comprehensive test coverage (366+ tests).

### Key Features

- **🚀 Fast & Performant** - Virtual scrolling with react-window, code splitting, lazy loading
- **📱 Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
- **🔍 Advanced Search** - Filter and search Reddit posts with real-time results
- **💬 Comment Threads** - Nested comment viewing with expand/collapse functionality
- **🎨 Modern UI** - Clean, intuitive interface built with Tailwind CSS
- **♿ Accessible** - WCAG compliant with keyboard navigation support
- **🧪 Well Tested** - 366+ unit tests, E2E tests with Playwright
- **📴 Offline Support** - PWA with service worker for offline functionality
- **⚡ Real-time Updates** - RTK Query for efficient data fetching and caching

## Tech Stack

### Core Technologies
- **React 18.3** - UI library with hooks and concurrent features
- **Redux Toolkit 2.2** - State management with RTK Query
- **React Router 6.22** - Client-side routing
- **Vite 5.1** - Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 11.0** - Animation library
- **react-window 1.8** - Virtualized list rendering

### Content & Markdown
- **react-markdown 9.0** - Markdown rendering for posts and comments
- **remark-gfm 4.0** - GitHub Flavored Markdown support
- **rehype-sanitize 6.0** - HTML sanitization

### Testing
- **Vitest 1.2** - Unit and integration testing
- **Playwright 1.41** - End-to-end testing
- **Testing Library** - React component testing utilities
- **MSW 2.12** - API mocking for tests

### Development Tools
- **ESLint 8.57** - Code linting
- **PostCSS 8.4** - CSS processing
- **Autoprefixer 10.4** - CSS vendor prefixing

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reddit-client.git
   cd reddit-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build in `dist/` directory |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once (CI mode) |
| `npm run test:ui` | Open Vitest UI for interactive testing |

## Project Structure

```
reddit-client/
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── store.js           # Store setup
│   │   └── api/               # RTK Query API slices
│   │       └── redditApi.js   # Reddit API integration
│   │
│   ├── features/              # Feature-based modules
│   │   ├── posts/            # Post listing and detail
│   │   ├── comments/         # Comment threads
│   │   ├── search/           # Search functionality
│   │   ├── subreddits/       # Subreddit selection
│   │   └── ui/               # UI state management
│   │
│   ├── components/           # Reusable components
│   │   ├── common/          # Generic components
│   │   │   ├── LazyImage.jsx        # Lazy loading images
│   │   │   ├── Modal.jsx            # Modal dialogs
│   │   │   ├── ErrorBoundary.jsx   # Error handling
│   │   │   └── MarkdownRenderer.jsx # Markdown display
│   │   └── layout/          # Layout components
│   │       ├── Header.jsx           # App header
│   │       ├── Sidebar.jsx          # Navigation sidebar
│   │       └── MobileNav.jsx        # Mobile navigation
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAppDispatch.js
│   │   └── useAppSelector.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatDate.js          # Date formatting
│   │   ├── redditHelpers.js       # Reddit data helpers
│   │   ├── errors.js              # Error utilities
│   │   └── registerServiceWorker.js # PWA service worker
│   │
│   ├── middleware/         # Redux middleware
│   │   └── rateLimiter.js        # API rate limiting
│   │
│   ├── constants/          # App constants
│   │   └── subreddits.js         # Default subreddit list
│   │
│   ├── test/               # Test configuration
│   │   ├── setup.js              # Vitest setup
│   │   └── utils.jsx             # Test utilities
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
│
├── e2e/                    # End-to-end tests
│   ├── search.spec.js            # Search flow tests
│   ├── postDetail.spec.js        # Post detail tests
│   ├── navigation.spec.js        # Navigation tests
│   └── responsive.spec.js        # Responsive design tests
│
├── public/                 # Static assets
│   ├── icon-192.png             # PWA icon (192x192)
│   ├── icon-512.png             # PWA icon (512x512)
│   └── manifest.json            # PWA manifest
│
├── plans/                  # Development plans (TDD phases)
├── vite.config.js         # Vite configuration
├── vitest.config.js       # Vitest configuration
├── playwright.config.js   # Playwright configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── eslint.config.js       # ESLint configuration
└── package.json           # Project dependencies
```

## Architecture

### State Management

The application uses **Redux Toolkit** with a feature-based architecture:

- **RTK Query** for data fetching and caching
- **Feature slices** for isolated state management
- **Custom hooks** for type-safe Redux access

### Performance Optimizations

#### 1. Code Splitting
Vite configuration automatically splits code into optimized chunks:
- `react-vendor` - React, React DOM, React Router
- `redux-vendor` - Redux Toolkit, React Redux
- `animation-vendor` - Framer Motion
- `markdown-vendor` - Markdown rendering libraries
- `utils-vendor` - Date-fns, clsx

#### 2. Virtual Scrolling
Uses `react-window` for efficient rendering of long post lists:
- Only renders visible items
- Dramatically reduces DOM nodes
- Smooth scrolling with large datasets

#### 3. Lazy Loading Images
Custom `LazyImage` component with IntersectionObserver:
- Images load only when entering viewport
- Reduces initial page load time
- Fade-in animation on load

#### 4. Service Worker & PWA
Progressive Web App features:
- Offline functionality
- Asset caching
- Network-first strategy for Reddit API
- Cache-first for static assets

#### 5. Rate Limiting
Custom middleware prevents API throttling:
- Automatic retry with exponential backoff
- Request queuing
- Error handling for rate limit errors

## Testing

### Unit & Integration Tests

**366 tests** covering all components and utilities using Vitest and React Testing Library.

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Open interactive test UI
npm run test:ui
```

**Test Coverage:**
- ✅ All Redux slices and actions
- ✅ API integration and error handling
- ✅ React components and hooks
- ✅ Utility functions and helpers
- ✅ Error boundaries and fallbacks
- ✅ Middleware and rate limiting

### End-to-End Tests

Comprehensive E2E tests using **Playwright** across multiple browsers:

```bash
# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test e2e/search.spec.js
```

**E2E Test Suites:**
- **Search Flow** (8 tests) - Search functionality, results, filtering
- **Post Detail** (10 tests) - Modal interactions, comments, navigation
- **Navigation** (10 tests) - Subreddit switching, routing, history
- **Responsive** (12 tests) - Mobile, tablet, desktop layouts

**Browser Coverage:**
- Desktop: Chrome, Firefox, Safari
- Mobile: Mobile Chrome, Mobile Safari

## Features Deep Dive

### 🔍 Search
- Real-time search across Reddit
- Filter by subreddit
- Sort by relevance, new, top, etc.
- Query persistence in URL

### 📝 Posts
- Card and list view modes
- Virtual scrolling for performance
- Image lazy loading
- Vote counts and metadata
- External link handling

### 💬 Comments
- Nested comment threads
- Expand/collapse functionality
- Markdown rendering
- Author highlighting
- Time-based sorting

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Touch-friendly interactions
- Adaptive layouts and navigation

### ♿ Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## API Integration

### Reddit JSON API

This app uses the **public Reddit JSON API** (no authentication required):

```javascript
// Base URL
https://www.reddit.com

// Endpoints
/r/{subreddit}/{sort}.json      // Get posts
/r/{subreddit}/search.json      // Search posts
/{permalink}.json               // Get post with comments
```

### Rate Limiting

Reddit's API has rate limits. This app implements:
- Request throttling (1 req/second)
- Exponential backoff on errors
- Cached responses (1 hour)
- User-friendly error messages

## Contributing

We welcome contributions! This project was built following strict TDD practices.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Write tests first** (TDD approach)
4. **Implement the feature** (make tests pass)
5. **Verify all tests pass** (`npm run test:run`)
6. **Run linting** (`npm run lint:fix`)
7. **Commit changes** (`git commit -m 'Add amazing feature'`)
8. **Push to branch** (`git push origin feature/amazing-feature`)
9. **Open a Pull Request**

### Code Standards

- Follow existing code patterns
- Write comprehensive tests (TDD)
- Use TypeScript-style JSDoc comments
- Follow ESLint rules
- Ensure accessibility compliance

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari 14+, Chrome Android)

## Known Issues & Limitations

1. **No Authentication** - Read-only access to public Reddit content
2. **Rate Limiting** - Reddit API limits may affect heavy usage
3. **NSFW Content** - Not filtered by default
4. **Video Content** - Limited support for Reddit video player

## Future Enhancements

- [ ] User authentication and posting
- [ ] Subreddit subscriptions
- [ ] Dark mode theme
- [ ] Content filtering (NSFW, etc.)
- [ ] Save posts and comments
- [ ] Infinite scroll pagination
- [ ] Video player integration
- [ ] Share functionality

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [GitHub Copilot Orchestra](COPILOT_ORCHESTRA.md) - Multi-agent TDD workflow
- Reddit API for public data access
- Open source community for amazing tools and libraries

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/reddit-client/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/reddit-client/discussions)

---

**Made with ❤️ using React, Redux, and TDD principles**

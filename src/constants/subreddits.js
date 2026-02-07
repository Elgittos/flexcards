/**
 * Predefined subreddit categories
 * 
 * These are curated collections of popular subreddits
 * organized by topic for easy navigation.
 */

export const SUBREDDIT_CATEGORIES = {
  technology: {
    label: 'Technology',
    subreddits: ['javascript', 'reactjs', 'webdev', 'programming'],
  },
  gaming: {
    label: 'Gaming',
    subreddits: ['gaming', 'pcgaming', 'Games', 'gamernews'],
  },
  news: {
    label: 'News',
    subreddits: ['news', 'worldnews', 'technology', 'science'],
  },
  entertainment: {
    label: 'Entertainment',
    subreddits: ['movies', 'television', 'music', 'books'],
  },
  lifestyle: {
    label: 'Lifestyle',
    subreddits: ['fitness', 'food', 'DIY', 'art'],
  },
};

/**
 * Default subreddit to show when app first loads
 */
export const DEFAULT_SUBREDDIT = 'javascript';

/**
 * Default sort option for posts
 */
export const DEFAULT_SORT = 'hot';

/**
 * Available sort options for posts
 */
export const SORT_OPTIONS = ['hot', 'new', 'top', 'rising'];

/**
 * Default limit for posts per page
 */
export const DEFAULT_POSTS_LIMIT = 25;

/**
 * Get all subreddits as a flat array
 * @returns {Array<string>} Array of all subreddit names
 */
export function getAllSubreddits() {
  return Object.values(SUBREDDIT_CATEGORIES)
    .flatMap((category) => category.subreddits);
}

/**
 * Get subreddits by category
 * @param {string} categoryName - Name of the category
 * @returns {Array<string>} Array of subreddit names in that category
 */
export function getSubredditsByCategory(categoryName) {
  const category = SUBREDDIT_CATEGORIES[categoryName];
  return category ? category.subreddits : [];
}

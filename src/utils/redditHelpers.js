/**
 * Reddit API Helper Functions
 * 
 * These functions transform and normalize Reddit API responses
 * into a consistent format for the application.
 */

/**
 * Normalize a Reddit post object
 * @param {Object} redditPost - Raw Reddit post object with kind and data
 * @returns {Object} Normalized post object
 */
export function normalizePost(redditPost) {
  const { data } = redditPost;
  
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    subreddit: data.subreddit,
    score: data.score,
    createdAt: data.created_utc,
    numComments: data.num_comments,
    url: data.url || '',
    permalink: data.permalink || '',
    thumbnail: data.thumbnail || '',
    content: data.selftext || '',
    isSelf: data.is_self || false,
  };
}

/**
 * Normalize a Reddit comment object
 * @param {Object} redditComment - Raw Reddit comment object with kind and data
 * @returns {Object} Normalized comment object
 */
export function normalizeComment(redditComment) {
  const { data } = redditComment;
  
  // Process nested replies if they exist
  let replies = [];
  if (data.replies && typeof data.replies === 'object' && data.replies.data) {
    replies = buildCommentTree(data.replies);
  }
  
  return {
    id: data.id,
    author: data.author,
    body: data.body,
    score: data.score,
    createdAt: data.created_utc,
    parentId: data.parent_id,
    replies,
  };
}

/**
 * Transform subreddit posts listing response
 * @param {Object} response - Reddit listing response
 * @returns {Object} Object with posts array and pagination info
 */
export function transformSubredditPosts(response) {
  const { data } = response;
  
  return {
    posts: data.children.map(normalizePost),
    after: data.after || null,
    before: data.before || null,
  };
}

/**
 * Transform search results listing response
 * @param {Object} response - Reddit search listing response
 * @returns {Object} Object with posts array and pagination info
 */
export function transformSearchResults(response) {
  // Search results have the same structure as subreddit posts
  return transformSubredditPosts(response);
}

/**
 * Transform post with comments response
 * @param {Array} response - Array with [postListing, commentsListing]
 * @returns {Object} Object with post and comments array
 */
export function transformPostWithComments(response) {
  const [postListing, commentsListing] = response;
  
  // Extract the post from the first listing
  const post = normalizePost(postListing.data.children[0]);
  
  // Extract comments from the second listing
  const comments = buildCommentTree(commentsListing);
  
  return {
    post,
    comments,
  };
}

/**
 * Build a comment tree from a listing, filtering out "more" placeholders
 * @param {Object} listing - Reddit comments listing
 * @returns {Array} Array of normalized comments with nested replies
 */
export function buildCommentTree(listing) {
  const { data } = listing;
  
  // Filter out "more" comments placeholders and normalize
  return data.children
    .filter((child) => child.kind === 't1')
    .map(normalizeComment);
}

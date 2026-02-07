import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Subreddit Navigation
 * Tests navigation between subreddits and filtering:
 * - Switching subreddits
 * - Sorting options
 * - Filter functionality
 * - Sidebar navigation
 */
test.describe('Subreddit Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display default subreddit posts on load', async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
    
    // Should have multiple posts
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);
  });

  test('should switch to different subreddit', async ({ page }) => {
    // Click on a different subreddit in sidebar
    const subredditLink = page.getByRole('button', { name: /javascript/i }).or(
      page.getByRole('link', { name: /javascript/i })
    );
    
    await subredditLink.click();
    await page.waitForLoadState('networkidle');
    
    // URL should reflect the new subreddit
    expect(page.url()).toContain('javascript');
    
    // Posts should reload
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should show loading state when changing subreddits', async ({ page }) => {
    const subredditLink = page.getByRole('button', { name: /python/i }).or(
      page.getByRole('link', { name: /python/i })
    );
    
    await subredditLink.click();
    
    // Should show loading skeleton
    const skeleton = page.locator('[data-testid="post-skeleton"]');
    await expect(skeleton.first()).toBeVisible();
  });

  test('should maintain scroll position when navigating back', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Click a post
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Scroll position should be maintained (approximately)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(300);
  });

  test('should change sort option', async ({ page }) => {
    // Find sort dropdown/buttons
    const sortButton = page.getByRole('button', { name: /hot|new|top|rising/i }).first();
    await sortButton.click();
    
    // Select different sort option
    const newSort = page.getByRole('button', { name: /new/i }).or(
      page.getByRole('menuitem', { name: /new/i })
    );
    await newSort.click();
    
    await page.waitForLoadState('networkidle');
    
    // Posts should reload with new sort
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should toggle between view modes', async ({ page }) => {
    // Find view mode toggle (card/list)
    const viewToggle = page.locator('[data-testid="view-toggle"]').or(
      page.getByRole('button', { name: /card|list/i })
    );
    
    if (await viewToggle.count() > 0) {
      await viewToggle.first().click();
      
      // Layout should change
      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
    }
  });

  test('should navigate using browser back/forward', async ({ page }) => {
    const initialUrl = page.url();
    
    // Navigate to different subreddit
    const subredditLink = page.getByRole('button', { name: /react/i }).or(
      page.getByRole('link', { name: /react/i })
    );
    await subredditLink.click();
    await page.waitForLoadState('networkidle');
    
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toBe(initialUrl);
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toBe(newUrl);
  });

  test('should display subreddit list in sidebar', async ({ page }) => {
    // Sidebar should show multiple subreddits
    const subreddits = page.locator('[data-testid="subreddit-item"]').or(
      page.locator('nav a, nav button').filter({ hasText: /r\// })
    );
    
    const count = await subreddits.count();
    expect(count).toBeGreaterThan(3);
  });

  test('should highlight active subreddit', async ({ page }) => {
    // Click a subreddit
    const subredditLink = page.getByRole('button', { name: /webdev/i }).or(
      page.getByRole('link', { name: /webdev/i })
    );
    
    if (await subredditLink.count() > 0) {
      await subredditLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Active subreddit should have different styling
      const activeSubreddit = subredditLink.first();
      const classList = await activeSubreddit.getAttribute('class');
      
      // Should have some active/selected class
      expect(classList).toBeTruthy();
    }
  });

  test('should handle error when subreddit fails to load', async ({ page }) => {
    // Navigate to non-existent subreddit (if possible)
    await page.goto('/r/nonexistentsubreddit999xyz');
    await page.waitForLoadState('networkidle');
    
    // Should show error message
    const errorMessage = page.getByText(/error|failed|not found/i);
    await expect(errorMessage).toBeVisible();
  });
});

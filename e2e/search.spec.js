import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Search Flow
 * Tests the complete search user journey:
 * - Opening the application
 * - Performing a search
 * - Viewing search results
 * - Opening post details
 */
test.describe('Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial load
    await page.waitForLoadState('networkidle');
  });

  test('should display search input in header', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    // Type search query
    await searchInput.fill('javascript');
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    
    // Verify URL changed to search
    expect(page.url()).toContain('/search');
    
    // Verify results are displayed
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should show loading state during search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    await searchInput.fill('react');
    await searchInput.press('Enter');
    
    // Should show loading skeleton
    const skeleton = page.locator('[data-testid="post-skeleton"]');
    await expect(skeleton.first()).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    // Search for something unlikely to have results
    await searchInput.fill('xyzabc123nonexistent999');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    // Should show "no results" message
    const noResults = page.getByText(/no posts found/i);
    await expect(noResults).toBeVisible();
  });

  test('should open post detail from search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    await searchInput.fill('programming');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    // Click first post
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // Should open modal with post details
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Should show comments
    const commentsSection = page.getByText(/comments/i);
    await expect(commentsSection).toBeVisible();
  });

  test('should close modal and return to search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    await searchInput.fill('technology');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    // Open post
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // Close modal
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();
    
    // Should still be on search page
    expect(page.url()).toContain('/search');
    
    // Results should still be visible
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should clear search when navigating away', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    // Perform search
    await searchInput.fill('web development');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/search');
    
    // Navigate to home
    const homeLink = page.getByRole('link', { name: /home/i });
    await homeLink.click();
    
    await page.waitForLoadState('networkidle');
    
    // Search input should be cleared
    await expect(searchInput).toHaveValue('');
  });

  test('should maintain search query in URL', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    
    await searchInput.fill('python');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    // URL should contain search query
    expect(page.url()).toContain('python');
    
    // Reload page
    await page.reload();
    
    // Search results should persist
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });
});

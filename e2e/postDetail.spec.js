import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Post Detail Modal
 * Tests post detail view functionality:
 * - Opening post details
 * - Viewing comments
 * - Modal interactions
 * - Navigation within modal
 */
test.describe('Post Detail Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open post detail modal when clicking post', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('should display post content in modal', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    
    // Get post title before clicking
    const postTitle = await firstPost.locator('h2, h3').first().textContent();
    
    await firstPost.click();
    
    // Modal should show the same title
    const modal = page.locator('[role="dialog"]');
    await expect(modal.getByText(postTitle)).toBeVisible();
  });

  test('should load and display comments', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    await page.waitForLoadState('networkidle');
    
    // Should show comments section
    const commentsHeading = page.getByRole('heading', { name: /comments/i });
    await expect(commentsHeading).toBeVisible();
  });

  test('should show loading state for comments', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // Should show loading indicator initially
    const loadingIndicator = page.locator('[data-testid="comment-skeleton"], .animate-pulse');
    await expect(loadingIndicator.first()).toBeVisible();
  });

  test('should close modal with close button', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();
    
    await expect(modal).not.toBeVisible();
  });

  test('should close modal with escape key', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    await page.keyboard.press('Escape');
    
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Click outside modal (backdrop)
    await page.mouse.click(10, 10);
    
    await expect(modal).not.toBeVisible();
  });

  test('should update URL when opening modal', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // URL should reflect modal is open
    expect(page.url()).toContain('/post/');
  });

  test('should navigate directly to post detail via URL', async ({ page }) => {
    // First, get a post ID
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const currentUrl = page.url();
    
    // Navigate away
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Navigate directly to the post URL
    await page.goto(currentUrl);
    
    // Modal should be open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('should display post metadata in modal', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    const modal = page.locator('[role="dialog"]');
    
    // Should show author, score, and time
    await expect(modal.locator('[data-testid="post-author"],')).toBeVisible();
    await expect(modal.locator('[data-testid="post-score"]')).toBeVisible();
  });
});

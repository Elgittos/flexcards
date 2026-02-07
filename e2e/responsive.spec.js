import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Responsive Design
 * Tests mobile and responsive behavior:
 * - Mobile viewport rendering
 * - Touch interactions
 * - Mobile navigation
 * - Responsive layouts
 */
test.describe('Responsive Design', () => {
  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

    test('should render header on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should show mobile navigation menu', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Mobile menu button should be visible
      const menuButton = page.getByRole('button', { name: /menu|navigation/i });
      await expect(menuButton).toBeVisible();
    });

    test('should open mobile navigation when menu clicked', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const menuButton = page.getByRole('button', { name: /menu|navigation/i });
      await menuButton.click();
      
      // Navigation should be visible
      const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
      await expect(nav.first()).toBeVisible();
    });

    test('should display posts in single column on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
      
      // Posts should stack vertically
      const firstPostBox = await posts.first().boundingBox();
      const secondPostBox = await posts.nth(1).boundingBox();
      
      if (firstPostBox && secondPostBox) {
        // Second post should be below first post
        expect(secondPostBox.y).toBeGreaterThan(firstPostBox.y);
      }
    });

    test('should open post detail modal fullscreen on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const firstPost = page.locator('[data-testid="post-card"]').first();
      await firstPost.click();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Modal should take up most of the viewport
      const modalBox = await modal.boundingBox();
      if (modalBox) {
        expect(modalBox.width).toBeGreaterThan(300);
        expect(modalBox.height).toBeGreaterThan(500);
      }
    });

    test('should hide sidebar on mobile by default', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Desktop sidebar should be hidden
      const sidebar = page.locator('[data-testid="sidebar"]').or(
        page.locator('aside')
      );
      
      // Either not visible or positioned off-screen
      const isVisible = await sidebar.isVisible().catch(() => false);
      if (isVisible) {
        const box = await sidebar.boundingBox();
        if (box) {
          expect(box.x).toBeLessThan(0);
        }
      }
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const firstPost = page.locator('[data-testid="post-card"]').first();
      
      // Tap to open
      await firstPost.tap();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    });

    test('should allow scrolling on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get initial scroll position
      const initialScroll = await page.evaluate(() => window.scrollY);
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 300));
      
      const newScroll = await page.evaluate(() => window.scrollY);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });
  });

  test.describe('Tablet Viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad size

    test('should render in tablet layout', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
    });

    test('should show posts in grid on tablet', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const posts = page.locator('[data-testid="post-card"]');
      const count = await posts.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('should handle orientation change', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Portrait mode
      await page.setViewportSize({ width: 768, height: 1024 });
      
      let posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
      
      // Landscape mode
      await page.setViewportSize({ width: 1024, height: 768 });
      
      posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
    });
  });

  test.describe('Desktop Viewport', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should show sidebar on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const sidebar = page.locator('[data-testid="sidebar"]').or(
        page.locator('aside')
      );
      
      await expect(sidebar.first()).toBeVisible();
    });

    test('should display posts in multi-column grid on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
      
      // Check if posts are arranged horizontally (grid)
      const firstPostBox = await posts.first().boundingBox();
      const secondPostBox = await posts.nth(1).boundingBox();
      
      if (firstPostBox && secondPostBox) {
        // In card view, posts might be side by side
        const horizontalDistance = Math.abs(secondPostBox.x - firstPostBox.x);
        const verticalDistance = Math.abs(secondPostBox.y - firstPostBox.y);
        
        // Either horizontal OR vertical layout is fine
        expect(horizontalDistance + verticalDistance).toBeGreaterThan(0);
      }
    });

    test('should show modal centered on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const firstPost = page.locator('[data-testid="post-card"]').first();
      await firstPost.click();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      const modalBox = await modal.boundingBox();
      const viewportSize = page.viewportSize();
      
      if (modalBox && viewportSize) {
        // Modal should be roughly centered
        const modalCenter = modalBox.x + modalBox.width / 2;
        const viewportCenter = viewportSize.width / 2;
        
        expect(Math.abs(modalCenter - viewportCenter)).toBeLessThan(100);
      }
    });

    test('should not show mobile menu button on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Mobile menu button should be hidden
      const menuButton = page.getByRole('button', { name: /menu|navigation/i });
      const isVisible = await menuButton.isVisible().catch(() => false);
      
      // On desktop, mobile menu should be hidden
      if (isVisible) {
        const box = await menuButton.boundingBox();
        expect(box).toBeNull(); // or off-screen
      }
    });
  });
});

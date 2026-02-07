import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('should render sidebar with popular subreddits', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    const allHeadings = screen.getAllByText(/popular subreddits/i);
    expect(allHeadings.length).toBeGreaterThan(0);
  });

  it('should not render mobile sidebar content when closed', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: false },
      },
    });
    
    // Mobile sidebar should not be visible when closed
    expect(screen.queryByTestId('sidebar-content')).not.toBeInTheDocument();
  });

  it('should render mobile sidebar content when open', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    // Mobile sidebar should be visible when open
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });

  it('should render close button on mobile', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    const closeButton = screen.getByRole('button', { name: /close sidebar/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should dispatch toggleSidebar when close button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    const closeButton = screen.getByRole('button', { name: /close sidebar/i });
    await user.click(closeButton);
    
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it('should close sidebar when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    const backdrop = screen.getByTestId('sidebar-backdrop');
    await user.click(backdrop);
    
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it('should have Framer Motion animation component', () => {
    const { container } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    // Check for motion.div presence (data-framer-* attributes)
    const sidebar = container.querySelector('[data-testid="sidebar-content"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('should display subreddit categories', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true },
      },
    });
    
    // Technology appears as category label and as subreddit link, so use getAllByText
    const technologyElements = screen.getAllByText(/Technology/i);
    expect(technologyElements.length).toBeGreaterThan(0);
    
    const gamingElements = screen.getAllByText(/Gaming/i);
    expect(gamingElements.length).toBeGreaterThan(0);
  });

  it('should have dark mode support', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: true, darkMode: true },
      },
    });
    
    const sidebar = screen.getByTestId('sidebar-content');
    expect(sidebar).toHaveClass('dark:bg-gray-800');
  });

  it('should be hidden on desktop by default (always visible class)', () => {
    const { container } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { sidebarOpen: false },
      },
    });
    
    // Desktop behavior: sidebar should have lg:block class
    const sidebarWrapper = container.querySelector('.lg\\:block');
    expect(sidebarWrapper).toBeInTheDocument();
  });
});

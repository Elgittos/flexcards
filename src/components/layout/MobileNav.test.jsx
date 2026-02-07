import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import MobileNav from './MobileNav';

describe('MobileNav', () => {
  it('should render navigation items', () => {
    renderWithProviders(<MobileNav />);
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/popular/i)).toBeInTheDocument();
    expect(screen.getByText(/menu/i)).toBeInTheDocument();
  });

  it('should be fixed at bottom of screen', () => {
    const { container } = renderWithProviders(<MobileNav />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed', 'bottom-0');
  });

  it('should be hidden on desktop screens', () => {
    const { container } = renderWithProviders(<MobileNav />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('lg:hidden');
  });

  it('should have dark mode support', () => {
    renderWithProviders(<MobileNav />, {
      preloadedState: {
        ui: { darkMode: true },
      },
    });
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700');
  });

  it('should render icons for each navigation item', () => {
    renderWithProviders(<MobileNav />);
    
    const navItems = screen.getAllByRole('button');
    expect(navItems.length).toBeGreaterThanOrEqual(4);
  });

  it('should dispatch toggleSidebar when menu button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<MobileNav />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    expect(store.getState().ui.sidebarOpen).toBe(true);
  });

  it('should have accessible button labels', () => {
    renderWithProviders(<MobileNav />);
    
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /popular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('should support active state highlighting', () => {
    renderWithProviders(<MobileNav />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toHaveClass('text-orange-500');
  });

  it('should have proper responsive spacing', () => {
    const { container } = renderWithProviders(<MobileNav />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('px-4', 'py-2');
  });
});

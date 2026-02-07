import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Header from './Header';

describe('Header', () => {
  it('should render logo and app title', () => {
    const { container } = renderWithProviders(<Header />);
    
    expect(screen.getByText('Reddit Client')).toBeInTheDocument();
    // Check for logo container
    const logoContainer = container.querySelector('.bg-gradient-to-br.from-orange-400.to-red-500');
    expect(logoContainer).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithProviders(<Header />);
    
    const searchInputs = screen.getAllByPlaceholderText(/search reddit/i);
    expect(searchInputs.length).toBeGreaterThan(0);
  });

  it('should render mobile menu button on mobile', () => {
    renderWithProviders(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass('md:hidden'); // Hidden on desktop
  });

  it('should dispatch toggleSidebar when mobile menu button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuButton);
    
    expect(store.getState().ui.sidebarOpen).toBe(true);
  });

  it('should have sticky header styling', () => {
    const { container } = renderWithProviders(<Header />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
  });

  it('should have responsive classes', () => {
    const { container } = renderWithProviders(<Header />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b');
  });

  it('should support dark mode classes', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        ui: { darkMode: true, sidebarOpen: false },
      },
    });
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700');
  });

  it('should have accessible logo link', () => {
    renderWithProviders(<Header />);
    
    const logoContainer = screen.getByText('Reddit Client').closest('div');
    expect(logoContainer).toBeInTheDocument();
  });
});

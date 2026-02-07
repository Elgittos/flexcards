import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for Service Worker Registration
 * 
 * These tests verify the PWA service worker registration logic
 * including browser support detection, production/development behavior,
 * registration success/failure handling, and unregistration.
 */

describe('registerServiceWorker', () => {
  let registerServiceWorker;
  let unregister;
  let originalEnv;
  let originalNavigator;

  beforeEach(async () => {
    // Save original values
    originalEnv = import.meta.env.MODE;
    originalNavigator = global.navigator;

    // Reset modules to get fresh imports
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original values
    import.meta.env.MODE = originalEnv;
    global.navigator = originalNavigator;
    vi.clearAllMocks();
  });

  describe('Browser Support Detection', () => {
    it('should not register if service worker is not supported', async () => {
      // Mock navigator without serviceWorker
      global.navigator = {};
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { registerServiceWorker } = await import('./registerServiceWorker');
      const result = await registerServiceWorker();

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should detect service worker support in navigator', async () => {
      import.meta.env.MODE = 'production';
      global.navigator = {
        serviceWorker: {
          register: vi.fn().mockResolvedValue({ 
            scope: '/',
            addEventListener: vi.fn()
          })
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      const result = await registerServiceWorker();

      expect(result).toBeTruthy();
    });
  });

  describe('Production vs Development Behavior', () => {
    it('should register service worker in production mode', async () => {
      import.meta.env.MODE = 'production';
      const registerMock = vi.fn().mockResolvedValue({
        scope: '/',
        installing: null,
        waiting: null,
        active: { state: 'activated' }
      });

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      await registerServiceWorker();

      expect(registerMock).toHaveBeenCalled();
    });

    it('should not register service worker in development mode by default', async () => {
      import.meta.env.MODE = 'development';
      const registerMock = vi.fn().mockResolvedValue({ scope: '/' });

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      await registerServiceWorker();

      expect(registerMock).not.toHaveBeenCalled();
    });

    it('should allow forced registration in development when enabled', async () => {
      import.meta.env.MODE = 'development';
      const registerMock = vi.fn().mockResolvedValue({ scope: '/' });

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      await registerServiceWorker({ forceEnable: true });

      expect(registerMock).toHaveBeenCalled();
    });
  });

  describe('Registration Success', () => {
    it('should successfully register service worker and return registration', async () => {
      import.meta.env.MODE = 'production';
      const mockRegistration = {
        scope: '/',
        installing: null,
        waiting: null,
        active: { state: 'activated' },
        addEventListener: vi.fn()
      };
      const registerMock = vi.fn().mockResolvedValue(mockRegistration);

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      const result = await registerServiceWorker();

      expect(result).toEqual(mockRegistration);
      expect(registerMock).toHaveBeenCalledWith('/sw.js', expect.any(Object));
    });

    it('should log registration success in development', async () => {
      import.meta.env.MODE = 'production';
      import.meta.env.DEV = true;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const registerMock = vi.fn().mockResolvedValue({ 
        scope: '/',
        addEventListener: vi.fn()
      });

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      await registerServiceWorker();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Service Worker registered with scope:',
        '/'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Registration Failure', () => {
    it('should handle registration errors gracefully', async () => {
      import.meta.env.MODE = 'production';
      const error = new Error('Registration failed');
      const registerMock = vi.fn().mockRejectedValue(error);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      const result = await registerServiceWorker();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Service Worker registration failed'),
        error
      );
      consoleErrorSpy.mockRestore();
    });

    it('should return null on registration failure', async () => {
      import.meta.env.MODE = 'production';
      const registerMock = vi.fn().mockRejectedValue(new Error('Network error'));

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const { registerServiceWorker } = await import('./registerServiceWorker');
      const result = await registerServiceWorker();

      expect(result).toBeNull();
    });
  });

  describe('Service Worker Unregistration', () => {
    it('should unregister all service workers', async () => {
      const unregisterMock = vi.fn().mockResolvedValue(true);
      const mockRegistrations = [
        { unregister: unregisterMock },
        { unregister: unregisterMock }
      ];

      global.navigator = {
        serviceWorker: {
          getRegistrations: vi.fn().mockResolvedValue(mockRegistrations)
        }
      };

      const { unregister } = await import('./registerServiceWorker');
      await unregister();

      expect(unregisterMock).toHaveBeenCalledTimes(2);
    });

    it('should handle unregistration when service worker is not supported', async () => {
      global.navigator = {};

      const { unregister } = await import('./registerServiceWorker');
      const result = await unregister();

      expect(result).toBeUndefined();
    });

    it('should handle unregistration errors gracefully', async () => {
      const unregisterMock = vi.fn().mockRejectedValue(new Error('Unregister failed'));
      global.navigator = {
        serviceWorker: {
          getRegistrations: vi.fn().mockResolvedValue([
            { unregister: unregisterMock }
          ])
        }
      };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { unregister } = await import('./registerServiceWorker');
      await unregister();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Update Notification', () => {
    it('should provide callback for service worker updates', async () => {
      import.meta.env.MODE = 'production';
      const updateCallback = vi.fn();
      const mockRegistration = {
        scope: '/',
        installing: null,
        waiting: { state: 'installed' },
        active: { state: 'activated' },
        addEventListener: vi.fn()
      };
      const registerMock = vi.fn().mockResolvedValue(mockRegistration);

      global.navigator = {
        serviceWorker: {
          register: registerMock
        }
      };

      const { registerServiceWorker } = await import('./registerServiceWorker');
      await registerServiceWorker({ onUpdate: updateCallback });

      // Check if update listener was added
      expect(mockRegistration.addEventListener).toHaveBeenCalled();
    });
  });
});

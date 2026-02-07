/**
 * Service Worker Registration
 * 
 * Handles registration, updates, and unregistration of the PWA service worker.
 * Only registers in production mode unless explicitly enabled for development.
 */

/**
 * Registers the service worker for the PWA
 * @param {Object} options - Registration options
 * @param {boolean} options.forceEnable - Force enable in development mode
 * @param {Function} options.onUpdate - Callback when an update is available
 * @returns {Promise<ServiceWorkerRegistration|null>} Registration object or null
 */
export async function registerServiceWorker(options = {}) {
  const { forceEnable = false, onUpdate } = options;

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    if (import.meta.env.DEV) {
      console.log('Service Worker not supported in this browser');
    }
    return null;
  }

  // Only register in production mode unless forced
  const isProd = import.meta.env.MODE === 'production';
  if (!isProd && !forceEnable) {
    if (import.meta.env.DEV) {
      console.log('Service Worker registration skipped in development mode');
    }
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    if (import.meta.env.DEV) {
      console.log('Service Worker registered with scope:', registration.scope);
    }

    // Handle updates
    if (registration.addEventListener) {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker && newWorker.addEventListener) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              if (import.meta.env.DEV) {
                console.log('New service worker available');
              }
              if (onUpdate) {
                onUpdate(registration);
              }
            }
          });
        }
      });
    }

    // Check for waiting service worker
    if (registration.waiting && onUpdate) {
      onUpdate(registration);
    }

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregisters all service workers
 * Useful for cleanup or disabling PWA features
 */
export async function unregister() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
    }

    if (import.meta.env.DEV) {
      console.log('All service workers unregistered');
    }
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
}

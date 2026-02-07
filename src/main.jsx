import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { registerServiceWorker } from './utils/registerServiceWorker';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
// Only registers in production mode unless explicitly enabled
registerServiceWorker({
  onUpdate: (registration) => {
    // Handle service worker updates
    // In a real app, you might show a notification to the user
    if (import.meta.env.DEV) {
      console.log('New app version available. Reload to update.');
    }
    
    // Optional: Auto-reload on update (can be made user-controlled)
    // registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    // window.location.reload();
  }
});

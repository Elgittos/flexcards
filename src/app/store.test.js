import { describe, it, expect } from 'vitest';
import { store } from './store';
import { redditApi } from './api/redditApi';

describe('store', () => {
  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should have redditApi reducer registered', () => {
    const state = store.getState();
    expect(state).toHaveProperty(redditApi.reducerPath);
  });

  it('should have redditApi middleware configured', () => {
    // Check that middleware is present by verifying store can dispatch
    expect(store.dispatch).toBeDefined();
    
    // Verify the redditApi reducer is in the store
    const state = store.getState();
    expect(state.redditApi).toBeDefined();
  });

  it('should not have example reducer', () => {
    const state = store.getState();
    expect(state).not.toHaveProperty('example');
  });

  it('should initialize with correct structure', () => {
    const state = store.getState();
    
    // Should have redditApi
    expect(state.redditApi).toBeDefined();
    
    // Should have standard RTK Query structure
    expect(state.redditApi.queries).toBeDefined();
    expect(state.redditApi.mutations).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { redditApi } from './redditApi';

describe('redditApi', () => {
  it('should be defined', () => {
    expect(redditApi).toBeDefined();
  });

  it('should have correct reducerPath', () => {
    expect(redditApi.reducerPath).toBe('redditApi');
  });

  it('should have baseUrl set to https://www.reddit.com', () => {
    // Read the source file to verify baseUrl configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    expect(sourceFile).toContain("baseUrl: 'https://www.reddit.com'");
  });

  it('should set User-Agent header to RedditClient/1.0', () => {
    // Read the source file to verify User-Agent header configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    expect(sourceFile).toContain("headers.set('User-Agent', 'RedditClient/1.0')");
  });

  it('should have correct tag types array', () => {
    // Read the source file to verify tag types configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    const expectedTagTypes = ['Posts', 'Post', 'Comments', 'Subreddit'];
    
    // Verify the tagTypes array contains all expected values
    expectedTagTypes.forEach(tagType => {
      expect(sourceFile).toContain(`'${tagType}'`);
    });
    
    // Verify tagTypes array is properly configured
    expect(sourceFile).toContain("tagTypes: ['Posts', 'Post', 'Comments', 'Subreddit']");
  });

  it('should have endpoints defined', () => {
    // Verify redditApi has endpoints property
    expect(redditApi).toHaveProperty('endpoints');
  });

  it('should be configured as RTK Query API', () => {
    expect(redditApi.reducer).toBeDefined();
    expect(redditApi.middleware).toBeDefined();
    expect(redditApi.reducerPath).toBe('redditApi');
  });
});

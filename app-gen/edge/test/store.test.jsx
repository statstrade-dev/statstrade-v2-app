import { describe, it, expect } from 'vitest';
import { getStore } from '../src/global-store';

describe('global-store', () => {
  it('should be defined', () => {
    expect(getStore).toBeDefined();
    expect(typeof getStore).toBe('function');
  });
});

import { logUserAction } from './firebase';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn(() => {
    throw new Error('Analytics failed');
  }),
}));

describe('Firebase Service', () => {
  test('logUserAction does not throw if analytics fails', () => {
    // In Vitest ESM, spying on internal catch blocks can be tricky
    // We just want to ensure it doesn't crash the main thread
    expect(() => logUserAction('test_event')).not.toThrow();
  });
});

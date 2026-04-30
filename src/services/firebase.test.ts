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
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // The module is already mocked to throw
    logUserAction('test_event');
    expect(consoleSpy).toHaveBeenCalledWith("Analytics error", expect.any(Error));

    consoleSpy.mockRestore();
  });
});

import { getElectionResponse } from './gemini';
import { vi } from 'vitest';

// We just test the fallback mock since testing actual API would require a real key and network
describe('gemini service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return mock response for hello when API key is missing', async () => {
    const promise = getElectionResponse('hello');
    vi.runAllTimers();
    const result = await promise;
    expect(result).toContain('Namaste! I am your Votify Assistant.');
  });

  test('should return mock response for register', async () => {
    const promise = getElectionResponse('how to register?');
    vi.runAllTimers();
    const result = await promise;
    expect(result).toContain('Form 6');
  });

  test('should return default mock response for unknown queries', async () => {
    const promise = getElectionResponse('what is the meaning of life?');
    vi.runAllTimers();
    const result = await promise;
    expect(result).toContain('I am operating in demonstration mode');
  });
});

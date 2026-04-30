import { getElectionResponse } from './gemini';
import { vi } from 'vitest';
import * as geminiModule from './gemini';

// Mock the module
vi.mock('@google/generative-ai', () => {
  const mockChat = {
    sendMessage: vi.fn(),
  };
  const mockModel = {
    startChat: vi.fn().mockReturnValue(mockChat),
  };
  const mockGenAI = {
    getGenerativeModel: vi.fn().mockReturnValue(mockModel),
  };
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return mockGenAI;
    })
  };
});
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
    const promise = geminiModule.getElectionResponse('what is the meaning of life?');
    vi.runAllTimers();
    const result = await promise;
    expect(result).toContain('I am operating in demonstration mode');
  });

  describe('when API key is present (mocked)', () => {
    let originalGenAI: any;

    beforeEach(() => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
    });

    test('should handle successful API response', async () => {
      // Re-initialize module with API KEY set
      vi.resetModules();
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      const { getElectionResponse } = await import('./gemini');
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      const mockSendMessage = vi.fn().mockResolvedValue({
        response: { text: () => 'Real API response' }
      });
      
      const genAIInstance = new GoogleGenerativeAI('test-key');
      const model = genAIInstance.getGenerativeModel({ model: 'gemini-1.5-pro' });
      vi.mocked(model.startChat).mockReturnValue({ sendMessage: mockSendMessage } as any);

      const result = await getElectionResponse('how to vote?');
      expect(result).toBe('Real API response');
    });

    test('should handle API errors', async () => {
      vi.resetModules();
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      const { getElectionResponse } = await import('./gemini');
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      const mockSendMessage = vi.fn().mockRejectedValue(new Error('API Failure'));
      
      const genAIInstance = new GoogleGenerativeAI('test-key');
      const model = genAIInstance.getGenerativeModel({ model: 'gemini-1.5-pro' });
      vi.mocked(model.startChat).mockReturnValue({ sendMessage: mockSendMessage } as any);

      const result = await getElectionResponse('how to vote?');
      expect(result).toContain('network issue');
    });
  });
});

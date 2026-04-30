import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';
import { vi, describe, test, expect } from 'vitest';

vi.mock('../services/gemini', () => ({
  getElectionResponse: vi.fn().mockResolvedValue('Mock AI response'),
}));

vi.mock('../services/firebase', () => ({
  logUserAction: vi.fn(),
}));

describe('useChat hook', () => {
  test('should initialize with welcome message', () => {
    const { result } = renderHook(() => useChat('Welcome'));
    expect(result.current.messages[0].text).toBe('Welcome');
  });

  test('should send message and update history', async () => {
    const { result } = renderHook(() => useChat('Welcome'));
    
    await act(async () => {
      await result.current.sendMessage('Hello', 'en');
    });

    expect(result.current.messages.length).toBe(3); // welcome + user + model
    expect(result.current.messages[1].text).toBe('Hello');
    expect(result.current.messages[2].text).toBe('Mock AI response');
  });

  test('should clear chat', () => {
    const { result } = renderHook(() => useChat('Welcome'));
    
    act(() => {
      result.current.clearChat('New Welcome');
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].text).toBe('New Welcome');
  });
});

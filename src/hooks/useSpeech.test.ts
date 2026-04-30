import { renderHook, act } from '@testing-library/react';
import { useSpeech } from './useSpeech';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

describe('useSpeech hook', () => {
  beforeEach(() => {
    // Mock speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: vi.fn(),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      },
      writable: true,
    });
    (window as any).SpeechSynthesisUtterance = vi.fn().mockImplementation(function(text) {
      this.text = text;
      this.lang = '';
      this.onstart = null;
      this.onend = null;
      this.onerror = null;
    });
  });

  test('should handle speaking', () => {
    const { result } = renderHook(() => useSpeech('en'));
    
    act(() => {
      result.current.speak('Hello');
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  test('should handle stopping', () => {
    const { result } = renderHook(() => useSpeech('en'));
    
    act(() => {
      result.current.stopSpeaking();
    });

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });
});

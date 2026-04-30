import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatAssistant from './ChatAssistant';
import { LanguageProvider } from '../context/LanguageContext';
import * as geminiService from '../services/gemini';
import { vi } from 'vitest';

// Mock gemini service
vi.mock('../services/gemini', () => ({
  getElectionResponse: vi.fn(),
}));

describe('ChatAssistant Component', () => {
  const renderWithProvider = () => {
    return render(
      <LanguageProvider>
        <ChatAssistant />
      </LanguageProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock SpeechSynthesis
    global.window.speechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      pending: false,
      speaking: false,
      paused: false,
      onvoiceschanged: null,
    } as any;
    
    global.SpeechSynthesisUtterance = vi.fn() as any;
    
    // Mock SpeechRecognition
    const mockSpeechRecognition = vi.fn().mockImplementation(function() {
      return {
        start: vi.fn(),
        stop: vi.fn(),
        lang: '',
      };
    });
    (global.window as any).SpeechRecognition = mockSpeechRecognition;
    (global.window as any).webkitSpeechRecognition = mockSpeechRecognition;
    global.window.alert = vi.fn();
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  test('renders welcome message', () => {
    renderWithProvider();
    expect(screen.getByText(/Namaste! I am Votify/i)).toBeInTheDocument();
  });

  test('can type and send a message', async () => {
    vi.mocked(geminiService.getElectionResponse).mockResolvedValue('This is a mock response from Gemini');
    
    renderWithProvider();
    
    const input = screen.getByPlaceholderText(/Ask about the Indian election process/i);
    const sendButton = screen.getByRole('button', { name: 'Send message' });
    
    fireEvent.change(input, { target: { value: 'How to vote?' } });
    expect(input).toHaveValue('How to vote?');
    
    // Find the form and submit it
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    // User message should appear
    expect(screen.getByText('How to vote?')).toBeInTheDocument();
    
    // Wait for the mock response
    await waitFor(() => {
      expect(screen.getByText('This is a mock response from Gemini')).toBeInTheDocument();
    });
  });

  test('can toggle microphone and handle speech recognition', async () => {
    renderWithProvider();
    
    // Test microphone toggle
    const micButton = screen.getByRole('button', { name: /^Speak$/i });
    fireEvent.click(micButton);
    expect(micButton).toHaveClass('listening');
    
    // Click again to stop
    fireEvent.click(micButton);
    expect(micButton).not.toHaveClass('listening');
  });

  test('can trigger speech synthesis', async () => {
    renderWithProvider();
    
    // We already have a welcome message model response
    const speakButtons = screen.getAllByRole('button', { name: /Read message aloud/i });
    expect(speakButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(speakButtons[0]);
    expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
  });

  test('handles API errors gracefully', async () => {
    vi.mocked(geminiService.getElectionResponse).mockResolvedValue('Error: Network issue');
    
    renderWithProvider();
    
    const input = screen.getByPlaceholderText(/Ask about the Indian election process/i);
    fireEvent.change(input, { target: { value: 'Trigger error' } });
    
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    // Wait for the error response
    await waitFor(() => {
      expect(screen.getByText('Error: Network issue')).toBeInTheDocument();
    });
  });

  test('cleans up speech synthesis and recognition on unmount', () => {
    const { unmount } = renderWithProvider();
    
    // Set listening to true
    const micButton = screen.getByRole('button', { name: /^Speak$/i });
    fireEvent.click(micButton);
    
    unmount();
    
    expect(global.window.speechSynthesis.cancel).toHaveBeenCalled();
  });
});

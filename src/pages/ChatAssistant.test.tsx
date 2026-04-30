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
    render(
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
});

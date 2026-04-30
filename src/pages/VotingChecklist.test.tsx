import { render, screen, fireEvent } from '@testing-library/react';
import { useEffect } from 'react';
import VotingChecklist from './VotingChecklist';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

describe('VotingChecklist Component', () => {
  const renderWithProvider = (initialLang: 'en' | 'hi' = 'en') => {
    // We can't easily force LanguageProvider initial state here without altering the component,
    // so we render the provider and a button to toggle it if needed, or we just render the tree.
    render(
      <LanguageProvider>
        <TestWrapper initialLang={initialLang} />
      </LanguageProvider>
    );
  };

  const TestWrapper = ({ initialLang }: { initialLang: 'en' | 'hi' }) => {
    const { toggleLanguage, language } = useLanguage();
    
    useEffect(() => {
      // Force language if it doesn't match
      if (language !== initialLang) {
        toggleLanguage();
      }
    }, [initialLang, language, toggleLanguage]);
    return <VotingChecklist />;
  };

  test('renders the title correctly', () => {
    renderWithProvider();
    expect(screen.getByText('Voting Day Checklist')).toBeInTheDocument();
  });

  test('renders all checklist items in English by default', () => {
    renderWithProvider();
    expect(screen.getByText('Do you have your Voter ID (EPIC) or another valid ID?')).toBeInTheDocument();
    expect(screen.getByText('Have you checked your name in the Voter List?')).toBeInTheDocument();
    expect(screen.getByText('Do you know where your Polling Booth is?')).toBeInTheDocument();
    expect(screen.getByText('Are you ready to press the blue button on the EVM?')).toBeInTheDocument();
  });

  test('can check and uncheck items', () => {
    renderWithProvider();
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true }); // using hidden because custom styling hides the actual input
    expect(checkboxes.length).toBe(4);
    
    // Check first item
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    // Uncheck first item
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  test('renders all checklist items in Hindi', () => {
    renderWithProvider('hi');
    expect(screen.getByText('मतदान के दिन की चेकलिस्ट')).toBeInTheDocument();
    expect(screen.getByText('क्या आपके पास अपना वोटर आईडी (EPIC) या अन्य वैध आईडी है?')).toBeInTheDocument();
  });
});

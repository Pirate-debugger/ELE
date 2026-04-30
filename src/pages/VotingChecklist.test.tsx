import { render, screen } from '@testing-library/react';
import VotingChecklist from './VotingChecklist';
import { LanguageProvider } from '../context/LanguageContext';

describe('VotingChecklist Component', () => {
  const renderWithProvider = () => {
    render(
      <LanguageProvider>
        <VotingChecklist />
      </LanguageProvider>
    );
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
});

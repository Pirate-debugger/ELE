import { render, screen } from '@testing-library/react';
import ProcessTimeline from './ProcessTimeline';

describe('ProcessTimeline Component', () => {
  test('renders the title correctly', () => {
    render(<ProcessTimeline />);
    expect(screen.getByText(/Electoral Process/i)).toBeInTheDocument();
  });

  test('renders all 6 steps', () => {
    render(<ProcessTimeline />);
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Verify Name in Voter List')).toBeInTheDocument();
    expect(screen.getByText('Find Your Polling Station')).toBeInTheDocument();
    expect(screen.getByText('Know Your Candidates')).toBeInTheDocument();
    expect(screen.getByText('Voting Day Preparation')).toBeInTheDocument();
    expect(screen.getByText('Cast Your Vote')).toBeInTheDocument();
  });
});

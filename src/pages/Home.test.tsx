import { render, screen } from '@testing-library/react';
import Home from './Home';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

describe('Home Component', () => {
  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  test('renders hero section correctly', () => {
    renderWithProviders();
    expect(screen.getByText(/Your Voice, Your Power:/)).toBeInTheDocument();
  });
});

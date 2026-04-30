import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';

describe('App Component', () => {
  it('renders Votify India header', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    );
    const headerElement = screen.getByText(/Votify India/i);
    expect(headerElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Process Timeline/i)).toBeInTheDocument();
    expect(screen.getAllByText(/AI Assistant/i).length).toBeGreaterThan(0);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { vi } from 'vitest';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const ThrowError = () => {
    throw new Error('Test Error');
  };

  test('catches error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops, something went wrong.')).toBeInTheDocument();
  });

  test('renders children if no error', () => {
    render(
      <ErrorBoundary>
        <div>Everything is fine</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  test('reloads page on button click', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const btn = screen.getByRole('button', { name: /Refresh Page/i });
    fireEvent.click(btn);
    expect(reloadMock).toHaveBeenCalled();
  });
});

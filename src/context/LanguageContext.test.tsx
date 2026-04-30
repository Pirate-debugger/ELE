import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

const TestComponent = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translated">{t('home')}</span>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
};

describe('LanguageContext', () => {
  test('provides default language and translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('translated').textContent).toBe('Home');
  });

  test('toggles language correctly', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const button = screen.getByText('Toggle');
    fireEvent.click(button);
    
    expect(screen.getByTestId('lang').textContent).toBe('hi');
    expect(screen.getByTestId('translated').textContent).toBe('होम');
  });

  test('returns key if translation not found', () => {
    const ComponentWithMissingKey = () => {
      const { t } = useLanguage();
      return <span>{t('missing_key')}</span>;
    };

    render(
      <LanguageProvider>
        <ComponentWithMissingKey />
      </LanguageProvider>
    );

    expect(screen.getByText('missing_key')).toBeInTheDocument();
  });
});

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '2rem', textAlign: 'center', marginTop: '10vh' }}>
          <h2>Oops, something went wrong.</h2>
          <p>We apologize for the inconvenience. Please refresh the page or try again later.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

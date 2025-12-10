import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // TODO: Send error to logging service (Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-light text-center text-primary-900 mb-4">
              Oups ! Une erreur est survenue
            </h1>

            {/* Description */}
            <p className="text-center text-primary-600 mb-8">
              Nous sommes désolés, quelque chose s'est mal passé. Nos équipes ont été notifiées et travaillent à résoudre le problème.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 overflow-auto max-h-64">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Détails de l'erreur (dev only):
                </h3>
                <pre className="text-xs text-red-600 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-600 cursor-pointer">
                      Stack trace
                    </summary>
                    <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-6 py-3 bg-primary-900 text-white hover:bg-primary-800 transition-colors duration-200 uppercase tracking-wide"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Recharger la page
              </button>

              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 border-2 border-primary-900 text-primary-900 hover:bg-primary-50 transition-colors duration-200 uppercase tracking-wide"
              >
                <Home className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Link>
            </div>

            {/* Support Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Si le problème persiste, contactez notre{' '}
                <a
                  href="mailto:support@tkbshop.com"
                  className="text-primary-600 hover:text-primary-800 underline"
                >
                  support client
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

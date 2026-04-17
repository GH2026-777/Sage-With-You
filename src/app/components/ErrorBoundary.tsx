/**
 * Error Boundary Component
 * Catches React errors and prevents app crashes
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '1rem'
            }}>
              😔
            </div>
            
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#DC2626',
              marginBottom: '0.5rem'
            }}>
              Something went wrong
            </h2>
            
            <p style={{
              color: '#6B7280',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              Don't worry, your data is safe. Try refreshing the page or going back.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details style={{
                marginBottom: '1.5rem',
                textAlign: 'left',
                background: '#FEF2F2',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #FCA5A5'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#DC2626',
                  marginBottom: '0.5rem'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  fontSize: '0.75rem',
                  color: '#991B1B',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.history.back()}
                style={{
                  background: 'white',
                  color: '#0D9488',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '2px solid #0D9488',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                Go Back
              </button>
            </div>
            
            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: '#9CA3AF'
            }}>
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

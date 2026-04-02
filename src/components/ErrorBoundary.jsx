import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-border shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">Something went wrong</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              An unexpected error occurred. We've been notified and are looking into it.
            </p>
            <Button 
              className="w-full gap-2 py-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw size={18} />
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

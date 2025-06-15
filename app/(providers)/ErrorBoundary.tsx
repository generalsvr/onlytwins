'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние, чтобы показать fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем ошибку (например, в сервис мониторинга, вроде Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Выводим красивый fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
               Something went wrong
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Please refresh page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      );
    }

    // Если ошибки нет, рендерим дочерние компоненты
    return this.props.children;
  }
}

export default ErrorBoundary;

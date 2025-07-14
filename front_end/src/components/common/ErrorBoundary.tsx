import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Salva informações do erro para debugging
    this.setState({
      error,
      errorInfo
    })
    
    // Aqui você pode enviar o erro para um serviço de monitoramento
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  handleRetry = () => {
    // Reseta o estado para tentar novamente
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Se foi passado um fallback customizado, use ele
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Caso contrário, mostra a UI de erro padrão
      return (
        <ErrorFallback 
          error={this.state.error} 
          onRetry={this.handleRetry}
          errorInfo={this.state.errorInfo}
        />
      )
    }

    return this.props.children
  }
}

// Componente de fallback quando ocorre erro
interface ErrorFallbackProps {
  error?: Error
  onRetry?: () => void
  errorInfo?: ErrorInfo
}

const ErrorFallback = ({ error, onRetry, errorInfo }: ErrorFallbackProps) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Ícone de erro */}
        <div className="text-6xl mb-4">🚨</div>
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Algo deu errado
        </h1>
        
        {/* Mensagem */}
        <p className="text-gray-600 mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
        </p>
        
        {/* Detalhes do erro (só em desenvolvimento) */}
        {isDevelopment && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Detalhes do Erro:</h3>
            <pre className="text-sm text-red-700 overflow-x-auto">
              {error.message}
            </pre>
            {errorInfo && (
              <details className="mt-2">
                <summary className="cursor-pointer text-red-800 font-medium">
                  Stack Trace
                </summary>
                <pre className="text-xs text-red-600 mt-2 overflow-x-auto">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Tentar Novamente
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔄 Recarregar Página
          </button>
        </div>
        
        {/* Link para home */}
        <div className="mt-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            🏠 Voltar para o início
          </a>
        </div>
      </div>
    </div>
  )
}

// Hook para usar ErrorBoundary de forma mais fácil
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

export default ErrorBoundary
export { ErrorFallback } 
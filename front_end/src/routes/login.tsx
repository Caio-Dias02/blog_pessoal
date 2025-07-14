import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthStatus } from '../components/auth/LoginForm'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAuthenticated ? 'Perfil do Usuário' : 'Entre na sua conta'}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAuthenticated 
              ? 'Informações do seu perfil' 
              : 'Acesse sua conta para continuar'
            }
          </p>
        </div>
        <AuthStatus />
      </div>
    </div>
  )
} 
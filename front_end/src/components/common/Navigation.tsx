import { Link } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span>🚀</span>
            <span>Blog Pessoal</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              activeProps={{
                className: 'text-blue-600 font-semibold'
              }}
            >
              Home
            </Link>
            <Link 
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              activeProps={{
                className: 'text-blue-600 font-semibold'
              }}
            >
              Sobre
            </Link>
            
            {/* Admin link - apenas para usuários autenticados */}
            {isAuthenticated && (
              <Link 
                to="/admin"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                activeProps={{
                  className: 'text-blue-600 font-semibold'
                }}
              >
                ⚙️ Admin
              </Link>
            )}
            
            {/* GitHub link */}
            <a 
              href="https://github.com/Caio-Dias02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.avatar && (
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
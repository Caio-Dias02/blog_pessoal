import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi, AuthManager, type LoginData, type UserProfile } from '../services/api'

// Tipos para o contexto de autenticação
interface AuthContextData {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Contexto de autenticação
const AuthContext = createContext<AuthContextData | undefined>(undefined)

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Provider de autenticação
interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário está autenticado
  const isAuthenticated = user !== null

  // Função para carregar o perfil do usuário
  const loadUserProfile = async () => {
    try {
      if (AuthManager.isAuthenticated()) {
        const profile = await authApi.getProfile()
        setUser(profile)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      // Se houver erro, provavelmente o token é inválido
      AuthManager.removeToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Função de login
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(data)
      
      // Carregar perfil completo do usuário
      const profile = await authApi.getProfile()
      setUser(profile)
      

    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      setIsLoading(true)
      await authApi.logout()
    } catch (error) {
      console.error('Erro no logout:', error)
      // Mesmo se houver erro, vamos fazer logout local
    } finally {
      setUser(null)
      setIsLoading(false)

    }
  }

  // Função para atualizar o perfil do usuário
  const refreshProfile = async () => {
    if (!AuthManager.isAuthenticated()) {
      setUser(null)
      return
    }

    try {
      const profile = await authApi.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      // Se houver erro, provavelmente o token é inválido
      AuthManager.removeToken()
      setUser(null)
    }
  }

  // Efeito para carregar o usuário no início
  useEffect(() => {
    loadUserProfile()
  }, [])

  // Valor do contexto
  const value: AuthContextData = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth()
  
  return {
    isAdmin: user?.role === 'ADMIN',
    isModerator: user?.role === 'MODERATOR',
    isUser: user?.role === 'USER',
    canCreatePost: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
    canEditPost: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
    canDeletePost: user?.role === 'ADMIN',
    canManageUsers: user?.role === 'ADMIN',
    canManageCategories: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
    canManageTags: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
  }
} 
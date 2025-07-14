// Cliente de API real para conectar com o backend NestJS
import type { 
  Post, 
  Author, 
  Category,
  PostFilters, 
  FilteredPostsResult, 
  PaginatedPostsResult,
  PostsQueryOptions 
} from '../types/blog'

// Configuração base da API
const API_BASE_URL = 'http://localhost:3001'

// Classe para gerenciar autenticação
class AuthManager {
  private static TOKEN_KEY = 'auth_token'

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

// Classe para fazer requisições HTTP
class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...AuthManager.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado ou inválido
          AuthManager.removeToken()
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Erro de conexão com o servidor')
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Instância do cliente HTTP
const httpClient = new HttpClient(API_BASE_URL)

// ====== AUTHENTICATION API ======

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data)
    AuthManager.setToken(response.access_token)
    return response
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout')
    } finally {
      AuthManager.removeToken()
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    return httpClient.get<UserProfile>('/auth/profile')
  },

  isAuthenticated: (): boolean => {
    return AuthManager.isAuthenticated()
  },
}

// ====== POSTS API ======

export interface CreatePostData {
  title: string
  slug: string
  content: string
  excerpt?: string
  published?: boolean
  featured?: boolean
  image?: string
  readTime?: number
  seoTitle?: string
  seoDescription?: string
  authorId: string
  categoryId: string
  tags?: string[]
}

export interface UpdatePostData {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  published?: boolean
  featured?: boolean
  image?: string
  readTime?: number
  seoTitle?: string
  seoDescription?: string
  categoryId?: string
  tags?: string[]
}

export interface PostListResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const postsApi = {
  // Buscar todos os posts com paginação
  getAll: async (page: number = 1, limit: number = 10): Promise<PostListResponse> => {
    return httpClient.get<PostListResponse>(`/posts?page=${page}&limit=${limit}`)
  },

  // Buscar posts publicados
  getPublished: async (page: number = 1, limit: number = 10): Promise<PostListResponse> => {
    return httpClient.get<PostListResponse>(`/posts/published?page=${page}&limit=${limit}`)
  },

  // Buscar post por ID
  getById: async (id: string): Promise<Post> => {
    return httpClient.get<Post>(`/posts/${id}`)
  },

  // Buscar post por slug
  getBySlug: async (slug: string): Promise<Post> => {
    return httpClient.get<Post>(`/posts/slug/${slug}`)
  },

  // Buscar posts por categoria
  getByCategory: async (categoryId: string, page: number = 1, limit: number = 10): Promise<PostListResponse> => {
    return httpClient.get<PostListResponse>(`/posts/category/${categoryId}?page=${page}&limit=${limit}`)
  },

  // Buscar posts por tag
  getByTag: async (tagId: string, page: number = 1, limit: number = 10): Promise<PostListResponse> => {
    return httpClient.get<PostListResponse>(`/posts/tag/${tagId}?page=${page}&limit=${limit}`)
  },

  // Criar novo post
  create: async (data: CreatePostData): Promise<Post> => {
    return httpClient.post<Post>('/posts', data)
  },

  // Atualizar post
  update: async (id: string, data: UpdatePostData): Promise<Post> => {
    return httpClient.patch<Post>(`/posts/${id}`, data)
  },

  // Deletar post
  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/posts/${id}`)
  },
}

// ====== CATEGORIES API ======

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface UpdateCategoryData {
  name?: string
  slug?: string
  description?: string
  color?: string
}

export interface CategoryWithCount extends Category {
  _count: {
    posts: number
  }
}

export const categoriesApi = {
  // Buscar todas as categorias
  getAll: async (): Promise<Category[]> => {
    return httpClient.get<Category[]>('/categories')
  },

  // Buscar categorias com contagem de posts
  getAllWithCount: async (): Promise<CategoryWithCount[]> => {
    return httpClient.get<CategoryWithCount[]>('/categories/count')
  },

  // Buscar categorias populares
  getPopular: async (limit: number = 10): Promise<CategoryWithCount[]> => {
    return httpClient.get<CategoryWithCount[]>(`/categories/popular?limit=${limit}`)
  },

  // Buscar categoria por ID
  getById: async (id: string): Promise<Category> => {
    return httpClient.get<Category>(`/categories/${id}`)
  },

  // Buscar categoria por slug
  getBySlug: async (slug: string): Promise<Category> => {
    return httpClient.get<Category>(`/categories/slug/${slug}`)
  },

  // Criar nova categoria
  create: async (data: CreateCategoryData): Promise<Category> => {
    return httpClient.post<Category>('/categories', data)
  },

  // Atualizar categoria
  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    return httpClient.patch<Category>(`/categories/${id}`, data)
  },

  // Deletar categoria
  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/categories/${id}`)
  },
}

// ====== TAGS API ======

export interface CreateTagData {
  name: string
  slug: string
}

export interface UpdateTagData {
  name?: string
  slug?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface TagWithCount extends Tag {
  _count: {
    posts: number
  }
}

export const tagsApi = {
  // Buscar todas as tags
  getAll: async (): Promise<Tag[]> => {
    return httpClient.get<Tag[]>('/tags')
  },

  // Buscar tags com contagem de posts
  getAllWithCount: async (): Promise<TagWithCount[]> => {
    return httpClient.get<TagWithCount[]>('/tags/count')
  },

  // Buscar tags populares
  getPopular: async (limit: number = 10): Promise<TagWithCount[]> => {
    return httpClient.get<TagWithCount[]>(`/tags/popular?limit=${limit}`)
  },

  // Buscar tags por termo
  search: async (query: string, limit: number = 10): Promise<Tag[]> => {
    return httpClient.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  },

  // Buscar tag por ID
  getById: async (id: string): Promise<Tag> => {
    return httpClient.get<Tag>(`/tags/${id}`)
  },

  // Buscar tag por slug
  getBySlug: async (slug: string): Promise<Tag> => {
    return httpClient.get<Tag>(`/tags/slug/${slug}`)
  },

  // Criar nova tag
  create: async (data: CreateTagData): Promise<Tag> => {
    return httpClient.post<Tag>('/tags', data)
  },

  // Atualizar tag
  update: async (id: string, data: UpdateTagData): Promise<Tag> => {
    return httpClient.patch<Tag>(`/tags/${id}`, data)
  },

  // Deletar tag
  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/tags/${id}`)
  },
}

// ====== USERS API ======

export interface CreateUserData {
  email: string
  name: string
  password: string
  role?: 'USER' | 'ADMIN' | 'MODERATOR'
  avatar?: string
  bio?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
  role?: 'USER' | 'ADMIN' | 'MODERATOR'
  avatar?: string
  bio?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalUsers: number
  totalAdmins: number
  totalModerators: number
  totalRegularUsers: number
  recentUsers: number
}

export const usersApi = {
  // Buscar todos os usuários
  getAll: async (): Promise<User[]> => {
    return httpClient.get<User[]>('/users')
  },

  // Buscar estatísticas de usuários
  getStats: async (): Promise<UserStats> => {
    return httpClient.get<UserStats>('/users/stats')
  },

  // Buscar usuários mais ativos
  getMostActive: async (limit: number = 10): Promise<User[]> => {
    return httpClient.get<User[]>(`/users/active?limit=${limit}`)
  },

  // Buscar usuários por role
  getByRole: async (role: string): Promise<User[]> => {
    return httpClient.get<User[]>(`/users/role/${role}`)
  },

  // Buscar usuário por ID
  getById: async (id: string): Promise<User> => {
    return httpClient.get<User>(`/users/${id}`)
  },

  // Criar novo usuário
  create: async (data: CreateUserData): Promise<User> => {
    return httpClient.post<User>('/users', data)
  },

  // Atualizar usuário
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    return httpClient.patch<User>(`/users/${id}`, data)
  },

  // Alterar senha
  changePassword: async (id: string, data: ChangePasswordData): Promise<{ message: string }> => {
    return httpClient.patch<{ message: string }>(`/users/${id}/password`, data)
  },

  // Deletar usuário
  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/users/${id}`)
  },
}

// Export do AuthManager para usar em outros lugares
export { AuthManager }

// Export de um cliente geral para casos especiais
export { httpClient } 
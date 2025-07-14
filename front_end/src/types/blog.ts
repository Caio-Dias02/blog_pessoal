export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  author: Author
  category: Category
  tags: string[]
  publishedAt: string
  updatedAt: string
  slug: string
  featuredImage?: string
  isPublished: boolean
  readTime: number // em minutos
}

export interface Author {
  id: string
  name: string
  email: string
  bio: string
  avatar?: string
  socialLinks: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  isApproved: boolean
}

// Tipos para APIs
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para busca e filtros
export interface PostFilters {
  search?: string        // Busca por título/conteúdo
  categoryId?: string    // Filtro por categoria
  tags?: string[]        // Filtro por tags
}

export interface FilteredPostsResult {
  posts: Post[]
  totalResults: number
  appliedFilters: PostFilters
}

// Tipos para paginação
export interface PaginationOptions {
  page: number           // Página atual (1, 2, 3...)
  limit: number          // Quantos itens por página (5, 10, 20...)
}

export interface PaginatedPostsResult {
  posts: Post[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  appliedFilters: PostFilters
}

// Tipos combinados para filtros + paginação
export interface PostsQueryOptions {
  filters?: PostFilters
  pagination?: PaginationOptions
} 
import type { 
  Post, 
  Author, 
  Category, 
  PostFilters, 
  FilteredPostsResult, 
  PaginationOptions, 
  PaginatedPostsResult,
  PostsQueryOptions 
} from '../types/blog'
import { profileImg } from '../assets'

// Dados fake do autor
  export const mockAuthor: Author = {
    id: '1',
        name: 'Caio Dias',
        email: 'caio@blogpessoal.com',
    bio: 'Desenvolvedor Full Stack apaixonado por tecnologia e compartilhamento de conhecimento.',
    avatar: profileImg,
      socialLinks: {
      github: 'https://github.com/Caio-Dias02',
      linkedin: 'https://www.linkedin.com/in/caio-dias-755494204/'
    }
}

// Categorias fake
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react',
    description: 'Artigos sobre React e seu ecossistema',
    color: '#61DAFB'
  },
  {
    id: '2',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Dicas e tutoriais sobre TypeScript',
    color: '#3178C6'
  },
  {
    id: '3',
    name: 'Node.js',
    slug: 'nodejs',
    description: 'Backend com Node.js',
    color: '#339933'
  },
  {
    id: '4',
    name: 'Carreira',
    slug: 'carreira',
    description: 'Dicas sobre carreira em tecnologia',
    color: '#FF6B6B'
  }
]

// Posts fake - agora como uma variável mutável para simular database
let mockPosts: Post[] = [
  {
    id: '1',
    title: 'Introdução ao React Query: Gerenciando Estado do Servidor',
    content: `
      <p>React Query é uma biblioteca poderosa para gerenciar estado do servidor em aplicações React. Ela simplifica o processo de buscar, cachear e sincronizar dados remotos.</p>
      
      <h3>Por que usar React Query?</h3>
      <ul>
        <li>Cache inteligente automático</li>
        <li>Sincronização em background</li>
        <li>Invalidação de cache</li>
        <li>Estados de loading e error</li>
      </ul>
      
      <p>Neste artigo, vamos explorar os conceitos básicos e como implementar suas primeiras queries.</p>
    `,
    excerpt: 'Aprenda como o React Query pode simplificar o gerenciamento de estado do servidor em suas aplicações React.',
    author: mockAuthor,
    category: mockCategories[0],
    tags: ['react', 'react-query', 'estado', 'servidor'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    slug: 'introducao-react-query',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    isPublished: true,
    readTime: 8
  },
  {
    id: '2',
    title: 'TypeScript na Prática: Tipos Avançados para APIs',
    content: `
      <p>TypeScript oferece recursos poderosos para tipar suas APIs de forma segura e eficiente. Vamos explorar técnicas avançadas.</p>
      
      <h3>Tipos Utilitários</h3>
      <p>Partial, Required, Pick, Omit são seus aliados para criar tipos flexíveis.</p>
      
      <h3>Generics em APIs</h3>
      <p>Como usar generics para criar tipos reutilizáveis e type-safe.</p>
    `,
    excerpt: 'Explore técnicas avançadas de TypeScript para criar APIs mais seguras e maintíveis.',
    author: mockAuthor,
    category: mockCategories[1],
    tags: ['typescript', 'types', 'api', 'generics'],
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    slug: 'typescript-tipos-avancados',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    isPublished: true,
    readTime: 12
  },
  {
    id: '3',
    title: 'Construindo APIs REST com Node.js e Express',
    content: `
      <p>Node.js com Express é uma combinação poderosa para criar APIs REST escaláveis e eficientes.</p>
      
      <h3>Estrutura do Projeto</h3>
      <p>Organize seu código de forma modular e maintível.</p>
      
      <h3>Middleware e Validação</h3>
      <p>Implemente middleware para autenticação, validação e tratamento de erros.</p>
    `,
    excerpt: 'Guia completo para construir APIs REST profissionais com Node.js e Express.',
    author: mockAuthor,
    category: mockCategories[2],
    tags: ['nodejs', 'express', 'api', 'rest'],
    publishedAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    slug: 'nodejs-express-api',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    isPublished: true,
    readTime: 15
  },
  {
    id: '4',
    title: 'Como Crescer na Carreira de Desenvolvedor',
    content: `
      <p>A carreira de desenvolvedor oferece muitas oportunidades, mas requer estratégia e dedicação contínua.</p>
      
      <h3>Habilidades Técnicas vs Soft Skills</h3>
      <p>Equilibre o desenvolvimento técnico com habilidades interpessoais.</p>
      
      <h3>Networking e Comunidade</h3>
      <p>Participe de comunidades e eventos da área.</p>
    `,
    excerpt: 'Dicas práticas para acelerar seu crescimento profissional na área de desenvolvimento.',
    author: mockAuthor,
    category: mockCategories[3],
    tags: ['carreira', 'desenvolvimento', 'soft-skills', 'networking'],
    publishedAt: '2024-01-01T16:00:00Z',
    updatedAt: '2024-01-01T16:00:00Z',
    slug: 'carreira-desenvolvedor',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    isPublished: true,
    readTime: 10
  }
]

// Função que simula delay de rede
export const simulateNetworkDelay = (ms: number = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ====== QUERIES (READ) ======

// Função que simula busca de posts
export const fetchPosts = async (): Promise<Post[]> => {
  await simulateNetworkDelay(1200) // Simula delay de rede
  
  // Simula uma chance de erro (5% de chance)
  if (Math.random() < 0.05) {
    throw new Error('Erro ao buscar posts do servidor')
  }
  
  return mockPosts
}

// Função que simula busca de um post específico
export const fetchPost = async (id: string): Promise<Post | null> => {
  await simulateNetworkDelay(800)
  
  const post = mockPosts.find(p => p.id === id)
  if (!post) {
    throw new Error('Post não encontrado')
  }
  
  return post
}

// ====== BUSCA, FILTROS E PAGINAÇÃO ======

// Função que simula busca e filtros de posts
export const fetchFilteredPosts = async (filters: PostFilters): Promise<FilteredPostsResult> => {
  await simulateNetworkDelay(800) // Simula delay de busca
  
  // Simula uma chance de erro (3% de chance)
  if (Math.random() < 0.03) {
    throw new Error('Erro ao buscar posts filtrados')
  }
  
  let filteredPosts = [...mockPosts]
  
  // Filtro por busca textual (título e conteúdo)
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase().trim()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filtro por categoria
  if (filters.categoryId && filters.categoryId !== '') {
    filteredPosts = filteredPosts.filter(post => 
      post.category.id === filters.categoryId
    )
  }
  
  // Filtro por tags
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags.includes(tag))
    )
  }
  
  return {
    posts: filteredPosts,
    totalResults: filteredPosts.length,
    appliedFilters: filters
  }
}

// Função que simula busca com filtros E paginação
export const fetchPaginatedPosts = async (options: PostsQueryOptions): Promise<PaginatedPostsResult> => {
  await simulateNetworkDelay(800) // Simula delay de busca
  
  // Simula uma chance de erro (3% de chance)
  if (Math.random() < 0.03) {
    throw new Error('Erro ao buscar posts paginados')
  }
  
  const { filters = {}, pagination = { page: 1, limit: 10 } } = options
  let filteredPosts = [...mockPosts]
  
  // Aplica os filtros primeiro (mesmo código da função anterior)
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase().trim()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm)
    )
  }
  
  if (filters.categoryId && filters.categoryId !== '') {
    filteredPosts = filteredPosts.filter(post => 
      post.category.id === filters.categoryId
    )
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags.includes(tag))
    )
  }
  
  // Calcula informações da paginação
  const totalItems = filteredPosts.length
  const totalPages = Math.ceil(totalItems / pagination.limit)
  const currentPage = Math.max(1, Math.min(pagination.page, totalPages))
  
  // Calcula o índice de início e fim para a página atual
  const startIndex = (currentPage - 1) * pagination.limit
  const endIndex = startIndex + pagination.limit
  
  // Pega apenas os posts da página atual
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
  
  return {
    posts: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    },
    appliedFilters: filters
  }
}

// ====== MUTATIONS (CREATE, UPDATE, DELETE) ======

// Tipos para mutations
export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  categoryId: string
  tags: string[]
  featuredImage?: string
}

export interface UpdatePostData {
  id: string
  title?: string
  content?: string
  excerpt?: string
  categoryId?: string
  tags?: string[]
  featuredImage?: string
}

// Função para criar novo post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  await simulateNetworkDelay(2000)
  
  // Simula chance de erro (10% de chance)
  if (Math.random() < 0.1) {
    throw new Error('Erro ao criar post no servidor')
  }
  
  const category = mockCategories.find(c => c.id === data.categoryId)
  if (!category) {
    throw new Error('Categoria não encontrada')
  }
  
  const newPost: Post = {
    id: String(Date.now()), // ID simples baseado em timestamp
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    author: mockAuthor,
    category: category,
    tags: data.tags,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    featuredImage: data.featuredImage,
    isPublished: true,
    readTime: Math.ceil(data.content.length / 200) // Estima tempo de leitura
  }
  
  // Adiciona o post ao início da lista
  mockPosts.unshift(newPost)
  
  return newPost
}

// Função para editar post existente
export const updatePost = async (data: UpdatePostData): Promise<Post> => {
  await simulateNetworkDelay(1500)
  
  // Simula chance de erro (5% de chance)
  if (Math.random() < 0.05) {
    throw new Error('Erro ao editar post no servidor')
  }
  
  const postIndex = mockPosts.findIndex(p => p.id === data.id)
  if (postIndex === -1) {
    throw new Error('Post não encontrado')
  }
  
  const existingPost = mockPosts[postIndex]
  let category = existingPost.category
  
  // Se mudou a categoria, busca a nova
  if (data.categoryId && data.categoryId !== existingPost.category.id) {
    const newCategory = mockCategories.find(c => c.id === data.categoryId)
    if (!newCategory) {
      throw new Error('Categoria não encontrada')
    }
    category = newCategory
  }
  
  // Atualiza o post
  const updatedPost: Post = {
    ...existingPost,
    title: data.title ?? existingPost.title,
    content: data.content ?? existingPost.content,
    excerpt: data.excerpt ?? existingPost.excerpt,
    category: category,
    tags: data.tags ?? existingPost.tags,
    featuredImage: data.featuredImage ?? existingPost.featuredImage,
    updatedAt: new Date().toISOString(),
    readTime: data.content ? Math.ceil(data.content.length / 200) : existingPost.readTime
  }
  
  mockPosts[postIndex] = updatedPost
  
  return updatedPost
}

// Função para deletar post
export const deletePost = async (id: string): Promise<void> => {
  await simulateNetworkDelay(1000)
  
  // Simula chance de erro (5% de chance)
  if (Math.random() < 0.05) {
    throw new Error('Erro ao deletar post no servidor')
  }
  
  const postIndex = mockPosts.findIndex(p => p.id === id)
  if (postIndex === -1) {
    throw new Error('Post não encontrado')
  }
  
  // Remove o post da lista
  mockPosts.splice(postIndex, 1)
}

// Função para buscar categorias (para formulários)
export const fetchCategories = async (): Promise<Category[]> => {
  await simulateNetworkDelay(500)
  return mockCategories
} 
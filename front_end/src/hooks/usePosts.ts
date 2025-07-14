import { useQuery } from '@tanstack/react-query'
import type { Post, PostFilters, PostsQueryOptions } from '../types/blog'
import { fetchPosts, fetchPost, fetchFilteredPosts, fetchPaginatedPosts } from '../services/mockData'

export const usePosts = () => {
  return useQuery({
    // queryKey: identifica unicamente esta query
    // É como um "nome" para o cache
    queryKey: ['posts'],
    
    // queryFn: função que busca os dados
    // Esta função será chamada quando os dados precisarem ser buscados
    queryFn: fetchPosts,
    
    // Configurações adicionais (opcionais)
    staleTime: 5 * 60 * 1000, // 5 minutos - tempo que os dados são considerados "frescos"
    gcTime: 10 * 60 * 1000, // 10 minutos - tempo em cache antes de serem removidos
    
    // Retry em caso de erro
    retry: 2,
    
    // Refetch quando a janela ganha foco
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar um post específico
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id], // queryKey com parâmetro
    queryFn: () => fetchPost(id),
    enabled: !!id, // Só executa se id existir
  })
}

// Hook para busca e filtros de posts
export const useFilteredPosts = (filters: PostFilters) => {
  return useQuery({
    // queryKey inclui os filtros para cache inteligente
    queryKey: ['posts', 'filtered', filters],
    
    // queryFn: função que busca os dados filtrados
    queryFn: () => fetchFilteredPosts(filters),
    
    // Configurações otimizadas para busca
    staleTime: 2 * 60 * 1000, // 2 minutos - dados de busca ficam "frescos" por menos tempo
    gcTime: 5 * 60 * 1000, // 5 minutos - cache menor para busca
    
    // Retry em caso de erro
    retry: 1, // Menos retry para busca
    
    // Não refetch automaticamente ao focar
    refetchOnWindowFocus: false,
    
    // Executa a busca sempre que os filtros mudarem
    enabled: true,
  })
}

// Hook para busca com paginação
export const usePaginatedPosts = (options: PostsQueryOptions) => {
  return useQuery({
    // queryKey inclui filtros E paginação para cache inteligente
    queryKey: ['posts', 'paginated', options],
    
    // queryFn: função que busca os dados paginados
    queryFn: () => fetchPaginatedPosts(options),
    
    // Configurações otimizadas para paginação
    staleTime: 3 * 60 * 1000, // 3 minutos - dados paginados ficam "frescos" por mais tempo
    gcTime: 10 * 60 * 1000, // 10 minutos - cache maior para paginação
    
    // Retry em caso de erro
    retry: 2,
    
    // Não refetch automaticamente ao focar
    refetchOnWindowFocus: false,
    
    // Executa sempre que as opções mudarem
    enabled: true,
    
    // Configurações específicas para paginação
    placeholderData: (previousData) => {
      // Mantém dados anteriores enquanto carrega nova página
      // Evita "flash" de loading entre páginas
      return previousData
    }
  })
}

// Exportar tipos úteis
export type UsePostsResult = ReturnType<typeof usePosts>
export type UsePostResult = ReturnType<typeof usePost>
export type UseFilteredPostsResult = ReturnType<typeof useFilteredPosts>
export type UsePaginatedPostsResult = ReturnType<typeof usePaginatedPosts> 
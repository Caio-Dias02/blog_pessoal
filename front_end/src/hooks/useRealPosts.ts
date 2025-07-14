import { useQuery } from '@tanstack/react-query'
import { postsApi, categoriesApi } from '../services/api'
import type { Post } from '../types/blog'

// Hook para buscar posts publicados com paginação
export const usePosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', 'published', page, limit],
    queryFn: () => postsApi.getPublished(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar todos os posts (admin)
export const useAllPosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', 'all', page, limit],
    queryFn: () => postsApi.getAll(page, limit),
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar um post específico por ID
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos - post individual fica "fresco" por mais tempo
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
  })
}

// Hook para buscar um post específico por slug
export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: () => postsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
  })
}

// Hook para buscar posts por categoria
export const usePostsByCategory = (categoryId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', 'category', categoryId, page, limit],
    queryFn: () => postsApi.getByCategory(categoryId, page, limit),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar posts por tag
export const usePostsByTag = (tagId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', 'tag', tagId, page, limit],
    queryFn: () => postsApi.getByTag(tagId, page, limit),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar categorias
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutos - categorias mudam pouco
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar categorias com contagem de posts
export const useCategoriesWithCount = () => {
  return useQuery({
    queryKey: ['categories', 'count'],
    queryFn: () => categoriesApi.getAllWithCount(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar categorias populares
export const usePopularCategories = (limit: number = 10) => {
  return useQuery({
    queryKey: ['categories', 'popular', limit],
    queryFn: () => categoriesApi.getPopular(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar uma categoria específica
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
  })
}

// Hook para buscar categoria por slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['category', 'slug', slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
  })
}

// Exportar tipos úteis
export type UsePostsResult = ReturnType<typeof usePosts>
export type UseAllPostsResult = ReturnType<typeof useAllPosts>
export type UsePostResult = ReturnType<typeof usePost>
export type UsePostBySlugResult = ReturnType<typeof usePostBySlug>
export type UsePostsByCategoryResult = ReturnType<typeof usePostsByCategory>
export type UsePostsByTagResult = ReturnType<typeof usePostsByTag>
export type UseCategoriesResult = ReturnType<typeof useCategories>
export type UseCategoriesWithCountResult = ReturnType<typeof useCategoriesWithCount>
export type UsePopularCategoriesResult = ReturnType<typeof usePopularCategories>
export type UseCategoryResult = ReturnType<typeof useCategory>
export type UseCategoryBySlugResult = ReturnType<typeof useCategoryBySlug> 
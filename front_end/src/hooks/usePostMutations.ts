import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, updatePost, deletePost, fetchCategories } from '../services/mockData'
import type { CreatePostData, UpdatePostData } from '../services/mockData'
import { useQuery } from '@tanstack/react-query'

// Hook para criar posts
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    // mutationFn: função que será executada
    mutationFn: createPost,
    
    // onSuccess: executado quando a mutation é bem-sucedida
    onSuccess: (newPost) => {
      // Invalida e refaz a query de posts para mostrar o novo post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      // Adiciona o novo post ao cache manualmente (otimização)
      queryClient.setQueryData(['post', newPost.id], newPost)
      

    },
    
    // onError: executado em caso de erro
    onError: (error) => {
      console.error('❌ Erro ao criar post:', error)
    },
    
    // onSettled: executado sempre (sucesso ou erro)
    onSettled: () => {
  
    }
  })
}

// Hook para editar posts
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePost,
    
    onSuccess: (updatedPost) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] })
      
      // Atualiza o cache do post específico
      queryClient.setQueryData(['post', updatedPost.id], updatedPost)
      

    },
    
    onError: (error) => {
      console.error('❌ Erro ao atualizar post:', error)
    }
  })
}

// Hook para deletar posts
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePost,
    
    onSuccess: (_, deletedPostId) => {
      // Invalida a lista de posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      // Remove o post específico do cache
      queryClient.removeQueries({ queryKey: ['post', deletedPostId] })
      

    },
    
    onError: (error) => {
      console.error('❌ Erro ao deletar post:', error)
    }
  })
}

// Hook para buscar categorias (para formulários)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos (categorias mudam pouco)
    gcTime: 30 * 60 * 1000, // 30 minutos
  })
}

// Tipos úteis para exportar
export type CreatePostMutation = ReturnType<typeof useCreatePost>
export type UpdatePostMutation = ReturnType<typeof useUpdatePost>
export type DeletePostMutation = ReturnType<typeof useDeletePost>
export type CategoriesQuery = ReturnType<typeof useCategories>

// Helpers para usar com formulários
export interface PostFormData {
  title: string
  content: string
  excerpt: string
  categoryId: string
  tags: string[]
  featuredImage?: string
}

export const transformFormDataToCreate = (data: PostFormData): CreatePostData => ({
  title: data.title,
  content: data.content,
  excerpt: data.excerpt,
  categoryId: data.categoryId,
  tags: data.tags,
  featuredImage: data.featuredImage
})

export const transformFormDataToUpdate = (id: string, data: PostFormData): UpdatePostData => ({
  id,
  title: data.title,
  content: data.content,
  excerpt: data.excerpt,
  categoryId: data.categoryId,
  tags: data.tags,
  featuredImage: data.featuredImage
}) 
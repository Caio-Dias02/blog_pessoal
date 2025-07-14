import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi, categoriesApi, tagsApi, usersApi } from '../services/api'
import type { 
  CreatePostData, 
  UpdatePostData, 
  CreateCategoryData, 
  UpdateCategoryData,
  CreateTagData,
  UpdateTagData,
  CreateUserData,
  UpdateUserData,
  ChangePasswordData
} from '../services/api'

// ====== POST MUTATIONS ======

// Mutation para criar post
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostData) => postsApi.create(data),
    onSuccess: (newPost) => {
      // Invalidar cache de posts para forçar refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      // Adicionar o novo post ao cache se possível
      queryClient.setQueryData(['post', newPost.id], newPost)
      
      },
      onError: (error) => {
        console.error('Erro ao criar post:', error)
      }
    })
}

// Mutation para atualizar post
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) => 
      postsApi.update(id, data),
    onSuccess: (updatedPost) => {
      // Invalidar cache de posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      // Atualizar o post específico no cache
      queryClient.setQueryData(['post', updatedPost.id], updatedPost)
      
      },
      onError: (error) => {
        console.error('Erro ao atualizar post:', error)
      }
    })
}

// Mutation para deletar post
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidar cache de posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      // Remover o post específico do cache
      queryClient.removeQueries({ queryKey: ['post', deletedId] })
      
      },
      onError: (error) => {
        console.error('Erro ao deletar post:', error)
      }
    })
}

// ====== CATEGORY MUTATIONS ======

// Mutation para criar categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoriesApi.create(data),
    onSuccess: (newCategory) => {
      // Invalidar cache de categorias
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      
      // Adicionar a nova categoria ao cache
      queryClient.setQueryData(['category', newCategory.id], newCategory)
      
      },
      onError: (error) => {
        console.error('Erro ao criar categoria:', error)
      }
    })
}

// Mutation para atualizar categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) => 
      categoriesApi.update(id, data),
    onSuccess: (updatedCategory) => {
      // Invalidar cache de categorias
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      
      // Atualizar a categoria específica no cache
      queryClient.setQueryData(['category', updatedCategory.id], updatedCategory)
      
      },
      onError: (error) => {
        console.error('Erro ao atualizar categoria:', error)
      }
    })
}

// Mutation para deletar categoria
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidar cache de categorias
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      
      // Remover a categoria específica do cache
      queryClient.removeQueries({ queryKey: ['category', deletedId] })
      
      },
      onError: (error) => {
        console.error('Erro ao deletar categoria:', error)
      }
    })
}

// ====== TAG MUTATIONS ======

// Mutation para criar tag
export const useCreateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTagData) => tagsApi.create(data),
    onSuccess: (newTag) => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      
      // Adicionar a nova tag ao cache
      queryClient.setQueryData(['tag', newTag.id], newTag)
      
      },
      onError: (error) => {
        console.error('Erro ao criar tag:', error)
      }
    })
}

// Mutation para atualizar tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagData }) => 
      tagsApi.update(id, data),
    onSuccess: (updatedTag) => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      
      // Atualizar a tag específica no cache
      queryClient.setQueryData(['tag', updatedTag.id], updatedTag)
      
      },
      onError: (error) => {
        console.error('Erro ao atualizar tag:', error)
      }
    })
}

// Mutation para deletar tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      
      // Remover a tag específica do cache
      queryClient.removeQueries({ queryKey: ['tag', deletedId] })
      
      },
      onError: (error) => {
        console.error('Erro ao deletar tag:', error)
      }
    })
}

// ====== USER MUTATIONS ======

// Mutation para criar usuário
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.create(data),
    onSuccess: (newUser) => {
      // Invalidar cache de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      // Adicionar o novo usuário ao cache
      queryClient.setQueryData(['user', newUser.id], newUser)
      
      },
      onError: (error) => {
        console.error('Erro ao criar usuário:', error)
      }
    })
}

// Mutation para atualizar usuário
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      usersApi.update(id, data),
    onSuccess: (updatedUser) => {
      // Invalidar cache de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      // Atualizar o usuário específico no cache
      queryClient.setQueryData(['user', updatedUser.id], updatedUser)
      
      },
      onError: (error) => {
        console.error('Erro ao atualizar usuário:', error)
      }
    })
}

// Mutation para alterar senha
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordData }) => 
      usersApi.changePassword(id, data),
    onSuccess: () => {
      },
      onError: (error) => {
        console.error('Erro ao alterar senha:', error)
      }
    })
}

// Mutation para deletar usuário
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidar cache de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      // Remover o usuário específico do cache
      queryClient.removeQueries({ queryKey: ['user', deletedId] })
      
      },
      onError: (error) => {
        console.error('Erro ao deletar usuário:', error)
      }
    })
}

// ====== UTILITY HOOKS ======

// Hook para invalidar cache de posts manualmente
export const useInvalidatePosts = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
}

// Hook para invalidar cache de categorias manualmente
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }
}

// Hook para invalidar cache de tags manualmente
export const useInvalidateTags = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['tags'] })
  }
}

// Hook para invalidar cache de usuários manualmente
export const useInvalidateUsers = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
}

// Exportar tipos úteis
export type UseCreatePostResult = ReturnType<typeof useCreatePost>
export type UseUpdatePostResult = ReturnType<typeof useUpdatePost>
export type UseDeletePostResult = ReturnType<typeof useDeletePost>
export type UseCreateCategoryResult = ReturnType<typeof useCreateCategory>
export type UseUpdateCategoryResult = ReturnType<typeof useUpdateCategory>
export type UseDeleteCategoryResult = ReturnType<typeof useDeleteCategory>
export type UseCreateTagResult = ReturnType<typeof useCreateTag>
export type UseUpdateTagResult = ReturnType<typeof useUpdateTag>
export type UseDeleteTagResult = ReturnType<typeof useDeleteTag>
export type UseCreateUserResult = ReturnType<typeof useCreateUser>
export type UseUpdateUserResult = ReturnType<typeof useUpdateUser>
export type UseChangePasswordResult = ReturnType<typeof useChangePassword>
export type UseDeleteUserResult = ReturnType<typeof useDeleteUser> 
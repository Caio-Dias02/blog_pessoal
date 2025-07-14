import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { usePosts, usePaginatedPosts } from '../hooks/usePosts'
import { useCreatePost, useUpdatePost, useDeletePost, useCategories } from '../hooks/usePostMutations'
import { PostSkeleton, Skeleton } from '../components/common/Skeleton'
import ErrorBoundary from '../components/common/ErrorBoundary'

import { Pagination } from '../components/common/Pagination'
import type { PostFormData } from '../hooks/usePostMutations'
import type { Post, PostFilters, PaginationOptions } from '../types/blog'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tags: [],
    featuredImage: ''
  })
  const [tagInput, setTagInput] = useState('')

  // Estados para busca, filtros e paginação
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    categoryId: '',
    tags: []
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10
  })

  // Hooks
  const { data: allPosts } = usePosts() // Todos os posts para extrair tags
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const { data: paginatedResult, isLoading: loadingPosts } = usePaginatedPosts({
    filters,
    pagination
  })
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  // Extrair todas as tags únicas dos posts
  const allTags = useMemo(() => {
    if (!allPosts) return []
    const tagSet = new Set<string>()
    allPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [allPosts])

  // Posts paginados e informações de paginação
  const posts = paginatedResult?.posts || []
  const paginationInfo = paginatedResult?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  }

  // Funções de filtros
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
    // Reset para primeira página quando filtro muda
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, categoryId }))
    // Reset para primeira página quando filtro muda
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newSelectedTags)
    setFilters(prev => ({ ...prev, tags: newSelectedTags }))
    // Reset para primeira página quando filtro muda
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      tags: []
    })
    setSelectedTags([])
    // Reset para primeira página
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Funções de paginação
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleItemsPerPageChange = (limit: number) => {
    setPagination({ page: 1, limit }) // Reset para primeira página quando muda limite
  }

  const hasActiveFilters = filters.search || filters.categoryId || (filters.tags && filters.tags.length > 0)

  // Funções do formulário
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      categoryId: '',
      tags: [],
      featuredImage: ''
    })
    setTagInput('')
    setEditingPost(null)
    setShowCreateForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      if (editingPost) {
        // Editando post existente
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          ...formData
        })
        alert('Post atualizado com sucesso! ✏️')
      } else {
        // Criando post novo
        await createPostMutation.mutateAsync(formData)
        alert('Post criado com sucesso! 🎉')
      }
      
      resetForm()
    } catch (error) {
      alert('Erro: ' + (error as Error).message)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      categoryId: post.category.id,
      tags: post.tags,
      featuredImage: post.featuredImage || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (post: Post) => {
    if (confirm(`Tem certeza que deseja deletar o post "${post.title}"?`)) {
      try {
        await deletePostMutation.mutateAsync(post.id)
        alert('Post deletado com sucesso! 🗑️')
      } catch (error) {
        alert('Erro ao deletar: ' + (error as Error).message)
      }
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Administração do Blog
            </h1>
            <p className="text-gray-600">
              Gerencie seus posts de forma profissional
            </p>
          </div>

          {/* Seção de Busca e Filtros */}
          <ErrorBoundary fallback={
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-red-800 font-medium">
                  Erro ao carregar filtros
                </div>
                <div className="text-red-600 text-sm mt-1">
                  Tente recarregar a página
                </div>
              </div>
            </div>
          }>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  🔍 Buscar e Filtrar Posts
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    🧹 Limpar Filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Busca por texto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por título ou conteúdo
                  </label>
                  <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Digite para buscar..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filtro por categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por categoria
                  </label>
                  {loadingCategories ? (
                    <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
                  ) : (
                    <select
                      value={filters.categoryId || ''}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas as categorias</option>
                      {categories?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Resultados */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resultados
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    {loadingPosts ? (
                      <Skeleton height="1rem" width="120px" />
                    ) : (
                      <span className="text-sm text-gray-600">
                        📊 {paginationInfo.totalItems} post{paginationInfo.totalItems !== 1 ? 's' : ''} encontrado{paginationInfo.totalItems !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Filtro por tags */}
              {loadingCategories ? (
                <div className="mt-6">
                  <Skeleton height="1rem" width="120px" className="mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        height="1.75rem"
                        width={`${Math.random() * 40 + 60}px`}
                        className="rounded-full"
                      />
                    ))}
                  </div>
                </div>
              ) : allTags.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Filtrar por tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>

          {/* Ações principais */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={createPostMutation.isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              ➕ Novo Post
            </button>
          </div>



          {/* Formulário de criação/edição */}
          {showCreateForm && (
            <ErrorBoundary fallback={
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-red-800 font-medium">
                    Erro no formulário
                  </div>
                  <div className="text-red-600 text-sm mt-1">
                    Feche e tente abrir novamente
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Fechar Formulário
                  </button>
                </div>
              </div>
            }>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingPost ? '✏️ Editando Post' : '➕ Criando Novo Post'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título do post"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Resumo que aparece na lista de posts"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Conteúdo completo do post (pode usar HTML)"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories?.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://blog-caio-dias.com/images/featured-post.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite uma tag e pressione Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createPostMutation.isPending || updatePostMutation.isPending || loadingCategories}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {editingPost ? 
                        (updatePostMutation.isPending ? '⏳ Salvando...' : '💾 Salvar Alterações') :
                        (createPostMutation.isPending ? '⏳ Criando...' : '🚀 Criar Post')
                      }
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </ErrorBoundary>
          )}

          {/* Lista de posts com paginação */}
          <ErrorBoundary fallback={
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-red-800 font-medium">
                  Erro ao carregar posts
                </div>
                <div className="text-red-600 text-sm mt-1">
                  Tente recarregar a página
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🔄 Recarregar
                </button>
              </div>
            </div>
          }>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">📝 Seus Posts</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingPosts ? (
                      // 🦴 Skeleton loading para posts
                      Array.from({ length: pagination.limit }).map((_, index) => (
                        <PostSkeleton key={index} />
                      ))
                    ) : posts.length === 0 ? (
                      // 🔍 Estado vazio
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <div className="text-2xl mb-2">📭</div>
                            <div className="text-lg font-medium mb-1">
                              {hasActiveFilters ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
                            </div>
                            <div className="text-sm">
                              {hasActiveFilters 
                                ? 'Tente ajustar os filtros de busca' 
                                : 'Que tal criar seu primeiro post?'
                              }
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // 📋 Lista de posts
                      posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {post.excerpt.substring(0, 100)}...
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                              style={{ backgroundColor: post.category.color }}
                            >
                              {post.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(post)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDelete(post)}
                              disabled={deletePostMutation.isPending}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              🗑️ Deletar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Componente de Paginação */}
              {!loadingPosts && paginationInfo.totalItems > 0 && (
                <Pagination
                  currentPage={paginationInfo.currentPage}
                  totalPages={paginationInfo.totalPages}
                  totalItems={paginationInfo.totalItems}
                  itemsPerPage={paginationInfo.itemsPerPage}
                  hasNextPage={paginationInfo.hasNextPage}
                  hasPreviousPage={paginationInfo.hasPreviousPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  isLoading={loadingPosts}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      
      
      
    </ErrorBoundary>
  )
} 
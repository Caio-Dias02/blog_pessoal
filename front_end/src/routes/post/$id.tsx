import { createFileRoute, Link } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePosts'

export const Route = createFileRoute('/post/$id')({
  component: PostPage,
})

function PostPage() {
  // Pegar o ID da URL usando TanStack Router
  const { id } = Route.useParams()
  
  // Usar React Query para buscar o post específico
  const { data: post, isLoading, error, isSuccess, isError } = usePost(id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">


        {/* Estados do React Query */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Carregando post...</p>
            <p className="text-sm text-gray-500 mt-2">
              React Query está buscando o post com ID: <code className="bg-gray-200 px-2 py-1 rounded">{id}</code>
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">❌ Erro ao carregar post</h3>
            <p className="mb-2">{error?.message || 'Post não encontrado'}</p>
            <p className="text-sm">ID solicitado: <code className="bg-red-200 px-2 py-1 rounded">{id}</code></p>
          </div>
        )}

        {isSuccess && post && (
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Imagem destacada */}
            {post.featuredImage && (
              <div className="w-full h-64 md:h-80 bg-gray-200">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Metadata do post */}
              <div className="flex items-center mb-6">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: post.category.color }}
                ></span>
                <span className="text-sm font-medium text-gray-600 mr-4">
                  {post.category.name}
                </span>
                <span className="text-sm text-gray-500 mr-4">
                  ⏱️ {post.readTime} min de leitura
                </span>
                <span className="text-sm text-gray-500">
                  📅 {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Informações do autor */}
              <div className="flex items-center border-t border-b border-gray-200 py-6 mb-8">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <p className="text-gray-600 text-sm">{post.author.bio}</p>
                </div>
                <div className="flex space-x-3">
                  {post.author.socialLinks.github && (
                    <a 
                      href={post.author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      GitHub
                    </a>
                  )}
                  {post.author.socialLinks.linkedin && (
                    <a 
                      href={post.author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Conteúdo do post */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}

        

      </div>
    </div>
  )
} 
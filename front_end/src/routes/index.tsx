import { createFileRoute } from '@tanstack/react-router'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/common/PostCard'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  // 📝 Hook do React Query - vamos analisar cada estado
  const { data, isLoading, error, isSuccess, isError } = usePosts()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Últimos Posts
          </h1>
          <p className="text-xl text-gray-600">
            Blog Pessoal - Caio Dias
          </p>
        </header>





        {/* Conteúdo baseado no estado */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Carregando posts...</p>
            <p className="text-sm text-gray-500 mt-2">React Query está buscando os dados</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <h3 className="font-bold">❌ Erro ao carregar posts</h3>
            <p>{error?.message || 'Erro desconhecido'}</p>
            <p className="text-sm mt-2">React Query detectou um erro na busca</p>
          </div>
        )}

        {isSuccess && data && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              📝 Posts do Blog ({data.length})
            </h2>
                        <div className="space-y-6">
              {data.map((post) => (
                <PostCard 
                  key={post.id}
                  post={post}
                  showImage={true}
                />
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

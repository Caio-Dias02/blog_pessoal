import { Link } from '@tanstack/react-router'
import type { Post } from '../../types/blog'

interface PostCardProps {
  post: Post
  showImage?: boolean
  variant?: 'default' | 'compact'
}

export function PostCard({ post, showImage = false, variant = 'default' }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem destacada (opcional) */}
      {showImage && post.featuredImage && (
        <div className="w-full h-48 bg-gray-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Metadata do post */}
        <div className="flex items-center mb-4">
          <span 
            className="inline-block w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: post.category.color }}
          ></span>
          <span className="text-sm font-medium text-gray-600">
            {post.category.name}
          </span>
          <span className="text-sm text-gray-500 ml-4">
            ⏱️ {post.readTime} min de leitura
          </span>
        </div>
        
        {/* Título como link */}
        <Link 
          to="/post/$id" 
          params={{ id: post.id }}
          className="block group"
        >
          <h3 className={`${variant === 'compact' ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors`}>
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        
        {/* Botão "Leia mais" */}
        <div className="mb-4">
          <Link 
            to="/post/$id" 
            params={{ id: post.id }}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Leia mais →
          </Link>
        </div>
        
        {/* Footer com autor e tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author.name}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
} 
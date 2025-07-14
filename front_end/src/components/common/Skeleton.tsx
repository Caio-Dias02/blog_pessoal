interface SkeletonProps {
  width?: string
  height?: string
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular'
}: SkeletonProps) => {
  const baseClasses = "bg-gray-200 animate-pulse"
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

// Skeleton específico para texto
export const TextSkeleton = ({ 
  lines = 1, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? '75%' : '100%'}
          variant="text"
        />
      ))}
    </div>
  )
}

// Skeleton para posts
export const PostSkeleton = () => {
  return (
    <tr className="hover:bg-gray-50 animate-pulse">
      <td className="px-6 py-4">
        <div className="space-y-2">
          <Skeleton height="1.25rem" width="70%" />
          <Skeleton height="1rem" width="90%" />
          <Skeleton height="1rem" width="60%" />
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton height="1.5rem" width="80px" className="rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton height="1rem" width="100px" />
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <Skeleton height="1rem" width="60px" />
          <Skeleton height="1rem" width="60px" />
        </div>
      </td>
    </tr>
  )
}

// Skeleton para filtros
export const FilterSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <Skeleton height="1.5rem" width="200px" />
        <Skeleton height="2rem" width="120px" className="rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Skeleton height="1rem" width="150px" className="mb-2" />
          <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
        </div>
        <div>
          <Skeleton height="1rem" width="120px" className="mb-2" />
          <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
        </div>
        <div>
          <Skeleton height="1rem" width="80px" className="mb-2" />
          <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
        </div>
      </div>

      <div className="mt-6">
        <Skeleton height="1rem" width="120px" className="mb-3" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              height="1.75rem"
              width={`${Math.random() * 40 + 60}px`}
              className="rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
} 
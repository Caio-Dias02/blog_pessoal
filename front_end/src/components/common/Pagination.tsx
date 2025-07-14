import type { PaginationOptions } from '../../types/blog'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  onItemsPerPageChange: (limit: number) => void
  isLoading?: boolean
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false
}: PaginationProps) => {
  
  // Opções de itens por página
  const itemsPerPageOptions = [5, 10, 20, 50]
  
  // Calcula o range dos itens sendo exibidos
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  // Gera array de páginas para mostrar
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 7
    
    if (totalPages <= maxPagesToShow) {
      // Se tem poucas páginas, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Se tem muitas páginas, mostra com reticências
      if (currentPage <= 4) {
        // Começo: 1 2 3 4 5 ... 20
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Final: 1 ... 16 17 18 19 20
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Meio: 1 ... 8 9 10 11 12 ... 20
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const pageNumbers = generatePageNumbers()
  
  // Se não há itens, não mostra paginação
  if (totalItems === 0) {
    return null
  }
  
  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Informações dos resultados */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            Exibindo <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> posts
          </div>
          
          {/* Seletor de itens por página */}
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">
              Por página:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Controles de navegação */}
        <div className="flex items-center gap-2">
          
          {/* Botão Primeira Página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏮️
          </button>
          
          {/* Botão Anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ❮ Anterior
          </button>
          
          {/* Números das páginas */}
          <div className="flex gap-1">
            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={typeof page === 'string' || isLoading}
                className={`px-3 py-2 text-sm font-medium border rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : typeof page === 'string'
                    ? 'bg-white text-gray-400 border-gray-300 cursor-default'
                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
          </div>
          
          {/* Botão Próximo */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo ❯
          </button>
          
          {/* Botão Última Página */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏭️
          </button>
          
        </div>
        
      </div>
    </div>
  )
}

// Componente mais simples para casos básicos
export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ❮ Anterior
      </button>
      
      <span className="px-4 py-2 text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo ❯
      </button>
    </div>
  )
} 
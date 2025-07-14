import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados ficam "frescos" antes de serem considerados "stale"
      staleTime: 5 * 60 * 1000, // 5 minutos
      // Tempo que os dados ficam em cache antes de serem removidos
      gcTime: 10 * 60 * 1000, // 10 minutos
      // Retry automático em caso de erro
      retry: 2,
      // Refetch quando a janela volta a ter foco
      refetchOnWindowFocus: false,
      // Refetch quando a conexão é reconectada
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automático para mutations
      retry: 1,
    },
  },
})

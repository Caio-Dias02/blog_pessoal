import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navigation } from '../components/common/Navigation'

import ErrorBoundary from '../components/common/ErrorBoundary'

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Navigation />
      <Outlet />
      
    </ErrorBoundary>
  ),
})

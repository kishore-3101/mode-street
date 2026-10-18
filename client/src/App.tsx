import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';
import { AdminLayout } from './components/layout/AdminLayout.js';

// Pages
import { StorefrontPlaceholder } from './pages/StorefrontPlaceholder.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { ProductsListPage } from './pages/products/ProductsListPage.js';
import { ProductFormPage } from './pages/products/ProductFormPage.js';
import { CategoriesPage } from './pages/categories/CategoriesPage.js';
import { InventoryPage } from './pages/inventory/InventoryPage.js';
import { OrdersPlaceholderPage } from './pages/orders/OrdersPlaceholderPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Storefront Landing */}
            <Route path="/" element={<StorefrontPlaceholder />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<ProductsListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="orders" element={<OrdersPlaceholderPage />} />
              </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>

        {/* Global Toast Notifications styled for Mode Street theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FBF8F4',
              color: '#3B2F2A',
              border: '1px solid #D9C5B2',
              fontFamily: 'Inter Variable, sans-serif',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';
import { AdminLayout } from './components/layout/AdminLayout.js';

// Storefront components & pages
import { StoreLayout } from './components/store/StoreLayout.js';
import { HomePage } from './pages/store/HomePage.js';
import { ShopPage } from './pages/store/ShopPage.js';
import { ProductPage } from './pages/store/ProductPage.js';
import { CartPage } from './pages/store/CartPage.js';
import { CheckoutPage } from './pages/store/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/store/OrderConfirmationPage.js';
import { TermsPage } from './pages/store/TermsPage.js';
import { ContactPage } from './pages/store/ContactPage.js';
import { ShippingPage } from './pages/store/ShippingPage.js';
import { ReturnsPage } from './pages/store/ReturnsPage.js';
import { SizeGuidePage } from './pages/store/SizeGuidePage.js';
import { FaqPage } from './pages/store/FaqPage.js';

// Admin Pages
import { LoginPage } from './pages/auth/LoginPage.js';
import { ProductsListPage } from './pages/products/ProductsListPage.js';
import { ProductFormPage } from './pages/products/ProductFormPage.js';
import { CategoriesPage } from './pages/categories/CategoriesPage.js';
import { InventoryPage } from './pages/inventory/InventoryPage.js';
import { OrdersListPage } from './pages/orders/OrdersListPage.js';
import { OrderDetailPage } from './pages/orders/OrderDetailPage.js';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Storefront Routes wrapped in StoreLayout */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                {/* Static Content Pages */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/faq" element={<FaqPage />} />
              </Route>

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
                  <Route path="orders" element={<OrdersListPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
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
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

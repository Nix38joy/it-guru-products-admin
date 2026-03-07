import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { ProductsPage } from '@/pages/ProductsPage/ProductsPage';
import { useSessionStore } from '@/entities/session/store';

function App() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />}
        />
        {/* Заглушка для страницы товаров */}
        <Route
          path="/products"
          element={
            isAuthenticated ? <ProductsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



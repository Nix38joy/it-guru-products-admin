import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { ProductsPage } from '@/pages/ProductsPage/ProductsPage';
import { useSessionStore } from '@/entities/session/store';

const PATHS = {
  LOGIN: '/login',
  PRODUCTS: '/products',
} as const;

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  return <Outlet />;
};

const PublicRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (isAuthenticated) {
    return <Navigate to={PATHS.PRODUCTS} replace />;
  }
  return <Outlet />;
};

function App() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path={PATHS.PRODUCTS} element={<ProductsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={PATHS.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



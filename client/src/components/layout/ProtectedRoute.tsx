import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import logoImg from '../../assets/logo.png';

export function ProtectedRoute() {
  const { admin, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-cream-surface rounded-xl shadow-xs border border-sand p-2 flex items-center justify-center animate-pulse mb-4">
          <img src={logoImg} alt="Mode Street" className="w-full h-full object-contain" />
        </div>
        <p className="text-sm font-serif italic text-espresso/70">Entering Mode Street Admin...</p>
      </div>
    );
  }

  if (!token || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

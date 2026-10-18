import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button, Input } from '../../components/ui/index.js';
import logoImg from '../../assets/logo.png';
import { getApiErrorMessage } from '../../lib/utils.js';

export function LoginPage() {
  const { admin, token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to products
  if (token && admin) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password);
      navigate('/admin/products');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Invalid credentials');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-camel/30">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-cream-surface border border-sand rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Brand Logo Presentation */}
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-cream rounded-xl border border-sand/60 shadow-2xs mb-3">
              <img
                src={logoImg}
                alt="Mode Street"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-espresso/70 mt-1">
              Sign in to manage catalog, inventory and orders
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-lg bg-danger-bg border border-[#E8C6C3] flex items-start gap-2.5 text-xs sm:text-sm text-danger animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="admin-email"
              type="email"
              label="Email Address"
              placeholder="admin@modestreet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              leftElement={<Mail className="w-4 h-4" />}
            />

            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftElement={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="p-1 hover:text-espresso transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In to Console
            </Button>
          </form>
        </div>

        {/* Demo note */}
        <p className="mt-6 text-center text-xs text-espresso/60 font-mono">
          Mode Street Fashion E-Commerce • Back-Office
        </p>
      </div>
    </div>
  );
}

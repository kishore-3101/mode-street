import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import logoImg from '../../assets/logo.png';
import { getApiErrorMessage } from '../../lib/utils.js';

export function LoginPage() {
  const { admin, token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#F6F0E8] flex items-center justify-center p-4 selection:bg-[#B99A7A]/30">
      <div className="w-full max-w-[390px] border border-[#3B2925]/35 rounded-[32px] px-8 pt-10 pb-10 bg-[#F6F0E8]">
        {/* Brand Logo Presentation */}
        <div className="flex justify-center mb-8">
          <img
            src={logoImg}
            alt="Mode Street - Wear Your Story"
            className="w-48 max-w-[190px] h-auto object-contain"
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-2.5 rounded-xl bg-[#FAECF0] border border-[#E8C6C3] text-xs text-[#8E2333] text-center"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-bold tracking-wider text-[#3B2925] uppercase mb-1.5"
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              required
              autoFocus
              className="w-full bg-white text-[#3B2925] rounded-xl px-4 py-3 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#3B2925]/40 transition-all border border-transparent shadow-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-bold tracking-wider text-[#3B2925] uppercase mb-1.5"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="·············"
              required
              className="w-full bg-white text-[#3B2925] rounded-xl px-4 py-3 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#3B2925]/40 transition-all border border-transparent shadow-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3B2925] hover:bg-[#2A1D1A] text-white text-xs font-bold tracking-wider py-3.5 rounded-xl uppercase transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import logoImg from '../../assets/logo.png';
import { getApiErrorMessage } from '../../lib/utils.js';

const labelClass = 'mb-1.5 block text-sm font-medium text-espresso';

const fieldClass =
  'block w-full rounded-[10px] border border-espresso/25 bg-white px-3.5 py-2.5 text-sm text-espresso ' +
  'placeholder:text-espresso/40 transition-colors hover:border-espresso/40 ' +
  'focus:border-espresso focus:outline-none focus:ring-1 focus:ring-espresso';

export function LoginPage() {
  const { admin, token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (token && admin) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password);
      navigate('/admin/products');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden items-center justify-center bg-sand lg:flex">
        {/* Inset hairline frame */}
        <div className="pointer-events-none absolute inset-6 border border-espresso/15" />

        <img
          src={logoImg}
          alt="Mode Street"
          className="w-72 max-w-[60%] object-contain mix-blend-multiply"
        />

        <p className="absolute bottom-12 left-12 text-[11px] font-medium uppercase tracking-[0.2em] text-espresso/60">
          Catalogue · Inventory · Orders
        </p>
      </aside>

      {/* Form column */}
      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-12">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex flex-1 flex-col justify-center">
            {/* Logo on mobile */}
            <img
              src={logoImg}
              alt="Mode Street"
              className="mb-10 h-16 w-auto self-start object-contain mix-blend-multiply lg:hidden"
            />

            {/* Bordered box with label sitting on the top border */}
            <section className="relative border-[1.5px] border-espresso/60 px-6 pb-8 pt-10 sm:px-8">
              <span className="absolute -top-2.5 left-5 bg-cream px-3 text-xs font-semibold uppercase tracking-wider text-espresso/70">
                Admin console
              </span>

              <h1 className="font-serif text-3xl font-bold text-espresso">Sign in</h1>
              <p className="mt-2 text-sm text-espresso/65">
                Use your administrator account to continue.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {error && (
                  <p
                    id="login-error"
                    role="alert"
                    className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger"
                  >
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="admin-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'login-error' : undefined}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="admin-password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? 'login-error' : undefined}
                      className={`${fieldClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-2 text-espresso/55 transition-colors hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Extra gap above the button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer rounded-[10px] bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-espresso/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Signing in…' : 'Sign in'}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Footer aligned with the box */}
          {/* Footer centered under the box */}
          <p className="pt-8 text-center text-xs text-espresso/50">© 2026 ModeStreet.com</p>
        </div>
      </main>
    </div>
  );
}
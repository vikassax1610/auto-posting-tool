import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle, ShieldCheck, Share2 } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success('Account created successfully');
      } else {
        await login(form.email, form.password);
        toast.success('Logged in successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-10 sm:px-8">
      <div className="w-full max-w-[28rem]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
            <Share2 size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Publisher workspace</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-muted">{isRegister ? 'Set up access to the internal publishing workspace.' : 'Sign in to manage your social publishing workflow.'}</p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="auth-heading">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="auth-heading" className="text-xl font-semibold tracking-tight text-white">{isRegister ? 'Account details' : 'Sign in'}</h2>
              <p className="mt-1 text-sm text-muted">Use your workspace email to continue.</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-primary">
              <ShieldCheck size={17} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                id="name"
                name="name"
                label="Name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />

            {!isRegister && (
              <div className="flex items-center justify-between gap-3 pt-0.5">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(event) => setRememberDevice(event.target.checked)}
                    className="h-4 w-4 rounded border-border bg-bg accent-primary"
                  />
                  Remember this device
                </label>
                <button
                  type="button"
                  onClick={() => toast('Contact your workspace administrator to reset your password.')}
                  className="text-xs font-semibold text-primary transition-opacity hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader size="sm" /> : <>{isRegister ? 'Create account' : 'Sign in'}<ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <button
              type="button"
              onClick={() => setIsRegister((current) => !current)}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <span className="font-semibold text-primary">{isRegister ? 'Sign in' : 'Create one'}</span>
            </button>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
          <CheckCircle size={14} className="text-success" />
          Internal publishing access only
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

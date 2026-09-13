import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { role: 'Admin', username: 'admin', password: 'admin123' },
  { role: 'Accountant', username: 'accountant', password: 'accountant123' },
  { role: 'Super Admin', username: 'superadmin', password: 'superadmin123' },
];

const initialForm = {
  name: '',
  email: '',
  username: 'admin',
  password: 'admin123',
  remember: true,
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    navigate(user.role === 'accountant' ? '/accountant' : '/admin', { replace: true });
  }, [user, navigate]);

  const title = useMemo(() => {
    if (mode === 'login') return 'Welcome back';
    if (mode === 'signup') return 'Create your committee account';
    return 'Reset your password';
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const ok = login(form.username, form.password);
      if (!ok) {
        setError('Invalid demo credentials. Use one of the sample accounts below.');
        return;
      }
      setSuccess('Login successful. Redirecting to your dashboard...');
      return;
    }

    if (mode === 'signup') {
      setSuccess(`Signup demo successful for ${form.name || form.username}. Use the same account details to log in.`);
      setMode('login');
      return;
    }

    setSuccess('Password reset instructions have been sent to your email address.');
  };

  return (
    <div className="grid min-h-[calc(100vh-76px)] place-items-center bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.26),transparent_30%),linear-gradient(135deg,#160d09,#3b120b,#7c2d12)] px-4 py-10">
      <div className="grid w-[min(1080px,100%)] overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.05fr_1fr]">
        <div className="bg-festival p-8 text-white sm:p-10">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/15 text-3xl font-extrabold">ॐ</div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Member portal</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-normal">Manage the festival with clarity.</h1>
          <p className="mt-4 leading-8 text-white/82">
            Role-based access for admins and accountants, built around donations, expenses, committee history, audit logs, and yearly records.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Secure access</p>
              <h2 className="mt-2 text-3xl font-extrabold text-stone-950">{title}</h2>
            </div>
            <button type="button" className="rounded-full border border-orange-100 px-4 py-2 text-sm font-extrabold text-rose-800" onClick={() => navigate('/')}>
              Back to site
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {mode === 'signup' && (
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            )}
            {mode !== 'forgot' && (
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
            )}
            {mode === 'signup' && (
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
            )}
            {mode !== 'forgot' && (
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            )}
            {mode === 'login' && (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 font-bold text-stone-600">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                  Keep me signed in
                </label>
                <button type="button" className="font-extrabold text-rose-800" onClick={() => setMode('forgot')}>Forgot password?</button>
              </div>
            )}
            {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</div>}
            {success && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{success}</div>}
            <button type="submit" className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-6 py-3 font-extrabold text-white shadow-lg shadow-orange-700/25">
              {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-stone-600">
            <span>{mode === 'login' ? 'Need a committee account?' : 'Already have an account?'}</span>
            <button type="button" className="font-extrabold text-rose-800" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-4">
            <h3 className="font-extrabold text-stone-950">Demo access</h3>
            <div className="mt-3 grid gap-2">
              {demoAccounts.map((item) => (
                <div key={item.username} className="grid grid-cols-3 gap-2 rounded-2xl bg-white px-3 py-2 text-sm">
                  <span className="font-bold text-stone-600">{item.role}</span>
                  <strong className="text-stone-950">{item.username}</strong>
                  <em className="not-italic text-stone-600">{item.password}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

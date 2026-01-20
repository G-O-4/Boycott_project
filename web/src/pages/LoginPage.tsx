import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';
import { authApi } from '../lib/api';

export function LoginPage() {
  const { t } = useLanguageStore();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });

      const payload = res.data;

      const user = payload?.data?.user ?? payload?.user;
      const token = payload?.data?.token ?? payload?.token;

      if (!user || !token) {
        console.error('Unexpected login response:', payload);
        throw new Error('Unexpected login response shape');
      }

      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'فشل تسجيل الدخول. تأكد من البيانات';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
      

  return (
    <div className="min-h-screen bg-dark-900 bg-grid-pattern flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-800 border border-dark-600 rounded-2xl mb-4">
            <span className="text-3xl">🇵🇸</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-100">{t('appName')}</h1>
          <p className="text-dark-400 mt-1">تسجيل الدخول</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-dark-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="email@example.com"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                t('login')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-brand-400 hover:underline text-sm">
              ليس لديك حساب؟ سجل الآن
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-dark-400 hover:text-dark-200 text-sm">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

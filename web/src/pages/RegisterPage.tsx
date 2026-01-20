import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';
import { authApi } from '../lib/api';

export function RegisterPage() {
  const { t, language } = useLanguageStore();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const email = formData.email.trim();
      const password = formData.password; // لا تعمل trim للباسورد
      const displayName = formData.username.trim();

      // ✅ Register الحقيقي
      const regRes = await authApi.register({
        email,
        password,
        displayName,
        language,
      });

      const regPayload = regRes.data;
      const user = regPayload?.data?.user ?? regPayload?.user;
      const token = regPayload?.data?.token ?? regPayload?.token;

      // أغلب الظن سيرجع user+token مباشرة
      if (user && token) {
        setAuth(user, token);
        navigate('/');
        return;
      }

      // ✅ لو ما رجّع token (احتياط)
      const loginRes = await authApi.login({ email, password });
      const payload = loginRes.data;

      const u = payload?.data?.user ?? payload?.user;
      const tkn = payload?.data?.token ?? payload?.token;

      if (!u || !tkn) throw new Error('Unexpected auth response');

      setAuth(u, tkn);
      navigate('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'فشل إنشاء الحساب. حاول مرة أخرى';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid-pattern flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-800 border border-dark-600 rounded-2xl mb-4">
            <span className="text-3xl">🇵🇸</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-100">{t('appName')}</h1>
          <p className="text-dark-400 mt-1">إنشاء حساب جديد</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-dark-300 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="input"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-brand-400 hover:underline text-sm">
              لديك حساب بالفعل؟ سجل دخولك
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-dark-400 hover:text-dark-200 text-sm">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

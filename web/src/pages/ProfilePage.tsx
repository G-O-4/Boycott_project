import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';
import { authApi, usersApi } from '../lib/api';

export function ProfilePage() {
  const { t, language } = useLanguageStore();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  // ✅ عند فتح صفحة البروفايل: نجلب بيانات /auth/me (هذه تعطي بيانات حقيقية مثل createdAt)
  useEffect(() => {
    if (!token) return;

    authApi
      .getMe()
      .then((res) => {
        const payload = res.data;
        const meUser = payload?.data?.user ?? payload?.user ?? payload?.data;
        if (meUser) setAuth(meUser, token);
      })
      .catch(() => {
        // إذا التوكن غير صالح
        logout();
      });
  }, [token, setAuth, logout]);

  // ✅ جلب إحصائيات حقيقية (إن كان الباكند يدعمها)
  const [stats, setStats] = useAuthStore((s) => [null as any, () => {}]); // لا نستخدم state جديد - فقط fallback
  useEffect(() => {
    if (!user?.id) return;
    usersApi
      .getStats(user.id)
      .then((res) => {
        // نتعامل مع أي شكل محتمل للـ payload
        const payload = res.data;
        const s = payload?.data ?? payload;
        // نخزنها في متغير محلي عبر window (حل سريع بدون إعادة هيكلة)
        (window as any).__boycott_stats__ = s;
      })
      .catch(() => {
        (window as any).__boycott_stats__ = null;
      });
  }, [user?.id]);

  const statsData = (window as any).__boycott_stats__ ?? null;

  // ✅ تاريخ الانضمام الحقيقي
  const joinedAt =
    user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString(language === 'ar' ? 'ar-LY' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '—';

  // ✅ نقاط/مستوى حقيقي من user نفسه (بدل الوهمي)
  const points = user?.scoreTotal ?? 0;
  const level = user?.reputationLevel ?? 0;

  // ✅ إحصائيات (لو endpoint موجود يرجّع أرقام، لو لا نعرض 0 بدل بيانات وهمية)
  const scans = statsData?.scans ?? 0;
  const avoided = statsData?.avoided ?? 0;
  const alternativesFound = statsData?.alternativesFound ?? 0;
  const contributions = statsData?.contributions ?? 0;

  const displayName =
    user?.displayName ||
    user?.displayNameAr ||
    user?.email?.split('@')?.[0] ||
    'مستخدم';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* User Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white text-3xl font-bold shadow-glow-md">
            {displayName?.[0] || '؟'}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">{displayName}</h1>

            {/* ✅ بدل "يناير 2024" الوهمية */}
            <p className="text-dark-400">
              عضو منذ {joinedAt}
            </p>

            <div className="flex gap-2 mt-2">
              {/* إذا عندك rank في statsData استخدمه وإلا نخفيه */}
              {typeof statsData?.rank === 'number' && (
                <span className="tag-brand">المرتبة #{statsData.rank}</span>
              )}

              <span className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {points} نقطة
              </span>

              <span className="tag bg-dark-700 text-dark-300 border border-dark-600">
                مستوى {level}
              </span>
            </div>
          </div>

          <button
            onClick={() => {/* Settings لاحقًا */}}
            className="p-3 rounded-xl bg-dark-700 text-dark-300 hover:bg-dark-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Stats Grid (حقيقية إن وجدت، وإلا 0 بدل بيانات وهمية) */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-brand-400">{scans}</div>
            <div className="text-xs text-dark-400">منتج تم مسحه</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-red-400">{avoided}</div>
            <div className="text-xs text-dark-400">تم تجنبه</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-emerald-400">{alternativesFound}</div>
            <div className="text-xs text-dark-400">بديل وجدته</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-purple-400">{contributions}</div>
            <div className="text-xs text-dark-400">مساهمة</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link to="/community" className="glass-card-hover p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-dark-100">مساهماتي</p>
            <p className="text-sm text-dark-400">عرض وإدارة مساهماتك</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="w-full glass-card p-4 flex items-center gap-4 hover:border-red-500/30 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <p className="font-medium text-red-400">{t('logout')}</p>
        </button>
      </div>
    </div>
  );
}

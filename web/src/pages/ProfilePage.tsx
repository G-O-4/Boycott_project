import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';

const userStats = {
  scans: 127,
  avoided: 45,
  alternativesFound: 23,
  contributions: 12,
  points: 580,
  rank: 47,
};

const recentScans = [
  { id: '1', nameAr: 'كوكا كولا', verdict: 'AVOID', time: 'منذ ساعة' },
  { id: '2', nameAr: 'نسكافيه', verdict: 'AVOID', time: 'منذ 3 ساعات' },
  { id: '3', nameAr: 'آر سي كولا', verdict: 'PREFERRED', time: 'منذ يوم' },
];

const badges = [
  { id: '1', name: 'مستكشف', icon: '🔍', description: 'مسح 100 منتج' },
  { id: '2', name: 'مساهم', icon: '✍️', description: 'أضف 10 منتجات' },
  { id: '3', name: 'مقاطع نشط', icon: '💪', description: 'تجنب 50 منتج' },
];

export function ProfilePage() {
  const { t } = useLanguageStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* User Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white text-3xl font-bold shadow-glow-md">
            {user?.displayName?.[0] || user?.username?.[0]?.toUpperCase() || '؟'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">
              {user?.displayName || user?.username || 'مستخدم'}
            </h1>
            <p className="text-dark-400">عضو منذ يناير 2024</p>
            <div className="flex gap-2 mt-2">
              <span className="tag-brand">المرتبة #{userStats.rank}</span>
              <span className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {userStats.points} نقطة
              </span>
            </div>
          </div>
          <button
            onClick={() => {/* Settings */}}
            className="p-3 rounded-xl bg-dark-700 text-dark-300 hover:bg-dark-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-brand-400">{userStats.scans}</div>
            <div className="text-xs text-dark-400">منتج تم مسحه</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-red-400">{userStats.avoided}</div>
            <div className="text-xs text-dark-400">تم تجنبه</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-emerald-400">{userStats.alternativesFound}</div>
            <div className="text-xs text-dark-400">بديل وجدته</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-700/50">
            <div className="text-2xl font-bold text-purple-400">{userStats.contributions}</div>
            <div className="text-xs text-dark-400">مساهمة</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <section className="mb-6">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-amber-500 rounded-full" />
          الشارات
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {badges.map((badge) => (
            <div key={badge.id} className="flex-shrink-0 glass-card p-4 text-center w-32">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-medium text-dark-100 text-sm">{badge.name}</div>
              <div className="text-xs text-dark-500 mt-1">{badge.description}</div>
            </div>
          ))}
          <div className="flex-shrink-0 glass-card p-4 text-center w-32 border-dashed border-dark-600 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 opacity-30">🔒</div>
            <div className="text-xs text-dark-500">المزيد قريباً</div>
          </div>
        </div>
      </section>

      {/* Recent Scans */}
      <section className="mb-6">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-brand-500 rounded-full" />
          المسح الأخير
        </h2>
        <div className="glass-card overflow-hidden">
          {recentScans.map((scan, index) => (
            <Link
              key={scan.id}
              to={`/product/${scan.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-dark-700/30 transition-colors ${
                index < recentScans.length - 1 ? 'border-b border-dark-700' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                scan.verdict === 'AVOID' ? 'bg-red-500/20' : 'bg-emerald-500/20'
              }`}>
                <span className={`font-bold ${
                  scan.verdict === 'AVOID' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {scan.verdict === 'AVOID' ? '✕' : '✓'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-dark-100">{scan.nameAr}</p>
                <p className="text-xs text-dark-500">{scan.time}</p>
              </div>
              <svg className="w-5 h-5 text-dark-500 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

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

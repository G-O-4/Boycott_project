import { Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';

export function Header() {
  const { language, setLanguage, t } = useLanguageStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/30 rounded-xl blur-md group-hover:blur-lg transition-all" />
            <div className="relative w-10 h-10 bg-dark-800 border border-dark-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🇵🇸</span>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-dark-100 group-hover:text-brand-400 transition-colors">
              {t('appName')}
            </h1>
            <p className="text-[10px] text-dark-500 font-medium tracking-wide uppercase">
              Libya Edition
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="p-2.5 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-all"
            aria-label={t('search')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-dark-800 border border-dark-600 text-dark-300 hover:border-brand-500/50 hover:text-brand-400 transition-all"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
                {user.displayName?.[0] || user.username?.[0]?.toUpperCase() || '?'}
              </button>
              <div className="absolute left-0 mt-2 w-48 py-2 bg-dark-800 border border-dark-600 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-dark-200 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                >
                  {t('profile')}
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-right px-4 py-2 text-red-400 hover:bg-dark-700 transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-sm py-2"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

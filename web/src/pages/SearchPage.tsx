import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';

const recentSearches = ['كوكا كولا', 'نسكافيه', 'شيبس ليز'];

const searchResults = [
  {
    id: '1',
    type: 'product',
    nameAr: 'كوكا كولا',
    nameEn: 'Coca Cola',
    brand: { nameAr: 'كوكا كولا', nameEn: 'Coca-Cola' },
    verdict: 'AVOID' as const,
  },
  {
    id: '2',
    type: 'product',
    nameAr: 'كوكا كولا زيرو',
    nameEn: 'Coca Cola Zero',
    brand: { nameAr: 'كوكا كولا', nameEn: 'Coca-Cola' },
    verdict: 'AVOID' as const,
  },
  {
    id: '3',
    type: 'alternative',
    nameAr: 'آر سي كولا',
    nameEn: 'RC Cola',
    brand: { nameAr: 'آر سي', nameEn: 'RC' },
    verdict: 'PREFERRED' as const,
  },
];

export function SearchPage() {
  const { t, language } = useLanguageStore();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchHint')}
            className="input pr-12"
            autoFocus
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Recent Searches */}
      {!hasSearched && (
        <section className="mb-8">
          <h2 className="text-sm text-dark-400 mb-3">عمليات البحث الأخيرة</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setQuery(search);
                  setHasSearched(true);
                }}
                className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 border border-dark-600 hover:border-dark-500 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {search}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      {hasSearched && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-dark-400">نتائج البحث</h2>
            <span className="text-sm text-dark-500">{searchResults.length} نتيجة</span>
          </div>
          
          <div className="space-y-3">
            {searchResults.map((result) => (
              <Link
                key={result.id}
                to={`/product/${result.id}`}
                className="glass-card-hover p-4 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  result.verdict === 'AVOID' 
                    ? 'bg-red-500/20' 
                    : result.verdict === 'PREFERRED'
                    ? 'bg-emerald-500/20'
                    : 'bg-dark-600'
                }`}>
                  <span className={`text-xl font-bold ${
                    result.verdict === 'AVOID' 
                      ? 'text-red-400' 
                      : result.verdict === 'PREFERRED'
                      ? 'text-emerald-400'
                      : 'text-dark-400'
                  }`}>
                    {result.verdict === 'AVOID' ? '✕' : result.verdict === 'PREFERRED' ? '✓' : '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark-100">
                    {language === 'ar' ? result.nameAr : result.nameEn}
                  </p>
                  <p className="text-sm text-dark-400">
                    {language === 'ar' ? result.brand.nameAr : result.brand.nameEn}
                  </p>
                </div>
                <VerdictBadge verdict={result.verdict} size="sm" showLabel={false} />
              </Link>
            ))}
          </div>

          {searchResults.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-dark-100 mb-2">لا توجد نتائج</h3>
              <p className="text-dark-400 text-sm mb-4">
                لم نجد منتجات تطابق بحثك
              </p>
              <Link to="/community" className="btn-outline">
                اقترح هذا المنتج
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Quick Actions */}
      {!hasSearched && (
        <section>
          <h2 className="text-sm text-dark-400 mb-3">أو جرّب</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/scan" className="glass-card-hover p-4 text-center">
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm font-medium text-dark-200">مسح باركود</p>
            </Link>
            <Link to="/discover" className="glass-card-hover p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-sm font-medium text-dark-200">تصفح البدائل</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

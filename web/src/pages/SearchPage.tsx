import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { searchApi } from '../lib/api';

interface SearchResult {
  id: string;
  type: 'product' | 'company' | 'brand';
  nameAr?: string;
  nameEn: string;
  verdictLabel?: 'AVOID' | 'CAUTION' | 'UNKNOWN' | 'PREFERRED';
  brand?: {
    nameAr?: string;
    nameEn: string;
  };
  company?: {
    nameAr?: string;
    nameEn: string;
  };
}

// Store recent searches in localStorage
const RECENT_SEARCHES_KEY = 'boycott_recent_searches';

const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentSearch = (query: string) => {
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter((s) => s !== query);
    const updated = [query, ...filtered].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};

export function SearchPage() {
  const { t, language } = useLanguageStore();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await searchApi.searchAll(searchQuery.trim(), 20);
      const data = response.data?.data || response.data || {};
      
      // Combine products and companies into results
      const products = (data.products || []).map((p: any) => ({
        id: p.id,
        type: 'product' as const,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        verdictLabel: p.verdictLabel,
        brand: p.brand ? {
          nameAr: p.brand.nameAr,
          nameEn: p.brand.nameEn,
        } : undefined,
      }));
      
      const companies = (data.companies || []).map((c: any) => ({
        id: c.id,
        type: 'company' as const,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        verdictLabel: c.verdictLabel,
      }));
      
      setResults([...products, ...companies]);
      
      // Save to recent searches
      addRecentSearch(searchQuery.trim());
      setRecentSearches(getRecentSearches());
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const getResultLink = (result: SearchResult) => {
    if (result.type === 'company') {
      return `/company/${result.id}`;
    }
    return `/product/${result.id}`;
  };

  const getResultSubtitle = (result: SearchResult) => {
    if (result.type === 'company') {
      return language === 'ar' ? 'شركة' : 'Company';
    }
    if (result.brand) {
      return language === 'ar' ? result.brand.nameAr || result.brand.nameEn : result.brand.nameEn;
    }
    return '';
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
            disabled={loading}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Recent Searches */}
      {!hasSearched && recentSearches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm text-dark-400 mb-3">عمليات البحث الأخيرة</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => handleRecentSearch(search)}
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
            <span className="text-sm text-dark-500">{results.length} نتيجة</span>
          </div>
          
          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-dark-400">جاري البحث...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={getResultLink(result)}
                  className="glass-card-hover p-4 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    result.verdictLabel === 'AVOID' 
                      ? 'bg-red-500/20' 
                      : result.verdictLabel === 'PREFERRED'
                      ? 'bg-emerald-500/20'
                      : result.verdictLabel === 'CAUTION'
                      ? 'bg-amber-500/20'
                      : 'bg-dark-600'
                  }`}>
                    <span className={`text-xl font-bold ${
                      result.verdictLabel === 'AVOID' 
                        ? 'text-red-400' 
                        : result.verdictLabel === 'PREFERRED'
                        ? 'text-emerald-400'
                        : result.verdictLabel === 'CAUTION'
                        ? 'text-amber-400'
                        : 'text-dark-400'
                    }`}>
                      {result.verdictLabel === 'AVOID' ? '✕' : 
                       result.verdictLabel === 'PREFERRED' ? '✓' : 
                       result.verdictLabel === 'CAUTION' ? '!' : '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark-100">
                      {language === 'ar' ? (result.nameAr || result.nameEn) : result.nameEn}
                    </p>
                    <p className="text-sm text-dark-400">
                      {getResultSubtitle(result)}
                    </p>
                  </div>
                  {result.verdictLabel && (
                    <VerdictBadge verdict={result.verdictLabel} size="sm" showLabel={false} />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-dark-100 mb-2">لا توجد نتائج</h3>
              <p className="text-dark-400 text-sm mb-4">
                لم نجد منتجات تطابق بحثك "{query}"
              </p>
              <Link to="/community/submit/product" className="btn-outline">
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

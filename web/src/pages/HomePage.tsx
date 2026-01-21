import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { productsApi, alternativesApi } from '../lib/api';

interface Stats {
  totalProducts: number;
  avoidProducts: number;
  preferredProducts: number;
  totalAlternatives: number;
}

interface TrendingProduct {
  id: string;
  nameAr?: string;
  nameEn: string;
  verdictLabel: string;
  scanCount: number;
  brand?: {
    nameAr?: string;
    nameEn: string;
    company?: {
      nameAr?: string;
      nameEn: string;
    };
  };
}

interface RecentAlternative {
  id: string;
  product: {
    id: string;
    nameAr?: string;
    nameEn: string;
    brand?: {
      nameAr?: string;
      nameEn: string;
    };
  };
  alternative: {
    id: string;
    nameAr?: string;
    nameEn: string;
    brand?: {
      nameAr?: string;
      nameEn: string;
    };
  };
}

export function HomePage() {
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Trending state
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Recent alternatives state
  const [recentAlternatives, setRecentAlternatives] = useState<RecentAlternative[]>([]);
  const [recentAltsLoading, setRecentAltsLoading] = useState(true);

  // Fetch stats on mount
  useEffect(() => {
    productsApi.getStats()
      .then((res) => {
        const data = res.data?.data || res.data;
        setStats(data);
      })
      .catch((err) => {
        console.error('Failed to fetch stats:', err);
      })
      .finally(() => {
        setStatsLoading(false);
      });
  }, []);

  // Fetch trending products on mount
  useEffect(() => {
    productsApi.getTrending(5)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setTrending(data);
      })
      .catch((err) => {
        console.error('Failed to fetch trending:', err);
      })
      .finally(() => {
        setTrendingLoading(false);
      });
  }, []);

  // Fetch recent alternatives on mount
  useEffect(() => {
    alternativesApi.getRecent(5)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setRecentAlternatives(data);
      })
      .catch((err) => {
        console.error('Failed to fetch recent alternatives:', err);
      })
      .finally(() => {
        setRecentAltsLoading(false);
      });
  }, []);

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'AVOID':
        return 'تجنب';
      case 'CAUTION':
        return 'احذر';
      case 'PREFERRED':
        return 'مفضل';
      default:
        return 'غير معروف';
    }
  };

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'AVOID':
        return 'verdict-avoid';
      case 'CAUTION':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'PREFERRED':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default:
        return 'bg-dark-600 text-dark-300 border border-dark-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-dark-100">ادعم </span>
            <span className="text-gradient">غزة</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-md mx-auto">
            {t('appTagline')}
          </p>
        </div>

        {/* Main Scan Card */}
        <div
          onClick={() => navigate('/scan')}
          className="glass-card-hover p-6 cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-dark-100 group-hover:text-brand-400 transition-colors">
                {t('scanProduct')}
              </h2>
              <p className="text-dark-400 text-sm mt-1">
                {t('pointCameraAtBarcode')}
              </p>
            </div>
            <svg className="w-5 h-5 text-dark-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="mb-10">
        <div
          onClick={() => navigate('/search')}
          className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-brand-500/50 transition-all"
        >
          <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-dark-500">{t('searchHint')}</span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-10">
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card">
            <div className="stat-value">
              {statsLoading ? '...' : (stats?.totalProducts?.toLocaleString() || '0')}
            </div>
            <div className="stat-label">منتج في قاعدة البيانات</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-red-400">
              {statsLoading ? '...' : (stats?.avoidProducts?.toLocaleString() || '0')}
            </div>
            <div className="stat-label">منتج يجب تجنبه</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-emerald-400">
              {statsLoading ? '...' : (stats?.totalAlternatives?.toLocaleString() || '0')}
            </div>
            <div className="stat-label">بديل محلي متاح</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-brand-500 rounded-full" />
          استكشف
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/discover" className="glass-card-hover p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-dark-100 mb-1">{t('alternatives')}</h3>
            <p className="text-sm text-dark-400">ابحث عن بدائل محلية وآمنة</p>
          </Link>
          
          <Link to="/search" className="glass-card-hover p-5">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-dark-100 mb-1">بحث متقدم</h3>
            <p className="text-sm text-dark-400">ابحث بالاسم أو الباركود</p>
          </Link>

          <Link to="/community" className="glass-card-hover p-5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-dark-100 mb-1">{t('community')}</h3>
            <p className="text-sm text-dark-400">ساهم مع المجتمع</p>
          </Link>

          <Link to="/profile" className="glass-card-hover p-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-bold text-dark-100 mb-1">إنجازاتك</h3>
            <p className="text-sm text-dark-400">تتبع مساهماتك</p>
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-10">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-brand-500 rounded-full" />
          {t('trending')}
        </h2>
        <div className="glass-card divide-y divide-dark-700">
          {trendingLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-dark-400 text-sm">جاري التحميل...</p>
            </div>
          ) : trending.length > 0 ? (
            trending.map((item, index) => {
              const name = language === 'ar' ? (item.nameAr || item.nameEn) : item.nameEn;
              const brandName = language === 'ar' 
                ? (item.brand?.company?.nameAr || item.brand?.company?.nameEn || item.brand?.nameAr || item.brand?.nameEn)
                : (item.brand?.company?.nameEn || item.brand?.nameEn);
              
              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-dark-700/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-500/20 text-amber-400' :
                    index === 1 ? 'bg-dark-600 text-dark-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark-100">{name}</div>
                    <div className="text-sm text-dark-400">{brandName}</div>
                  </div>
                  <div className="text-sm text-dark-500">{item.scanCount?.toLocaleString() || 0} مسح</div>
                  <div className={`${getVerdictClass(item.verdictLabel)} rounded-lg px-2 py-1 text-xs font-medium`}>
                    {getVerdictLabel(item.verdictLabel)}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-6 text-center">
              <p className="text-dark-400 text-sm">لا توجد منتجات رائجة بعد</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Alternatives */}
      <section className="mb-10">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-emerald-500 rounded-full" />
          بدائل مضافة حديثاً
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {recentAltsLoading ? (
            <div className="flex-shrink-0 glass-card p-4 w-44 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-dark-400 text-xs">جاري التحميل...</p>
            </div>
          ) : recentAlternatives.length > 0 ? (
            recentAlternatives.map((alt) => {
              const altName = language === 'ar' 
                ? (alt.alternative?.nameAr || alt.alternative?.nameEn) 
                : alt.alternative?.nameEn;
              const replacesName = language === 'ar'
                ? (alt.product?.nameAr || alt.product?.nameEn)
                : alt.product?.nameEn;
              
              return (
                <Link 
                  key={alt.id} 
                  to={`/product/${alt.alternative?.id}`}
                  className="flex-shrink-0 glass-card p-4 w-44 hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <div className="font-medium text-dark-100 text-sm mb-1 truncate">{altName}</div>
                  <div className="text-xs text-dark-400 truncate">بديل لـ {replacesName}</div>
                </Link>
              );
            })
          ) : (
            <div className="flex-shrink-0 glass-card p-4 w-44 text-center">
              <p className="text-dark-400 text-xs">لا توجد بدائل بعد</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-6">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-3">🇵🇸</div>
          <h3 className="text-lg font-bold text-dark-100 mb-2">ساهم معنا</h3>
          <p className="text-dark-400 text-sm mb-4">
            أضف منتجات جديدة أو بدائل محلية لمساعدة المجتمع
          </p>
          <Link to="/community" className="btn-primary">
            ابدأ المساهمة
          </Link>
        </div>
      </section>
    </div>
  );
}

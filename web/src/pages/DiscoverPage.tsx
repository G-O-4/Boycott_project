import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { StoreMapModal } from '../components/StoreMapModal';
import { searchApi, alternativesApi } from '../lib/api';

interface Category {
  id: string;
  nameAr?: string;
  nameEn: string;
  icon?: string;
  _count?: {
    products: number;
  };
}

interface Store {
  id: string;
  name: string;
  nameAr?: string;
  address?: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

interface StoreAvailability {
  id: string;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  createdAt: string;
  store: Store;
}

interface Alternative {
  id: string;
  isExactAlternative: boolean;
  notes?: string;
  notesAr?: string;
  product: {
    id: string;
    nameAr?: string;
    nameEn: string;
    verdictLabel: string;
    brand?: {
      nameAr?: string;
      nameEn: string;
    };
  };
  alternative: {
    id: string;
    nameAr?: string;
    nameEn: string;
    verdictLabel: string;
    brand?: {
      nameAr?: string;
      nameEn: string;
      company?: {
        id: string;
        nameAr?: string;
        nameEn: string;
        country?: string;
      };
    };
    category?: {
      id: string;
      nameAr?: string;
      nameEn: string;
    };
  };
  storeAvailability?: StoreAvailability[];
  _count?: {
    storeAvailability: number;
  };
}

interface AlternativeWithStores {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: { nameAr: string; nameEn: string };
  stores: {
    id: string;
    name: string;
    nameAr: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    priceMin: number;
    priceMax: number;
    currency: string;
    lastConfirmed: string;
  }[];
}

const defaultCategories: Category[] = [
  { id: 'all', nameAr: 'الكل', nameEn: 'All', icon: '📦' },
];

export function DiscoverPage() {
  const { language } = useLanguageStore();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyLocal, setShowOnlyLocal] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeWithStores | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    searchApi.getCategories()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        // Flatten categories (include children)
        const flatCategories: Category[] = [];
        data.forEach((cat: any) => {
          flatCategories.push(cat);
          if (cat.children) {
            flatCategories.push(...cat.children);
          }
        });
        setCategories([defaultCategories[0], ...flatCategories]);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
  }, []);

  // Fetch alternatives based on selected category
  useEffect(() => {
    setLoading(true);
    
    if (selectedCategory === 'all') {
      // Fetch top alternatives
      alternativesApi.getTop({ limit: 30 })
        .then((res) => {
          const data = res.data?.data || res.data || [];
          setAlternatives(data);
        })
        .catch((err) => {
          console.error('Failed to fetch alternatives:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Fetch alternatives by category
      alternativesApi.getByCategory(selectedCategory, { limit: 30 })
        .then((res) => {
          const data = res.data?.data || res.data;
          // Transform products to alternatives format
          const products = data?.products || [];
          const transformedAlternatives: Alternative[] = products.map((p: any) => ({
            id: p.id,
            isExactAlternative: false,
            product: { id: '', nameAr: '', nameEn: '', verdictLabel: 'AVOID' },
            alternative: {
              id: p.id,
              nameAr: p.nameAr,
              nameEn: p.nameEn,
              verdictLabel: p.verdictLabel,
              brand: p.brand,
              category: p.category,
            },
            storeAvailability: p.alternativeFor?.[0]?.storeAvailability || [],
            _count: { storeAvailability: p.alternativeFor?.[0]?.storeAvailability?.length || 0 },
          }));
          setAlternatives(transformedAlternatives);
        })
        .catch((err) => {
          console.error('Failed to fetch alternatives by category:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedCategory]);

  // Filter for local products (Libyan companies)
  const filteredAlternatives = alternatives.filter((alt) => {
    if (!showOnlyLocal) return true;
    const country = alt.alternative?.brand?.company?.country?.toLowerCase() || '';
    return country.includes('libya') || country.includes('ليبيا');
  });

  const handleShowStores = (alt: Alternative) => {
    const stores = (alt.storeAvailability || []).map(sa => ({
      id: sa.store.id,
      name: sa.store.name,
      nameAr: sa.store.nameAr || sa.store.name,
      address: sa.store.address || '',
      city: sa.store.city,
      lat: sa.store.latitude || 32.8872,
      lng: sa.store.longitude || 13.1913,
      priceMin: sa.priceMin || 0,
      priceMax: sa.priceMax || 0,
      currency: sa.currency || 'د.ل',
      lastConfirmed: sa.createdAt,
    }));
    
    setSelectedAlternative({
      id: alt.alternative.id,
      nameAr: alt.alternative.nameAr || alt.alternative.nameEn,
      nameEn: alt.alternative.nameEn,
      brand: {
        nameAr: alt.alternative.brand?.nameAr || alt.alternative.brand?.nameEn || '',
        nameEn: alt.alternative.brand?.nameEn || '',
      },
      stores,
    });
    setIsMapOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-100 mb-2">
          اكتشف <span className="text-gradient">البدائل</span>
        </h1>
        <p className="text-dark-400">
          ابحث عن بدائل محلية وآمنة للمنتجات المقاطعة
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'bg-dark-800 text-dark-300 border border-dark-600 hover:border-dark-500'
            }`}
          >
            {cat.icon && <span className="ml-2">{cat.icon}</span>}
            {language === 'ar' ? (cat.nameAr || cat.nameEn) : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyLocal}
              onChange={(e) => setShowOnlyLocal(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-0.5 after:start-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
          <span className="text-sm text-dark-300">منتجات ليبية فقط</span>
        </div>
        <span className="text-sm text-dark-500">
          {filteredAlternatives.length} بديل
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">جاري تحميل البدائل...</p>
        </div>
      )}

      {/* Alternatives Grid */}
      {!loading && (
        <div className="grid gap-4">
          {filteredAlternatives.map((alt) => {
            const altProduct = alt.alternative;
            const replacesProduct = alt.product;
            const altName = language === 'ar' ? (altProduct.nameAr || altProduct.nameEn) : altProduct.nameEn;
            const brandName = language === 'ar' 
              ? (altProduct.brand?.nameAr || altProduct.brand?.nameEn)
              : altProduct.brand?.nameEn;
            const replacesName = language === 'ar'
              ? (replacesProduct?.nameAr || replacesProduct?.nameEn)
              : replacesProduct?.nameEn;
            const storeCount = alt._count?.storeAvailability || alt.storeAvailability?.length || 0;
            const country = altProduct.brand?.company?.country?.toLowerCase() || '';
            const isLocal = country.includes('libya') || country.includes('ليبيا');

            return (
              <div key={alt.id} className="glass-card p-5">
                {/* Product Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-2xl text-emerald-400 font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/product/${altProduct.id}`} className="font-bold text-dark-100 hover:text-brand-400">
                        {altName}
                      </Link>
                      {isLocal && (
                        <span className="tag bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                          🇱🇾 ليبي
                        </span>
                      )}
                    </div>
                    {brandName && (
                      <p className="text-sm text-dark-400">{brandName}</p>
                    )}
                    {replacesName && (
                      <p className="text-xs text-dark-500 mt-1">
                        بديل لـ <span className="text-red-400">{replacesName}</span>
                      </p>
                    )}
                  </div>
                  <VerdictBadge verdict="PREFERRED" size="sm" showLabel={false} />
                </div>

                {/* Where to buy */}
                <div className="pt-4 border-t border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-dark-300">
                      {storeCount > 0 ? (
                        <>متوفر في <span className="text-brand-400 font-medium">{storeCount}</span> متجر</>
                      ) : (
                        'لا توجد متاجر مسجلة'
                      )}
                    </span>
                  </div>
                  {storeCount > 0 && (
                    <button
                      onClick={() => handleShowStores(alt)}
                      className="btn-primary text-sm py-2"
                    >
                      أين أجده؟
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAlternatives.length === 0 && !loading && (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-dark-100 mb-2">لا توجد بدائل</h3>
              <p className="text-dark-400 text-sm">
                جرب تغيير التصنيف أو المرشحات
              </p>
            </div>
          )}
        </div>
      )}

      {/* Suggest Alternative */}
      <div className="mt-8 glass-card p-6 text-center">
        <h3 className="font-bold text-dark-100 mb-2">هل تعرف بديلاً آخر؟</h3>
        <p className="text-dark-400 text-sm mb-4">
          ساعد المجتمع بإضافة بدائل جديدة
        </p>
        <Link to="/community/submit" className="btn-outline">
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          اقتراح بديل
        </Link>
      </div>

      {/* Store Map Modal */}
      {selectedAlternative && (
        <StoreMapModal
          isOpen={isMapOpen}
          onClose={() => {
            setIsMapOpen(false);
            setSelectedAlternative(null);
          }}
          productName={language === 'ar' ? selectedAlternative.nameAr : selectedAlternative.nameEn}
          stores={selectedAlternative.stores}
        />
      )}
    </div>
  );
}

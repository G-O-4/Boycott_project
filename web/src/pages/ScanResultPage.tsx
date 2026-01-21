import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { StoreMapModal } from '../components/StoreMapModal';
import { productsApi } from '../lib/api';

interface Store {
  id: string;
  name: string;
  nameAr?: string;
  address?: string;
  addressAr?: string;
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
  alternative: {
    id: string;
    nameAr?: string;
    nameEn: string;
    verdictLabel: string;
    brand?: {
      nameAr?: string;
      nameEn: string;
    };
  };
  storeAvailability?: StoreAvailability[];
}

interface Product {
  id: string;
  nameAr?: string;
  nameEn: string;
  barcode?: string;
  verdictLabel: 'AVOID' | 'CAUTION' | 'UNKNOWN' | 'PREFERRED';
  confidence: string;
  imageUrl?: string;
  brand?: {
    nameAr?: string;
    nameEn: string;
    company?: {
      id: string;
      nameAr?: string;
      nameEn: string;
    };
  };
  alternatives?: Alternative[];
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

export function ScanResultPage() {
  const { barcode } = useParams<{ barcode: string }>();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeWithStores | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!barcode) return;

    setLoading(true);
    setError(null);

    productsApi.getByBarcode(barcode)
      .then((res) => {
        const data = res.data?.data || res.data;
        if (data) {
          setProduct(data);
        } else {
          setError('المنتج غير موجود');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        if (err.response?.status === 404) {
          setError('لم يتم العثور على هذا المنتج في قاعدة البيانات');
        } else {
          setError('فشل في تحميل المنتج');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [barcode]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-dark-400">جاري البحث عن المنتج...</p>
        <p className="text-sm text-dark-500 mt-2 font-mono">{barcode}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-dark-100 mb-2">المنتج غير موجود</h2>
        <p className="text-dark-400 mb-2">{error}</p>
        <p className="text-sm text-dark-500 font-mono mb-6">{barcode}</p>
        <div className="space-y-3">
          <Link to="/community/submit" className="btn-primary block">
            أضف هذا المنتج
          </Link>
          <button onClick={() => navigate(-1)} className="btn-outline block w-full">
            العودة
          </button>
        </div>
      </div>
    );
  }

  const productName = language === 'ar' ? (product.nameAr || product.nameEn) : product.nameEn;
  const brandName = language === 'ar' 
    ? (product.brand?.nameAr || product.brand?.nameEn) 
    : product.brand?.nameEn;
  const companyName = language === 'ar' 
    ? (product.brand?.company?.nameAr || product.brand?.company?.nameEn) 
    : product.brand?.company?.nameEn;

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

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'AVOID':
        return { 
          icon: '✕', 
          text: 'تجنب هذا المنتج', 
          class: 'verdict-avoid shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
        };
      case 'CAUTION':
        return { 
          icon: '!', 
          text: 'تعامل بحذر', 
          class: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
        };
      case 'PREFERRED':
        return { 
          icon: '✓', 
          text: 'منتج مفضل', 
          class: 'verdict-preferred shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
        };
      default:
        return { 
          icon: '?', 
          text: 'غير معروف', 
          class: 'bg-dark-600 text-dark-300' 
        };
    }
  };

  const verdictInfo = getVerdictInfo(product.verdictLabel);
  const alternatives = product.alternatives || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
      >
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('back')}
      </button>

      {/* Product header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-dark-700 flex items-center justify-center text-3xl">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={productName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              '📦'
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">{productName}</h1>
            {brandName && <p className="text-dark-400">{brandName}</p>}
            {product.brand?.company && (
              <Link
                to={`/company/${product.brand.company.id}`}
                className="text-sm text-brand-400 hover:underline"
              >
                {companyName}
              </Link>
            )}
            <p className="text-xs text-dark-500 mt-1 font-mono">{product.barcode}</p>
          </div>
        </div>

        {/* Verdict */}
        <div className={`p-6 rounded-2xl text-center ${verdictInfo.class}`}>
          <div className="text-5xl font-bold mb-3">{verdictInfo.icon}</div>
          <div className="text-xl font-bold">{verdictInfo.text}</div>
          {product.confidence && (
            <p className="text-sm mt-2 opacity-80">
              الثقة: {product.confidence === 'HIGH' ? 'عالية' : product.confidence === 'MEDIUM' ? 'متوسطة' : 'منخفضة'}
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          to={`/product/${product.id}#alternatives`}
          className="glass-card-hover p-4 text-center"
        >
          <svg className="w-6 h-6 mx-auto mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-sm font-medium text-dark-200">{t('alternatives')}</span>
        </Link>
        <Link
          to={`/product/${product.id}#why`}
          className="glass-card-hover p-4 text-center"
        >
          <svg className="w-6 h-6 mx-auto mb-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-dark-200">لماذا؟</span>
        </Link>
        {product.brand?.company && (
          <Link
            to={`/company/${product.brand.company.id}`}
            className="glass-card-hover p-4 text-center"
          >
            <span className="text-2xl block mb-2">🔗</span>
            <span className="text-sm font-medium text-dark-200">سلسلة الملكية</span>
          </Link>
        )}
      </div>

      {/* Alternatives with "Where to buy" */}
      {alternatives.length > 0 && (
        <section>
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            البدائل المتاحة
          </h2>
          <div className="space-y-4">
            {alternatives.map((alt) => {
              const altProduct = alt.alternative;
              const altName = language === 'ar' 
                ? (altProduct.nameAr || altProduct.nameEn) 
                : altProduct.nameEn;
              const altBrand = language === 'ar'
                ? (altProduct.brand?.nameAr || altProduct.brand?.nameEn)
                : altProduct.brand?.nameEn;
              const stores = alt.storeAvailability || [];

              return (
                <div key={alt.id} className="glass-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-xl text-emerald-400 font-bold">✓</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/product/${altProduct.id}`} className="font-medium text-dark-100 hover:text-brand-400">
                          {altName}
                        </Link>
                        {alt.isExactAlternative && (
                          <span className="tag-brand text-xs">بديل مطابق</span>
                        )}
                      </div>
                      {altBrand && <p className="text-sm text-dark-400">{altBrand}</p>}
                    </div>
                    <VerdictBadge verdict="PREFERRED" size="sm" showLabel={false} />
                  </div>
                  
                  {/* Where to buy */}
                  <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
                    <span className="text-sm text-dark-400">
                      {stores.length > 0 ? (
                        <>متوفر في <span className="text-brand-400 font-medium">{stores.length}</span> متجر</>
                      ) : (
                        'لا توجد متاجر مسجلة'
                      )}
                    </span>
                    {stores.length > 0 && (
                      <button
                        onClick={() => handleShowStores(alt)}
                        className="text-sm text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        أين أجده؟
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* No alternatives message */}
      {alternatives.length === 0 && product.verdictLabel === 'AVOID' && (
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="font-bold text-dark-100 mb-2">لا توجد بدائل مسجلة حتى الآن</h3>
          <p className="text-dark-400 text-sm mb-4">
            ساعد المجتمع بإضافة بدائل لهذا المنتج
          </p>
          <Link to="/community/submit" className="btn-primary inline-flex items-center gap-2">
            أضف بديلاً
          </Link>
        </div>
      )}

      {/* Share */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: productName,
              text: product.verdictLabel === 'AVOID' 
                ? `اكتشف أن ${productName} ضمن قائمة المقاطعة. جرّب تطبيق مقاطعة!`
                : `اكتشف معلومات عن ${productName}. جرّب تطبيق مقاطعة!`,
              url: window.location.href,
            });
          }
        }}
        className="w-full btn-outline flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        مشاركة هذه المعلومات
      </button>

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

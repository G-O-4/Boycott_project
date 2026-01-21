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

interface Claim {
  id: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  issueType: string;
  confidence: string;
  evidenceSources?: {
    id: string;
    url: string;
    title: string;
    publisher?: string;
  }[];
}

interface Product {
  id: string;
  nameAr?: string;
  nameEn: string;
  barcode?: string;
  verdictLabel: 'AVOID' | 'CAUTION' | 'UNKNOWN' | 'PREFERRED';
  confidence: string;
  description?: string;
  descriptionAr?: string;
  imageUrl?: string;
  brand?: {
    nameAr?: string;
    nameEn: string;
    company?: {
      id: string;
      nameAr?: string;
      nameEn: string;
      verdictLabel: string;
    };
  };
  claims?: {
    claim: Claim;
  }[];
  alternatives?: Alternative[];
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAlternative, setSelectedAlternative] = useState<Alternative | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    productsApi.getById(id)
      .then((res) => {
        const data = res.data?.data || res.data;
        setProduct(data);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setError('فشل في تحميل المنتج');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-dark-400">جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-dark-100 mb-2">المنتج غير موجود</h2>
        <p className="text-dark-400 mb-6">{error || 'لم نتمكن من العثور على هذا المنتج'}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          العودة
        </button>
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

  const handleShowStores = (alternative: Alternative) => {
    setSelectedAlternative(alternative);
    setIsMapOpen(true);
  };

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'AVOID':
        return { icon: '✕', text: 'تجنب هذا المنتج', class: 'verdict-avoid shadow-[0_0_20px_rgba(239,68,68,0.2)]' };
      case 'CAUTION':
        return { icon: '!', text: 'تعامل بحذر', class: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' };
      case 'PREFERRED':
        return { icon: '✓', text: 'منتج مفضل', class: 'verdict-preferred shadow-[0_0_20px_rgba(16,185,129,0.2)]' };
      default:
        return { icon: '?', text: 'غير معروف', class: 'bg-dark-600 text-dark-300' };
    }
  };

  const verdictInfo = getVerdictInfo(product.verdictLabel);
  const claims = product.claims?.map(c => c.claim) || [];
  const alternatives = product.alternatives || [];

  // Map stores for the modal
  const getStoresForModal = (alt: Alternative) => {
    return (alt.storeAvailability || []).map(sa => ({
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
  };

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
          <div className="w-24 h-24 rounded-xl bg-dark-700 flex items-center justify-center text-4xl">
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
            {product.barcode && (
              <p className="text-xs text-dark-500 mt-2 font-mono">{product.barcode}</p>
            )}
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

      {/* Why Section */}
      {claims.length > 0 && (
        <section id="why">
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            لماذا؟
          </h2>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="glass-card p-5">
                <h3 className="font-bold text-dark-100 mb-2">
                  {language === 'ar' ? (claim.titleAr || claim.titleEn) : claim.titleEn}
                </h3>
                <p className="text-dark-400 text-sm mb-4">
                  {language === 'ar' ? (claim.descriptionAr || claim.descriptionEn) : claim.descriptionEn}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag bg-red-500/20 text-red-400 border border-red-500/30">
                    {claim.issueType === 'OCCUPATION' ? 'دعم الاحتلال' :
                     claim.issueType === 'FUNDING' ? 'تمويل' :
                     claim.issueType === 'HUMAN_RIGHTS' ? 'حقوق إنسان' :
                     claim.issueType}
                  </span>
                  <span className="tag-neutral">
                    الثقة: {claim.confidence === 'HIGH' ? 'عالية' : 'متوسطة'}
                  </span>
                </div>
                {claim.evidenceSources && claim.evidenceSources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-700">
                    <p className="text-xs text-dark-500 mb-2">المصادر:</p>
                    <div className="flex flex-wrap gap-2">
                      {claim.evidenceSources.slice(0, 3).map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-400 hover:underline"
                        >
                          {source.title || source.publisher || 'مصدر'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {product.brand?.company && (
            <Link
              to={`/company/${product.brand.company.id}#claims`}
              className="block text-center text-brand-400 mt-4 hover:underline"
            >
              عرض ادعاءات الشركة الأم ←
            </Link>
          )}
        </section>
      )}

      {/* Alternatives Section */}
      {alternatives.length > 0 && (
        <section id="alternatives">
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            {t('alternatives')}
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
                <div key={alt.id} className="glass-card p-5">
                  {/* Alternative info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-2xl text-emerald-400 font-bold">✓</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/product/${altProduct.id}`} className="font-medium text-dark-100 hover:text-brand-400">
                          {altName}
                        </Link>
                        {alt.isExactAlternative && (
                          <span className="tag-brand text-xs">بديل مطابق</span>
                        )}
                      </div>
                      {altBrand && <p className="text-sm text-dark-400">{altBrand}</p>}
                      {(alt.notes || alt.notesAr) && (
                        <p className="text-xs text-dark-500 mt-1">
                          {language === 'ar' ? (alt.notesAr || alt.notes) : alt.notes}
                        </p>
                      )}
                    </div>
                    <VerdictBadge verdict="PREFERRED" size="sm" showLabel={false} />
                  </div>

                  {/* Where to buy this alternative */}
                  <div className="pt-4 border-t border-dark-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-dark-300">
                          {stores.length > 0 ? (
                            <>متوفر في <span className="text-brand-400 font-medium">{stores.length}</span> متجر</>
                          ) : (
                            'لا توجد متاجر مسجلة'
                          )}
                        </span>
                      </div>
                      {stores.length > 0 && (
                        <button
                          onClick={() => handleShowStores(alt)}
                          className="btn-primary text-sm py-2"
                        >
                          عرض المتاجر
                        </button>
                      )}
                    </div>
                    
                    {/* Preview of stores */}
                    {stores.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stores.slice(0, 3).map(sa => (
                          <span key={sa.id} className="tag-neutral text-xs">
                            {sa.store.nameAr || sa.store.name} - {sa.store.city}
                          </span>
                        ))}
                        {stores.length > 3 && (
                          <span className="tag-neutral text-xs">+{stores.length - 3} أخرى</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Ownership chain */}
      {product.brand?.company && (
        <Link
          to={`/company/${product.brand.company.id}`}
          className="glass-card p-5 flex items-center gap-4 hover:border-dark-500 transition-all"
        >
          <span className="text-3xl">🔗</span>
          <div className="flex-1">
            <p className="font-bold text-dark-100">سلسلة الملكية</p>
            <p className="text-sm text-dark-400">اكتشف من يملك هذه العلامة التجارية</p>
          </div>
          <svg className="w-5 h-5 text-dark-500 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Store Map Modal */}
      {selectedAlternative && (
        <StoreMapModal
          isOpen={isMapOpen}
          onClose={() => {
            setIsMapOpen(false);
            setSelectedAlternative(null);
          }}
          productName={language === 'ar' 
            ? (selectedAlternative.alternative.nameAr || selectedAlternative.alternative.nameEn) 
            : selectedAlternative.alternative.nameEn}
          stores={getStoresForModal(selectedAlternative)}
        />
      )}
    </div>
  );
}

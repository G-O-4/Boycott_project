import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { StoreMapModal } from '../components/StoreMapModal';

// Demo alternative product with stores
interface AlternativeWithStores {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: { nameAr: string; nameEn: string };
  isExact: boolean;
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

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeWithStores | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Demo product data with alternatives that have store availability
  const product = {
    id: id,
    nameAr: 'كوكا كولا',
    nameEn: 'Coca Cola',
    barcode: '5449000000996',
    verdictLabel: 'AVOID' as const,
    confidence: 95,
    imageUrl: null,
    brand: {
      nameAr: 'كوكا كولا',
      nameEn: 'Coca-Cola',
      company: {
        id: '1',
        nameAr: 'شركة كوكا كولا',
        nameEn: 'The Coca-Cola Company',
      },
    },
    claims: [
      {
        id: '1',
        titleAr: 'دعم الاحتلال',
        titleEn: 'Support for occupation',
        descriptionAr: 'الشركة لها استثمارات ونشاط تجاري يدعم الاحتلال',
        descriptionEn: 'Company has investments and business activities supporting occupation',
        issueType: 'DIRECT_SUPPORT',
        confidence: 'HIGH',
      },
    ],
    alternatives: [
      {
        id: '2',
        nameAr: 'آر سي كولا',
        nameEn: 'RC Cola',
        brand: { nameAr: 'آر سي', nameEn: 'RC' },
        isExact: true,
        stores: [
          {
            id: 's1',
            name: 'Al-Riyada Supermarket',
            nameAr: 'سوبر ماركت الريادة',
            address: 'شارع الجمهورية',
            city: 'طرابلس',
            lat: 32.8872,
            lng: 13.1913,
            priceMin: 3.5,
            priceMax: 4.5,
            currency: 'د.ل',
            lastConfirmed: '2024-01-15',
          },
          {
            id: 's2',
            name: 'Al-Amal Store',
            nameAr: 'متجر الأمل',
            address: 'منطقة السراج',
            city: 'طرابلس',
            lat: 32.8752,
            lng: 13.1763,
            priceMin: 3.0,
            priceMax: 4.0,
            currency: 'د.ل',
            lastConfirmed: '2024-01-10',
          },
          {
            id: 's3',
            name: 'Al-Najma Supermarket',
            nameAr: 'سوبر ماركت النجمة',
            address: 'شارع عمر المختار',
            city: 'بنغازي',
            lat: 32.1194,
            lng: 20.0868,
            priceMin: 3.5,
            priceMax: 5.0,
            currency: 'د.ل',
            lastConfirmed: '2024-01-12',
          },
        ],
      },
      {
        id: '3',
        nameAr: 'بيبيتا',
        nameEn: 'Pepita',
        brand: { nameAr: 'بيبيتا', nameEn: 'Pepita' },
        isExact: false,
        stores: [
          {
            id: 's4',
            name: 'Unity Supermarket',
            nameAr: 'سوبر ماركت الوحدة',
            address: 'وسط المدينة',
            city: 'مصراتة',
            lat: 32.3754,
            lng: 15.0925,
            priceMin: 2.5,
            priceMax: 3.5,
            currency: 'د.ل',
            lastConfirmed: '2024-01-08',
          },
        ],
      },
    ] as AlternativeWithStores[],
  };

  const productName = language === 'ar' ? product.nameAr : product.nameEn;
  const brandName = language === 'ar' ? product.brand.nameAr : product.brand.nameEn;
  const companyName = language === 'ar' ? product.brand.company.nameAr : product.brand.company.nameEn;

  const handleShowStores = (alternative: AlternativeWithStores) => {
    setSelectedAlternative(alternative);
    setIsMapOpen(true);
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
            📦
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">{productName}</h1>
            <p className="text-dark-400">{brandName}</p>
            <Link
              to={`/company/${product.brand.company.id}`}
              className="text-sm text-brand-400 hover:underline"
            >
              {companyName}
            </Link>
            <p className="text-xs text-dark-500 mt-2 font-mono">{product.barcode}</p>
          </div>
        </div>

        {/* Verdict */}
        <div className={`p-6 rounded-2xl text-center verdict-avoid shadow-[0_0_20px_rgba(239,68,68,0.2)]`}>
          <div className="text-5xl font-bold mb-3">✕</div>
          <div className="text-xl font-bold">تجنب هذا المنتج</div>
          <p className="text-sm mt-2 opacity-80">الثقة: {product.confidence}%</p>
        </div>
      </div>

      {/* Why Section */}
      <section id="why">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-amber-500 rounded-full" />
          لماذا؟
        </h2>
        <div className="space-y-3">
          {product.claims.map((claim) => (
            <div key={claim.id} className="glass-card p-5">
              <h3 className="font-bold text-dark-100 mb-2">
                {language === 'ar' ? claim.titleAr : claim.titleEn}
              </h3>
              <p className="text-dark-400 text-sm mb-4">
                {language === 'ar' ? claim.descriptionAr : claim.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag bg-red-500/20 text-red-400 border border-red-500/30">
                  {claim.issueType === 'DIRECT_SUPPORT' ? 'دعم مباشر' : claim.issueType}
                </span>
                <span className="tag-neutral">
                  الثقة: {claim.confidence === 'HIGH' ? 'عالية' : 'متوسطة'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link
          to={`/company/${product.brand.company.id}#claims`}
          className="block text-center text-brand-400 mt-4 hover:underline"
        >
          عرض ادعاءات الشركة الأم ←
        </Link>
      </section>

      {/* Alternatives Section - Now with "Where to buy" per alternative */}
      <section id="alternatives">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-emerald-500 rounded-full" />
          {t('alternatives')}
        </h2>
        <div className="space-y-4">
          {product.alternatives.map((alt) => (
            <div key={alt.id} className="glass-card p-5">
              {/* Alternative info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-2xl text-emerald-400 font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-dark-100">
                      {language === 'ar' ? alt.nameAr : alt.nameEn}
                    </p>
                    {alt.isExact && (
                      <span className="tag-brand text-xs">بديل مطابق</span>
                    )}
                  </div>
                  <p className="text-sm text-dark-400">
                    {language === 'ar' ? alt.brand.nameAr : alt.brand.nameEn}
                  </p>
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
                      متوفر في <span className="text-brand-400 font-medium">{alt.stores.length}</span> متجر
                    </span>
                  </div>
                  <button
                    onClick={() => handleShowStores(alt)}
                    className="btn-primary text-sm py-2"
                  >
                    عرض المتاجر
                  </button>
                </div>
                
                {/* Preview of stores */}
                {alt.stores.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alt.stores.slice(0, 3).map(store => (
                      <span key={store.id} className="tag-neutral text-xs">
                        {store.nameAr} - {store.city}
                      </span>
                    ))}
                    {alt.stores.length > 3 && (
                      <span className="tag-neutral text-xs">+{alt.stores.length - 3} أخرى</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ownership chain */}
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

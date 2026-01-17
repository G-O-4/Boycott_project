import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { StoreMapModal } from '../components/StoreMapModal';

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

  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeWithStores | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Demo product data - in real app, this comes from API
  const product = {
    id: '1',
    nameAr: 'كوكا كولا',
    nameEn: 'Coca Cola',
    barcode: barcode,
    verdictLabel: 'AVOID' as const,
    confidence: 95,
    brand: {
      nameAr: 'كوكا كولا',
      nameEn: 'Coca-Cola',
      company: {
        id: '1',
        nameAr: 'شركة كوكا كولا',
        nameEn: 'The Coca-Cola Company',
      },
    },
    alternatives: [
      {
        id: '2',
        nameAr: 'آر سي كولا',
        nameEn: 'RC Cola',
        brand: { nameAr: 'آر سي', nameEn: 'RC' },
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
        ],
      },
      {
        id: '3',
        nameAr: 'بيبيتا',
        nameEn: 'Pepita',
        brand: { nameAr: 'بيبيتا', nameEn: 'Pepita' },
        stores: [
          {
            id: 's3',
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
          <div className="w-20 h-20 rounded-xl bg-dark-700 flex items-center justify-center text-3xl">
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
            <p className="text-xs text-dark-500 mt-1 font-mono">{product.barcode}</p>
          </div>
        </div>

        {/* Verdict */}
        <div className={`p-6 rounded-2xl text-center ${
          product.verdictLabel === 'AVOID' 
            ? 'verdict-avoid shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
            : product.verdictLabel === 'PREFERRED' 
            ? 'verdict-preferred shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : 'verdict-unknown'
        }`}>
          <div className="text-5xl font-bold mb-3">✕</div>
          <div className="text-xl font-bold">تجنب هذا المنتج</div>
          <p className="text-sm mt-2 opacity-80">الثقة: {product.confidence}%</p>
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
        <Link
          to={`/company/${product.brand.company.id}`}
          className="glass-card-hover p-4 text-center"
        >
          <span className="text-2xl block mb-2">🔗</span>
          <span className="text-sm font-medium text-dark-200">سلسلة الملكية</span>
        </Link>
      </div>

      {/* Alternatives with "Where to buy" */}
      {product.alternatives.length > 0 && (
        <section>
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            البدائل المتاحة
          </h2>
          <div className="space-y-4">
            {product.alternatives.map((alt) => (
              <div key={alt.id} className="glass-card p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-xl text-emerald-400 font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark-100">
                      {language === 'ar' ? alt.nameAr : alt.nameEn}
                    </p>
                    <p className="text-sm text-dark-400">
                      {language === 'ar' ? alt.brand.nameAr : alt.brand.nameEn}
                    </p>
                  </div>
                  <VerdictBadge verdict="PREFERRED" size="sm" showLabel={false} />
                </div>
                
                {/* Where to buy */}
                <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
                  <span className="text-sm text-dark-400">
                    متوفر في <span className="text-brand-400 font-medium">{alt.stores.length}</span> متجر
                  </span>
                  <button
                    onClick={() => handleShowStores(alt)}
                    className="text-sm text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    أين أجده؟
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Share */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: productName,
              text: `اكتشف أن ${productName} ضمن قائمة المقاطعة. جرّب تطبيق مقاطعة!`,
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

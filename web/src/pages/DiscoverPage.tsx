import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { StoreMapModal } from '../components/StoreMapModal';

const categories = [
  { id: 'all', nameAr: 'الكل', nameEn: 'All', icon: '📦' },
  { id: 'beverages', nameAr: 'المشروبات', nameEn: 'Beverages', icon: '🥤' },
  { id: 'snacks', nameAr: 'الوجبات الخفيفة', nameEn: 'Snacks', icon: '🍪' },
  { id: 'dairy', nameAr: 'الألبان', nameEn: 'Dairy', icon: '🥛' },
  { id: 'cleaning', nameAr: 'التنظيف', nameEn: 'Cleaning', icon: '🧴' },
  { id: 'personal', nameAr: 'العناية الشخصية', nameEn: 'Personal Care', icon: '🧼' },
];

interface AlternativeWithStores {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: { nameAr: string; nameEn: string };
  replaces: { nameAr: string; nameEn: string };
  category: string;
  isLocal: boolean;
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

const alternatives: AlternativeWithStores[] = [
  {
    id: '1',
    nameAr: 'آر سي كولا',
    nameEn: 'RC Cola',
    brand: { nameAr: 'آر سي', nameEn: 'RC' },
    replaces: { nameAr: 'كوكا كولا', nameEn: 'Coca-Cola' },
    category: 'beverages',
    isLocal: true,
    stores: [
      { id: 's1', name: 'Al-Riyada', nameAr: 'سوبر ماركت الريادة', address: 'شارع الجمهورية', city: 'طرابلس', lat: 32.8872, lng: 13.1913, priceMin: 3.5, priceMax: 4.5, currency: 'د.ل', lastConfirmed: '2024-01-15' },
      { id: 's2', name: 'Al-Amal', nameAr: 'متجر الأمل', address: 'منطقة السراج', city: 'طرابلس', lat: 32.8752, lng: 13.1763, priceMin: 3.0, priceMax: 4.0, currency: 'د.ل', lastConfirmed: '2024-01-10' },
      { id: 's3', name: 'Al-Najma', nameAr: 'سوبر ماركت النجمة', address: 'شارع عمر المختار', city: 'بنغازي', lat: 32.1194, lng: 20.0868, priceMin: 3.5, priceMax: 5.0, currency: 'د.ل', lastConfirmed: '2024-01-12' },
    ],
  },
  {
    id: '2',
    nameAr: 'توفي ليبيا',
    nameEn: 'Toffee Libya',
    brand: { nameAr: 'ليبيا للحلويات', nameEn: 'Libya Sweets' },
    replaces: { nameAr: 'كيتكات', nameEn: 'KitKat' },
    category: 'snacks',
    isLocal: true,
    stores: [
      { id: 's4', name: 'Unity', nameAr: 'سوبر ماركت الوحدة', address: 'وسط المدينة', city: 'مصراتة', lat: 32.3754, lng: 15.0925, priceMin: 2.0, priceMax: 3.0, currency: 'د.ل', lastConfirmed: '2024-01-08' },
    ],
  },
  {
    id: '3',
    nameAr: 'حليب الريف',
    nameEn: 'Al-Reef Milk',
    brand: { nameAr: 'الريف', nameEn: 'Al-Reef' },
    replaces: { nameAr: 'حليب نستله', nameEn: 'Nestlé Milk' },
    category: 'dairy',
    isLocal: true,
    stores: [
      { id: 's1', name: 'Al-Riyada', nameAr: 'سوبر ماركت الريادة', address: 'شارع الجمهورية', city: 'طرابلس', lat: 32.8872, lng: 13.1913, priceMin: 5.0, priceMax: 6.5, currency: 'د.ل', lastConfirmed: '2024-01-14' },
      { id: 's5', name: 'Al-Salam', nameAr: 'متجر السلام', address: 'منطقة الحدائق', city: 'بنغازي', lat: 32.1094, lng: 20.0768, priceMin: 4.5, priceMax: 6.0, currency: 'د.ل', lastConfirmed: '2024-01-11' },
    ],
  },
  {
    id: '4',
    nameAr: 'بيبيتا',
    nameEn: 'Pepita',
    brand: { nameAr: 'بيبيتا', nameEn: 'Pepita' },
    replaces: { nameAr: 'بيبسي', nameEn: 'Pepsi' },
    category: 'beverages',
    isLocal: false,
    stores: [
      { id: 's4', name: 'Unity', nameAr: 'سوبر ماركت الوحدة', address: 'وسط المدينة', city: 'مصراتة', lat: 32.3754, lng: 15.0925, priceMin: 2.5, priceMax: 3.5, currency: 'د.ل', lastConfirmed: '2024-01-08' },
    ],
  },
  {
    id: '5',
    nameAr: 'صابون بلدي',
    nameEn: 'Baladi Soap',
    brand: { nameAr: 'صناعة محلية', nameEn: 'Local Made' },
    replaces: { nameAr: 'دوف', nameEn: 'Dove' },
    category: 'personal',
    isLocal: true,
    stores: [
      { id: 's2', name: 'Al-Amal', nameAr: 'متجر الأمل', address: 'منطقة السراج', city: 'طرابلس', lat: 32.8752, lng: 13.1763, priceMin: 8.0, priceMax: 12.0, currency: 'د.ل', lastConfirmed: '2024-01-09' },
    ],
  },
];

export function DiscoverPage() {
  const { language } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyLocal, setShowOnlyLocal] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeWithStores | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const filteredAlternatives = alternatives.filter((alt) => {
    if (selectedCategory !== 'all' && alt.category !== selectedCategory) return false;
    if (showOnlyLocal && !alt.isLocal) return false;
    return true;
  });

  const handleShowStores = (alt: AlternativeWithStores) => {
    setSelectedAlternative(alt);
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
            <span className="ml-2">{cat.icon}</span>
            {language === 'ar' ? cat.nameAr : cat.nameEn}
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

      {/* Alternatives Grid */}
      <div className="grid gap-4">
        {filteredAlternatives.map((alt) => (
          <div key={alt.id} className="glass-card p-5">
            {/* Product Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl text-emerald-400 font-bold">✓</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-dark-100">
                    {language === 'ar' ? alt.nameAr : alt.nameEn}
                  </p>
                  {alt.isLocal && (
                    <span className="tag bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                      🇱🇾 ليبي
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-400">
                  {language === 'ar' ? alt.brand.nameAr : alt.brand.nameEn}
                </p>
                <p className="text-xs text-dark-500 mt-1">
                  بديل لـ <span className="text-red-400">{language === 'ar' ? alt.replaces.nameAr : alt.replaces.nameEn}</span>
                </p>
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
                  متوفر في <span className="text-brand-400 font-medium">{alt.stores.length}</span> متجر
                </span>
              </div>
              <button
                onClick={() => handleShowStores(alt)}
                className="btn-primary text-sm py-2"
              >
                أين أجده؟
              </button>
            </div>
          </div>
        ))}

        {filteredAlternatives.length === 0 && (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-dark-100 mb-2">لا توجد بدائل</h3>
            <p className="text-dark-400 text-sm">
              جرب تغيير التصنيف أو المرشحات
            </p>
          </div>
        )}
      </div>

      {/* Suggest Alternative */}
      <div className="mt-8 glass-card p-6 text-center">
        <h3 className="font-bold text-dark-100 mb-2">هل تعرف بديلاً آخر؟</h3>
        <p className="text-dark-400 text-sm mb-4">
          ساعد المجتمع بإضافة بدائل جديدة
        </p>
        <Link to="/community" className="btn-outline">
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

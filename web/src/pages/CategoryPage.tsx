import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';

const categoryData: Record<string, { nameAr: string; nameEn: string; icon: string }> = {
  'beverages': { nameAr: 'المشروبات', nameEn: 'Beverages', icon: '🥤' },
  'snacks': { nameAr: 'الوجبات الخفيفة', nameEn: 'Snacks', icon: '🍪' },
  'dairy': { nameAr: 'الألبان', nameEn: 'Dairy', icon: '🥛' },
};

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguageStore();
  const navigate = useNavigate();

  const category = id ? categoryData[id] : null;

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-xl font-bold text-dark-100 mb-4">التصنيف غير موجود</h2>
        <Link to="/discover" className="btn-primary">استكشف البدائل</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors mb-6"
      >
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        رجوع
      </button>

      {/* Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{category.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-dark-100">
              {language === 'ar' ? category.nameAr : category.nameEn}
            </h1>
            <p className="text-dark-400">تصفح المنتجات والبدائل</p>
          </div>
        </div>
      </div>

      {/* Products would be loaded here */}
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-3">📦</div>
        <h3 className="font-bold text-dark-100 mb-2">قريباً</h3>
        <p className="text-dark-400 text-sm">
          سيتم إضافة المنتجات قريباً
        </p>
      </div>
    </div>
  );
}

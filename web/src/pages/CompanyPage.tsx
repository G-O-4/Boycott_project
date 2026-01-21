import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';
import { companiesApi } from '../lib/api';

interface Brand {
  id: string;
  nameAr?: string;
  nameEn: string;
  _count?: {
    products: number;
  };
}

interface Claim {
  id: string;
  titleAr?: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn: string;
  issueType: string;
  confidence: string;
  evidenceSources?: {
    id: string;
    url: string;
    title: string;
    publisher?: string;
  }[];
}

interface Company {
  id: string;
  nameAr?: string;
  nameEn: string;
  country?: string;
  verdictLabel: 'AVOID' | 'CAUTION' | 'UNKNOWN' | 'PREFERRED';
  confidence: string;
  description?: string;
  descriptionAr?: string;
  logoUrl?: string;
  brands?: Brand[];
  claims?: {
    claim: Claim;
  }[];
  parentCompany?: {
    id: string;
    nameAr?: string;
    nameEn: string;
    verdictLabel: string;
  } | null;
  subsidiaries?: {
    id: string;
    nameAr?: string;
    nameEn: string;
  }[];
}

export function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    companiesApi.getById(id)
      .then((res) => {
        const data = res.data?.data || res.data;
        setCompany(data);
      })
      .catch((err) => {
        console.error('Failed to fetch company:', err);
        setError('فشل في تحميل الشركة');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-dark-400">جاري تحميل الشركة...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-dark-100 mb-2">الشركة غير موجودة</h2>
        <p className="text-dark-400 mb-6">{error || 'لم نتمكن من العثور على هذه الشركة'}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          العودة
        </button>
      </div>
    );
  }

  const companyName = language === 'ar' ? (company.nameAr || company.nameEn) : company.nameEn;
  const brands = company.brands || [];
  const claims = company.claims?.map(c => c.claim) || [];
  const subsidiaries = company.subsidiaries || [];

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'AVOID':
        return { 
          icon: '✕', 
          text: 'تجنب منتجات هذه الشركة', 
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
          text: 'شركة مفضلة', 
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

  const verdictInfo = getVerdictInfo(company.verdictLabel);

  const getIssueTypeLabel = (issueType: string) => {
    switch (issueType) {
      case 'DIRECT_SUPPORT':
      case 'OCCUPATION':
        return 'دعم الاحتلال';
      case 'FUNDING':
        return 'تمويل';
      case 'HUMAN_RIGHTS':
        return 'حقوق إنسان';
      case 'SETTLEMENT':
        return 'مستوطنات';
      case 'MILITARY':
        return 'عسكري';
      default:
        return issueType;
    }
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

      {/* Company header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-dark-700 flex items-center justify-center">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={companyName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <svg className="w-10 h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">{companyName}</h1>
            {company.country && <p className="text-dark-400">{company.country}</p>}
            <div className="flex gap-2 mt-2">
              {brands.length > 0 && (
                <span className="tag-neutral">
                  {brands.length} علامة تجارية
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {(company.description || company.descriptionAr) && (
          <p className="text-dark-400 text-sm mb-6">
            {language === 'ar' ? (company.descriptionAr || company.description) : company.description}
          </p>
        )}

        {/* Verdict */}
        <div className={`p-5 rounded-xl text-center ${verdictInfo.class}`}>
          <div className="text-4xl font-bold mb-2">{verdictInfo.icon}</div>
          <div className="text-lg font-bold">{verdictInfo.text}</div>
          {company.confidence && (
            <p className="text-sm mt-2 opacity-80">
              الثقة: {company.confidence === 'HIGH' ? 'عالية' : company.confidence === 'MEDIUM' ? 'متوسطة' : 'منخفضة'}
            </p>
          )}
        </div>
      </div>

      {/* Ownership Chain */}
      <section>
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-brand-500 rounded-full" />
          سلسلة الملكية
        </h2>
        <div className="glass-card p-5">
          {/* Parent Company */}
          {company.parentCompany && (
            <Link 
              to={`/company/${company.parentCompany.id}`}
              className="flex items-center gap-4 bg-dark-700/50 p-4 rounded-xl border border-dark-600 mb-4 hover:border-dark-500 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-dark-500 mb-1">الشركة الأم</p>
                <p className="font-medium text-dark-200">
                  {language === 'ar' 
                    ? (company.parentCompany.nameAr || company.parentCompany.nameEn) 
                    : company.parentCompany.nameEn}
                </p>
              </div>
              <VerdictBadge verdict={company.parentCompany.verdictLabel as any} size="sm" showLabel={false} />
            </Link>
          )}

          {/* Current Company */}
          <div className="flex items-center gap-4 bg-brand-500/10 p-4 rounded-xl border border-brand-500/20">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark-100">{companyName}</p>
              <VerdictBadge verdict={company.verdictLabel} size="sm" />
            </div>
          </div>

          {/* Subsidiaries */}
          {subsidiaries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-600">
              <p className="text-sm text-dark-400 mb-3">الشركات التابعة:</p>
              <div className="flex flex-wrap gap-2">
                {subsidiaries.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/company/${sub.id}`}
                    className="tag-neutral hover:bg-dark-600 transition-colors"
                  >
                    {language === 'ar' ? (sub.nameAr || sub.nameEn) : sub.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Claims */}
      {claims.length > 0 && (
        <section id="claims">
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-red-500 rounded-full" />
            الادعاءات والأدلة
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
                    {getIssueTypeLabel(claim.issueType)}
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
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section>
          <h2 className="section-title mb-4">
            <span className="w-1 h-5 bg-purple-500 rounded-full" />
            العلامات التجارية التابعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {brands.map((brand) => (
              <div key={brand.id} className="glass-card p-4">
                <p className="font-medium text-dark-100">
                  {language === 'ar' ? (brand.nameAr || brand.nameEn) : brand.nameEn}
                </p>
                {brand._count?.products !== undefined && (
                  <p className="text-xs text-dark-500 mt-1">
                    {brand._count.products} منتج
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No claims message for preferred companies */}
      {claims.length === 0 && company.verdictLabel === 'PREFERRED' && (
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="font-bold text-dark-100 mb-2">شركة موصى بها</h3>
          <p className="text-dark-400 text-sm">
            هذه الشركة ليست ضمن قائمة المقاطعة وتعتبر بديلاً جيداً
          </p>
        </div>
      )}
    </div>
  );
}

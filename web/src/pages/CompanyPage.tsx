import { useParams, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { VerdictBadge } from '../components/VerdictBadge';

export function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  // Demo company data
  const company = {
    id: id,
    nameAr: 'شركة كوكا كولا',
    nameEn: 'The Coca-Cola Company',
    country: 'الولايات المتحدة',
    verdictLabel: 'AVOID' as const,
    logoUrl: null,
    brands: [
      { id: '1', nameAr: 'كوكا كولا', nameEn: 'Coca-Cola', productCount: 25 },
      { id: '2', nameAr: 'فانتا', nameEn: 'Fanta', productCount: 12 },
      { id: '3', nameAr: 'سبرايت', nameEn: 'Sprite', productCount: 8 },
      { id: '4', nameAr: 'مينت مايد', nameEn: 'Minute Maid', productCount: 15 },
    ],
    claims: [
      {
        id: '1',
        titleAr: 'دعم الاحتلال',
        titleEn: 'Support for occupation',
        descriptionAr: 'الشركة لها استثمارات ونشاط تجاري يدعم الاحتلال',
        descriptionEn: 'Company has investments and business activities supporting occupation',
        issueType: 'DIRECT_SUPPORT',
      },
    ],
    parentCompany: null,
    alsoOwns: [
      { id: '5', nameAr: 'كوستا كوفي', nameEn: 'Costa Coffee' },
      { id: '6', nameAr: 'داساني', nameEn: 'Dasani' },
    ],
  };

  const companyName = language === 'ar' ? company.nameAr : company.nameEn;

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
            <svg className="w-10 h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-100">{companyName}</h1>
            <p className="text-dark-400">{company.country}</p>
            <div className="flex gap-2 mt-2">
              <span className="tag-neutral">
                {company.brands.length} علامة تجارية
              </span>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="verdict-avoid p-5 rounded-xl text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="text-4xl font-bold mb-2">✕</div>
          <div className="text-lg font-bold">تجنب منتجات هذه الشركة</div>
        </div>
      </div>

      {/* Ownership Chain */}
      <section>
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-brand-500 rounded-full" />
          سلسلة الملكية
        </h2>
        <div className="glass-card p-5">
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

          {/* Also owns */}
          {company.alsoOwns.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-600">
              <p className="text-sm text-dark-400 mb-3">تمتلك أيضاً:</p>
              <div className="flex flex-wrap gap-2">
                {company.alsoOwns.map((brand) => (
                  <span key={brand.id} className="tag-neutral">
                    {language === 'ar' ? brand.nameAr : brand.nameEn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Claims */}
      <section id="claims">
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-red-500 rounded-full" />
          الادعاءات والأدلة
        </h2>
        <div className="space-y-3">
          {company.claims.map((claim) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section>
        <h2 className="section-title mb-4">
          <span className="w-1 h-5 bg-purple-500 rounded-full" />
          العلامات التجارية التابعة
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {company.brands.map((brand) => (
            <div key={brand.id} className="glass-card p-4">
              <p className="font-medium text-dark-100">
                {language === 'ar' ? brand.nameAr : brand.nameEn}
              </p>
              <p className="text-xs text-dark-500 mt-1">
                {brand.productCount} منتج
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

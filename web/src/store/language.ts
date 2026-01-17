import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ar' | 'en';

const translations: Record<string, { ar: string; en: string }> = {
  appName: { ar: 'مقاطعة', en: 'Boycott' },
  appTagline: { ar: 'اعرف المنتج… وبدّله ببديل متاح', en: 'Know the product... and swap it for an alternative' },
  home: { ar: 'الرئيسية', en: 'Home' },
  scan: { ar: 'امسح', en: 'Scan' },
  discover: { ar: 'اكتشف', en: 'Discover' },
  community: { ar: 'المجتمع', en: 'Community' },
  profile: { ar: 'حسابي', en: 'Profile' },
  search: { ar: 'بحث', en: 'Search' },
  searchHint: { ar: 'ابحث بالاسم أو الباركود...', en: 'Search by name or barcode...' },
  scanProduct: { ar: 'امسح المنتج', en: 'Scan Product' },
  pointCameraAtBarcode: { ar: 'وجّه الكاميرا نحو الباركود', en: 'Point camera at barcode' },
  recentScans: { ar: 'المسح الأخير', en: 'Recent Scans' },
  trending: { ar: 'الأكثر بحثاً', en: 'Trending' },
  alternatives: { ar: 'البدائل', en: 'Alternatives' },
  login: { ar: 'تسجيل الدخول', en: 'Sign In' },
  logout: { ar: 'تسجيل الخروج', en: 'Sign Out' },
  back: { ar: 'العودة', en: 'Back' },
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (arOrKey: string, en?: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (language) => set({ language }),
      t: (arOrKey: string, en?: string) => {
        const lang = get().language;
        
        // If second argument provided, use inline translation
        if (en !== undefined) {
          return lang === 'ar' ? arOrKey : en;
        }
        
        // Otherwise, look up in translations map
        const translation = translations[arOrKey];
        if (translation) {
          return lang === 'ar' ? translation.ar : translation.en;
        }
        
        // Fallback to key
        return arOrKey;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

// Translation helper hook
export const useTranslation = () => {
  const { language, t } = useLanguageStore();
  return { language, t };
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const LIBYAN_CITIES = [
  { id: 'tripoli', nameEn: 'Tripoli', nameAr: 'طرابلس' },
  { id: 'benghazi', nameEn: 'Benghazi', nameAr: 'بنغازي' },
  { id: 'misrata', nameEn: 'Misrata', nameAr: 'مصراتة' },
  { id: 'zawiya', nameEn: 'Zawiya', nameAr: 'الزاوية' },
  { id: 'zliten', nameEn: 'Zliten', nameAr: 'زليتن' },
  { id: 'sabha', nameEn: 'Sabha', nameAr: 'سبها' },
  { id: 'al-khums', nameEn: 'Al Khums', nameAr: 'الخمس' },
  { id: 'tobruk', nameEn: 'Tobruk', nameAr: 'طبرق' },
  { id: 'ajdabiya', nameEn: 'Ajdabiya', nameAr: 'إجدابيا' },
  { id: 'sirte', nameEn: 'Sirte', nameAr: 'سرت' },
];

interface CityState {
  selectedCity: string;
  setCity: (city: string) => void;
  getCityName: (lang: 'ar' | 'en') => string;
}

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      selectedCity: 'tripoli',
      setCity: (city) => set({ selectedCity: city }),
      getCityName: (lang) => {
        const city = LIBYAN_CITIES.find((c) => c.id === get().selectedCity);
        return lang === 'ar' ? city?.nameAr || 'طرابلس' : city?.nameEn || 'Tripoli';
      },
    }),
    {
      name: 'city-storage',
    }
  )
);


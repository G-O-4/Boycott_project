import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submissionsApi } from '../lib/api';
import { useLanguageStore } from '../store/language';

type UiType = 'product' | 'alternative' | 'store' | 'evidence';

export function CommunitySubmitPage() {
  const { type } = useParams<{ type: string }>();
  const uiType = (type as UiType) || 'product';

  const navigate = useNavigate();
  const { language } = useLanguageStore();

  // حقول عامة
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [barcode, setBarcode] = useState('');

  // حقول المتجر
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');


  // دليل/روابط
  const [evidenceText, setEvidenceText] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    switch (uiType) {
      case 'product':
        return 'أضف منتج مقاطعة';
      case 'alternative':
        return 'اقترح بديل';
      case 'store':
        return 'أضف متجر';
      case 'evidence':
        return 'أضف دليل';
      default:
        return 'مساهمة جديدة';
    }
  }, [uiType]);

  // ✅ targetType مطابق لما يتوقعه الباكند غالبًا (بدل ALTERNATIVE / EVIDENCE)
  const targetType = useMemo(() => {
    switch (uiType) {
      case 'store':
        return 'STORE';
      case 'evidence':
        return 'CLAIM'; // دليل عادة يرتبط بادعاء/claim
      case 'product':
      case 'alternative':
      default:
        return 'PRODUCT';
    }
  }, [uiType]);

  const parseEvidenceSources = (text: string) => {
  const clean = (s: string) =>
    s
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // إزالة علامات RTL/LTR المخفية
      .trim();

  const lines = text
    .split('\n')
    .map(clean)
    .filter(Boolean)
    .map((u) => (u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`)); // اختياري

  if (lines.length === 0) {
    return { ok: false as const, error: 'أضف رابط واحد على الأقل' };
  }

  for (const u of lines) {
    try {
      const url = new URL(u);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { ok: false as const, error: `الرابط لازم يبدأ بـ http/https: ${u}` };
      }
    } catch {
      return { ok: false as const, error: `الرابط غير صحيح: ${u}` };
    }
  }

  return { ok: true as const, value: lines };
};


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ev = parseEvidenceSources(evidenceText);
      if (!ev.ok) {
        toast.error(ev.error);
        setLoading(false);
        return;
      }

      // ✅ تحقق حسب النوع
      if (uiType === 'store') {
        if (!nameAr.trim() && !nameEn.trim()) {
          toast.error('اكتب اسم المتجر (عربي أو إنجليزي)');
          setLoading(false);
          return;
        }
        if (!city.trim()) {
          toast.error('اكتب المدينة');
          setLoading(false);
          return;
        }
        if (!address.trim()) {
          toast.error('اكتب العنوان');
          setLoading(false);
          return;
        }
      }

      if (uiType === 'product' || uiType === 'alternative') {
        if (!nameAr.trim() && !nameEn.trim()) {
          toast.error('اكتب اسم عربي أو إنجليزي على الأقل');
          setLoading(false);
          return;
        }
        // الباركود اختياري (لكن لو كتبته لازم يكون أرقام)
        if (barcode.trim() && !/^\d+$/.test(barcode.trim())) {
          toast.error('الباركود يجب أن يكون أرقام فقط');
          setLoading(false);
          return;
        }
      }

      // ✅ نبني proposedData بشكل مناسب
      const proposedData: Record<string, unknown> = {
  language,
  uiType,
};

if (note.trim()) proposedData.note = note.trim();

// الاسم: لا نرسل null أبداً
if (uiType !== 'evidence') {
  if (nameAr.trim()) proposedData.nameAr = nameAr.trim();
  if (nameEn.trim()) proposedData.nameEn = nameEn.trim();
}

// المنتج/البديل: الباركود اختياري لكن لا نرسل null
if (uiType === 'product' || uiType === 'alternative') {
  if (barcode.trim()) proposedData.barcode = barcode.trim();
  proposedData.verdictLabel = uiType === 'product' ? 'AVOID' : 'PREFERRED';
}

// المتجر: city و address مطلوبين (وبالتالي سيكونوا string)
if (uiType === 'store') {
  proposedData.city = city.trim();
  proposedData.address = address.trim();
}


      toast.success('تم إرسال المساهمة للمراجعة ✅');
      navigate('/community');
    } catch (err: any) {
      // ✅ أظهر تفاصيل التحقق إن رجعها الباكند
      const backend = err?.response?.data;
      const msg =
        backend?.error?.errors?.[0]?.message ||
        backend?.error?.message ||
        backend?.message ||
        'Validation error';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ placeholders حسب طلبك:
  // - في البدائل والمتجر: بدون أمثلة
  const nameArPlaceholder =
    uiType === 'product' ? 'مثال: كوكا كولا' : 'اكتب الاسم بالعربي';
  const nameEnPlaceholder =
    uiType === 'product' ? 'Example: Coca Cola' : 'اكتب الاسم بالإنجليزي';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="text-dark-400 hover:text-dark-200 mb-4">
        ← رجوع
      </button>

      <div className="glass-card p-6">
        <h1 className="text-xl font-bold text-dark-100 mb-1">{title}</h1>
        <p className="text-dark-400 text-sm mb-6">
          أضف البيانات الأساسية + روابط مصادر (سطر لكل رابط).
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* ✅ حقول الاسم للمنتج/البديل/المتجر (لكن في evidence لا نعرضها) */}
          {uiType !== 'evidence' && (
            <>
              <div>
                <label className="block text-sm text-dark-300 mb-2">
                  {uiType === 'store' ? 'اسم المتجر بالعربي' : 'الاسم بالعربي'}
                </label>
                <input
                  className="input"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={nameArPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">
                  {uiType === 'store' ? 'اسم المتجر بالإنجليزي' : 'الاسم بالإنجليزي'}
                </label>
                <input
                  className="input"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder={nameEnPlaceholder}
                  dir="ltr"
                />
              </div>
            </>
          )}

          {/* ✅ الباركود يظهر فقط للمنتج/البديل — ويُلغى للمتجر حسب طلبك */}
          {(uiType === 'product' || uiType === 'alternative') && (
            <div>
              <label className="block text-sm text-dark-300 mb-2">الباركود (اختياري)</label>
              <input
                className="input"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="628..."
                dir="ltr"
              />
            </div>
          )}

          {/* ✅ حقول المتجر */}
          {uiType === 'store' && (
            <>
              <div>
                <label className="block text-sm text-dark-300 mb-2">المدينة (مطلوب)</label>
                <input
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="اكتب المدينة"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">العنوان (مطلوب)</label>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اكتب العنوان"
                />
              </div>
            </>
          )}

          {/* ✅ ملاحظة اختيارية */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">ملاحظة (اختياري)</label>
            <textarea
              className="input min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ملاحظة قصيرة..."
            />
          </div>

          {/* ✅ المصادر/الأدلة */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">المصادر / الأدلة (مطلوب)</label>
            <textarea
              className="input min-h-[120px]"
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder={'ضع رابط لكل مصدر في سطر منفصل\nhttps://...\nhttps://...'}
              dir="ltr"
            />
            <p className="text-xs text-dark-500 mt-2">
              لازم كل سطر يكون رابط يبدأ بـ <span className="font-mono">https://</span>
            </p>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </form>
      </div>
    </div>
  );
}

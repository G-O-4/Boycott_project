import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';

const recentSubmissions = [
  { id: '1', type: 'product', nameAr: 'شوكولاتة ميلكا', status: 'pending', user: 'أحمد م.', time: 'منذ ساعة' },
  { id: '2', type: 'alternative', nameAr: 'بسكويت التاج', status: 'approved', user: 'سارة ع.', time: 'منذ 3 ساعات' },
  { id: '3', type: 'store', nameAr: 'سوبر ماركت النور', status: 'pending', user: 'محمد ك.', time: 'منذ 5 ساعات' },
];

const leaderboard = [
  { rank: 1, name: 'أحمد محمد', points: 1250, badge: '🏆' },
  { rank: 2, name: 'سارة علي', points: 980, badge: '🥈' },
  { rank: 3, name: 'محمد خالد', points: 756, badge: '🥉' },
  { rank: 4, name: 'فاطمة عمر', points: 620, badge: '' },
  { rank: 5, name: 'عمر حسن', points: 543, badge: '' },
];

export function CommunityPage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'contribute' | 'leaderboard' | 'recent'>('contribute');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-100 mb-2">
          {t('community')} <span className="text-gradient">المجتمع</span>
        </h1>
        <p className="text-dark-400">
          ساهم معنا في بناء قاعدة بيانات شاملة
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'contribute', label: 'ساهم' },
          { id: 'leaderboard', label: 'المتصدرين' },
          { id: 'recent', label: 'مساهمات حديثة' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'bg-dark-800 text-dark-300 border border-dark-600 hover:border-dark-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contribute Tab */}
      {activeTab === 'contribute' && (
        <div className="space-y-4">
          <Link to="/community/submit/product" className="glass-card-hover p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark-100">أضف منتج مقاطعة</h3>
              <p className="text-sm text-dark-400">أبلغ عن منتج يجب مقاطعته</p>
            </div>
            <div className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
              +50 نقطة
            </div>
          </Link>

          <Link to="/community/submit/alternative" className="glass-card-hover p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark-100">اقترح بديل</h3>
              <p className="text-sm text-dark-400">أضف بديل آمن لمنتج مقاطعة</p>
            </div>
            <div className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
              +30 نقطة
            </div>
          </Link>

          <Link to="/community/submit/store" className="glass-card-hover p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark-100">أضف متجر</h3>
              <p className="text-sm text-dark-400">أضف متجر يوفر البدائل</p>
            </div>
            <div className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
              +20 نقطة
            </div>
          </Link>

          <Link to="/community/submit/evidence" className="glass-card-hover p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl">📎</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark-100">أضف دليل</h3>
              <p className="text-sm text-dark-400">ارفق مصدر أو دليل لادعاء</p>
            </div>
            <div className="tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
              +25 نقطة
            </div>
          </Link>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-dark-700">
            <h3 className="font-bold text-dark-100">أفضل المساهمين هذا الشهر</h3>
          </div>
          <div className="divide-y divide-dark-700">
            {leaderboard.map((user) => (
              <div key={user.rank} className="p-4 flex items-center gap-4 hover:bg-dark-700/30 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  user.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                  user.rank === 2 ? 'bg-dark-600 text-dark-300' :
                  user.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-dark-700 text-dark-400'
                }`}>
                  {user.badge || user.rank}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark-100">{user.name}</p>
                </div>
                <div className="text-brand-400 font-bold">{user.points.toLocaleString()} نقطة</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions Tab */}
      {activeTab === 'recent' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-dark-700">
            <h3 className="font-bold text-dark-100">المساهمات الأخيرة</h3>
          </div>
          <div className="divide-y divide-dark-700">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  sub.type === 'product' ? 'bg-red-500/20' :
                  sub.type === 'alternative' ? 'bg-emerald-500/20' :
                  'bg-brand-500/20'
                }`}>
                  {sub.type === 'product' ? '📦' :
                   sub.type === 'alternative' ? '✅' : '📍'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark-100">{sub.nameAr}</p>
                  <p className="text-sm text-dark-500">بواسطة {sub.user} • {sub.time}</p>
                </div>
                <span className={`tag ${
                  sub.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {sub.status === 'approved' ? 'موافق عليه' : 'قيد المراجعة'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="stat-card">
          <div className="stat-value">1,247</div>
          <div className="stat-label">مساهم نشط</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3,891</div>
          <div className="stat-label">مساهمة هذا الشهر</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">89%</div>
          <div className="stat-label">نسبة القبول</div>
        </div>
      </div>
    </div>
  );
}

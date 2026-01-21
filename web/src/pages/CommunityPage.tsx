import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import { usersApi, submissionsApi } from '../lib/api';

interface LeaderboardUser {
  id: string;
  displayName: string;
  displayNameAr?: string;
  avatar?: string;
  scoreTotal: number;
  reputationLevel: number;
  _count?: {
    submissions: number;
    storeConfirmations: number;
  };
}

interface Submission {
  id: string;
  targetType: string;
  proposedData: string;
  status: string;
  createdAt: string;
  submitter: {
    id: string;
    displayName: string;
    displayNameAr?: string;
    avatar?: string;
    reputationLevel: number;
  };
  voteCounts?: {
    support: number;
    needsEvidence: number;
    disagree: number;
  };
}

export function CommunityPage() {
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'contribute' | 'leaderboard' | 'recent'>('contribute');
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  
  // Recent submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  
  // Community stats state
  const [stats, setStats] = useState({
    activeContributors: 0,
    monthlySubmissions: 0,
    approvalRate: 0,
  });

  // Fetch leaderboard when tab is selected
  useEffect(() => {
    if (activeTab === 'leaderboard' && leaderboard.length === 0) {
      setLeaderboardLoading(true);
      usersApi.getLeaderboard({ limit: 10 })
        .then((res) => {
          const data = res.data?.data?.leaderboard || res.data?.leaderboard || [];
          setLeaderboard(data);
        })
        .catch((err) => {
          console.error('Failed to fetch leaderboard:', err);
        })
        .finally(() => {
          setLeaderboardLoading(false);
        });
    }
  }, [activeTab, leaderboard.length]);

  // Fetch recent submissions when tab is selected
  useEffect(() => {
    if (activeTab === 'recent' && submissions.length === 0) {
      setSubmissionsLoading(true);
      submissionsApi.getAll({ limit: 10 })
        .then((res) => {
          const data = res.data?.data?.submissions || res.data?.submissions || [];
          setSubmissions(data);
          
          // Calculate stats from submissions
          const approved = data.filter((s: Submission) => s.status === 'APPROVED').length;
          const total = data.length;
          setStats({
            activeContributors: new Set(data.map((s: Submission) => s.submitter?.id)).size,
            monthlySubmissions: total,
            approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
          });
        })
        .catch((err) => {
          console.error('Failed to fetch submissions:', err);
        })
        .finally(() => {
          setSubmissionsLoading(false);
        });
    }
  }, [activeTab, submissions.length]);

  // Parse proposed data to get name
  const getSubmissionName = (sub: Submission) => {
    try {
      const data = JSON.parse(sub.proposedData);
      return language === 'ar' ? (data.nameAr || data.nameEn || 'بدون اسم') : (data.nameEn || data.nameAr || 'No name');
    } catch {
      return 'بدون اسم';
    }
  };

  // Get submission type for display
  const getSubmissionType = (sub: Submission) => {
    try {
      const data = JSON.parse(sub.proposedData);
      return data.uiType || sub.targetType?.toLowerCase() || 'product';
    } catch {
      return sub.targetType?.toLowerCase() || 'product';
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'منذ دقائق';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString(language === 'ar' ? 'ar-LY' : 'en-US');
  };

  // Get badge for rank
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

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
            {leaderboardLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-dark-400">جاري التحميل...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-dark-400">لا يوجد مساهمين بعد</p>
              </div>
            ) : (
              leaderboard.map((user, index) => {
                const rank = index + 1;
                const badge = getRankBadge(rank);
                const name = language === 'ar' 
                  ? (user.displayNameAr || user.displayName)
                  : (user.displayName || user.displayNameAr);
                
                return (
                  <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-dark-700/30 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                      rank === 2 ? 'bg-dark-600 text-dark-300' :
                      rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-dark-700 text-dark-400'
                    }`}>
                      {badge || rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark-100">{name}</p>
                    </div>
                    <div className="text-brand-400 font-bold">{user.scoreTotal.toLocaleString()} نقطة</div>
                  </div>
                );
              })
            )}
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
            {submissionsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-dark-400">جاري التحميل...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-dark-400">لا توجد مساهمات بعد</p>
                <Link to="/community/submit/product" className="btn-primary mt-4 inline-block">
                  كن أول من يساهم
                </Link>
              </div>
            ) : (
              submissions.map((sub) => {
                const subType = getSubmissionType(sub);
                const submitterName = language === 'ar'
                  ? (sub.submitter?.displayNameAr || sub.submitter?.displayName || 'مجهول')
                  : (sub.submitter?.displayName || sub.submitter?.displayNameAr || 'Anonymous');
                
                return (
                  <div key={sub.id} className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      subType === 'product' ? 'bg-red-500/20' :
                      subType === 'alternative' ? 'bg-emerald-500/20' :
                      'bg-brand-500/20'
                    }`}>
                      {subType === 'product' ? '📦' :
                       subType === 'alternative' ? '✅' : '📍'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark-100">{getSubmissionName(sub)}</p>
                      <p className="text-sm text-dark-500">
                        بواسطة {submitterName} • {formatRelativeTime(sub.createdAt)}
                      </p>
                    </div>
                    <span className={`tag ${
                      sub.status === 'APPROVED' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : sub.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {sub.status === 'APPROVED' ? 'موافق عليه' : 
                       sub.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="stat-card">
          <div className="stat-value">{stats.activeContributors || '—'}</div>
          <div className="stat-label">مساهم نشط</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.monthlySubmissions || '—'}</div>
          <div className="stat-label">مساهمة هذا الشهر</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.approvalRate ? `${stats.approvalRate}%` : '—'}</div>
          <div className="stat-label">نسبة القبول</div>
        </div>
      </div>
    </div>
  );
}

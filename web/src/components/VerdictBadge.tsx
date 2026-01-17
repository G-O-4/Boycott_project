import { useLanguageStore } from '../store/language';

type VerdictType = 'AVOID' | 'CAUTION' | 'PREFERRED' | 'UNKNOWN';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const verdictConfig = {
  AVOID: {
    icon: '✕',
    labelAr: 'تجنب',
    labelEn: 'Avoid',
    colors: 'verdict-avoid',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  },
  CAUTION: {
    icon: '!',
    labelAr: 'احذر',
    labelEn: 'Caution',
    colors: 'verdict-caution',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  PREFERRED: {
    icon: '✓',
    labelAr: 'مفضل',
    labelEn: 'Preferred',
    colors: 'verdict-preferred',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  },
  UNKNOWN: {
    icon: '?',
    labelAr: 'غير معروف',
    labelEn: 'Unknown',
    colors: 'verdict-unknown',
    glow: '',
  },
};

const sizeConfig = {
  sm: {
    badge: 'w-6 h-6 text-xs',
    text: 'text-xs',
    gap: 'gap-1.5',
  },
  md: {
    badge: 'w-8 h-8 text-sm',
    text: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    badge: 'w-12 h-12 text-lg',
    text: 'text-base',
    gap: 'gap-3',
  },
};

export function VerdictBadge({
  verdict,
  size = 'md',
  showLabel = true,
  className = '',
}: VerdictBadgeProps) {
  const { language } = useLanguageStore();
  const config = verdictConfig[verdict];
  const sizeStyles = sizeConfig[size];

  return (
    <div className={`flex items-center ${sizeStyles.gap} ${className}`}>
      <div
        className={`
          ${sizeStyles.badge} 
          ${config.colors} 
          ${config.glow}
          rounded-lg flex items-center justify-center font-bold
          transition-all duration-200
        `}
      >
        {config.icon}
      </div>
      {showLabel && (
        <span className={`${sizeStyles.text} font-medium ${config.colors.replace('bg-', 'text-').split(' ')[0]}`}>
          {language === 'ar' ? config.labelAr : config.labelEn}
        </span>
      )}
    </div>
  );
}

// Large verdict display for product pages
export function VerdictDisplay({ verdict }: { verdict: VerdictType }) {
  const { language } = useLanguageStore();
  const config = verdictConfig[verdict];

  return (
    <div className={`p-6 rounded-2xl ${config.colors} ${config.glow} text-center`}>
      <div className="text-5xl font-bold mb-3">{config.icon}</div>
      <div className="text-xl font-bold">
        {language === 'ar' ? config.labelAr : config.labelEn}
      </div>
    </div>
  );
}

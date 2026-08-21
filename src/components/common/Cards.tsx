import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, className, padding = 'md' }: CardProps) => {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };
  return (
    <div className={clsx('bg-white rounded-xl border border-gray-200 shadow-sm', paddings[padding], className)}>
      {children}
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
  onClick?: () => void;
}

export const KPICard = ({ title, value, subtitle, icon, trend, trendValue, color = 'green', onClick }: KPICardProps) => {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  return (
    <div
      className={clsx('bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-shadow', onClick && 'cursor-pointer hover:shadow-md')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' && <span className="text-green-600 text-xs font-medium">↑ {trendValue}</span>}
              {trend === 'down' && <span className="text-red-500 text-xs font-medium">↓ {trendValue}</span>}
              {trend === 'stable' && <span className="text-gray-500 text-xs font-medium">→ {trendValue || 'Stable'}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ml-3', colors[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// Section header inside a page
export const SectionHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
  </div>
);

// Empty state
export const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">{icon}</div>
    <h3 className="text-base font-semibold text-gray-700">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-400 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Loading skeleton
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);

export const CardSkeleton = () => (
  <Card>
    <Skeleton className="h-4 w-1/3 mb-3" />
    <Skeleton className="h-8 w-1/2 mb-2" />
    <Skeleton className="h-3 w-2/3" />
  </Card>
);

// Progress bar
export const ProgressBar = ({ value, max = 100, color = 'green', showLabel = false }: { value: number; max?: number; color?: string; showLabel?: boolean }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', orange: 'bg-orange-500',
    red: 'bg-red-500', yellow: 'bg-yellow-400', purple: 'bg-purple-500',
  };
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all', colors[color] || 'bg-green-500')} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-500 mt-1">{pct}%</span>}
    </div>
  );
};

// Divider
export const Divider = ({ className }: { className?: string }) => (
  <hr className={clsx('border-t border-gray-100', className)} />
);

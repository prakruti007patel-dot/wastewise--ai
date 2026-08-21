import clsx from 'clsx';
import type { AlertType, Priority } from '../../types';

// Status badge
export const StatusBadge = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const styles: Record<string, string> = {
    submitted: 'bg-gray-100 text-gray-700',
    ai_classified: 'bg-purple-100 text-purple-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-200 text-gray-500',
    on_route: 'bg-blue-100 text-blue-700',
    idle: 'bg-gray-100 text-gray-600',
    maintenance: 'bg-orange-100 text-orange-700',
    full: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    monitoring: 'bg-blue-100 text-blue-700',
    needs_attention: 'bg-orange-100 text-orange-700',
    pending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    overflow: 'bg-red-100 text-red-700',
    collected: 'bg-green-100 text-green-700',
    skipped: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<string, string> = {
    submitted: 'Submitted', ai_classified: 'AI Classified', assigned: 'Assigned',
    in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed',
    on_route: 'On Route', idle: 'Idle', maintenance: 'Maintenance',
    full: 'Full', completed: 'Completed', active: 'Active',
    monitoring: 'Monitoring', needs_attention: 'Needs Attention',
    pending: 'Pending', sent: 'Sent', failed: 'Failed',
    overflow: 'Overflow', collected: 'Collected', skipped: 'Skipped',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status] || 'bg-gray-100 text-gray-600', className)}>
      {labels[status] || status}
    </span>
  );
};

// Priority badge
export const PriorityBadge = ({ priority, className }: { priority: Priority; className?: string }) => {
  const styles: Record<Priority, string> = {
    low: 'bg-green-50 text-green-700 border border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    critical: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', styles[priority], className)}>
      {priority}
    </span>
  );
};

// Alert type badge
export const AlertBadge = ({ type }: { type: AlertType }) => {
  const styles: Record<AlertType, string> = {
    critical: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    ai_recommendation: 'bg-purple-100 text-purple-700',
  };
  const labels: Record<AlertType, string> = {
    critical: 'Critical', warning: 'Warning', info: 'Info', ai_recommendation: 'AI Insight'
  };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[type])}>
      {labels[type]}
    </span>
  );
};

// Trend indicator
export const TrendIndicator = ({ trend, value, suffix = '%' }: { trend: 'up' | 'down' | 'stable'; value?: number; suffix?: string }) => {
  if (trend === 'up') return <span className="text-green-600 text-sm font-medium">↑ {value != null ? `${value}${suffix}` : ''}</span>;
  if (trend === 'down') return <span className="text-red-500 text-sm font-medium">↓ {value != null ? `${value}${suffix}` : ''}</span>;
  return <span className="text-gray-500 text-sm font-medium">→ Stable</span>;
};

// Risk level badge
export const RiskBadge = ({ risk }: { risk: 'low' | 'medium' | 'high' }) => {
  const styles = { low: 'bg-green-50 text-green-700', medium: 'bg-yellow-50 text-yellow-700', high: 'bg-red-50 text-red-700' };
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize', styles[risk])}>{risk} risk</span>;
};

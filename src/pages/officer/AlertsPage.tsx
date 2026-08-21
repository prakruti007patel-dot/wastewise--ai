import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Bot, Bell, Filter } from 'lucide-react';
import { Card, SectionHeader } from '../../components/common/Cards';
import { AlertBadge, PriorityBadge } from '../../components/common/Badges';
import { Button } from '../../components/common/Buttons';
import { PageHeader, Tabs } from '../../components/common/Table';
import { useNavigate } from 'react-router-dom';
import { alerts as initialAlerts } from '../../data/alerts';
import type { Alert, AlertType } from '../../types';

const alertIcons: Record<AlertType, React.ReactNode> = {
  critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  ai_recommendation: <Bot className="w-5 h-5 text-purple-500" />,
};

const alertBg: Record<AlertType, string> = {
  critical: 'border-l-4 border-l-red-500 bg-red-50',
  warning: 'border-l-4 border-l-yellow-500 bg-yellow-50',
  info: 'border-l-4 border-l-blue-500 bg-blue-50',
  ai_recommendation: 'border-l-4 border-l-purple-500 bg-purple-50',
};

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState('all');

  const markRead = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const unreadCount = alertList.filter(a => !a.isRead).length;
  const criticalCount = alertList.filter(a => a.type === 'critical').length;
  const warningCount = alertList.filter(a => a.type === 'warning').length;
  const aiCount = alertList.filter(a => a.type === 'ai_recommendation').length;

  const filtered = alertList.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !a.isRead;
    if (activeTab === 'critical') return a.type === 'critical';
    if (activeTab === 'ai') return a.type === 'ai_recommendation';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: alertList.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'critical', label: 'Critical', count: criticalCount },
    { id: 'ai', label: 'AI Insights', count: aiCount },
  ];

  return (
    <div>
      <PageHeader
        title="Alerts & Recommendations"
        subtitle="System alerts, AI insights, and critical operational notifications"
        breadcrumb="Officer · Alerts"
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCircle className="w-4 h-4" /> Mark All Read
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Alerts', value: alertList.length, color: 'text-gray-900' },
          { label: 'Unread', value: unreadCount, color: 'text-orange-600' },
          { label: 'Critical', value: criticalCount, color: 'text-red-600' },
          { label: 'AI Insights', value: aiCount, color: 'text-purple-600' },
        ].map((s, i) => (
          <Card key={i} className="text-center py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No alerts in this category</p>
            </div>
          ) : filtered.map(alert => (
            <div
              key={alert.id}
              className={`rounded-xl p-4 border flex items-start gap-4 transition-opacity ${alertBg[alert.type]} ${alert.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5">{alertIcons[alert.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertBadge type={alert.type} />
                      <PriorityBadge priority={alert.priority} />
                      {!alert.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.message}</p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {new Date(alert.createdAt).toLocaleString('en-IN')}
                      {alert.wardId && ` · Ward ${alert.wardId}`}
                      {alert.vehicleId && ` · ${alert.vehicleId}`}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {!alert.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(alert.id)}>
                      Mark Read
                    </Button>
                  )}
                  {alert.actionLabel && alert.actionRoute && (
                    <Button size="sm" variant="outline" onClick={() => navigate(alert.actionRoute!)}>
                      {alert.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

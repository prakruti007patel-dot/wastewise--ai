import { useState } from 'react';
import { Bell, CheckCircle, Filter } from 'lucide-react';
import { Card, SectionHeader } from '../../components/common/Cards';
import { Button } from '../../components/common/Buttons';
import { PageHeader, Tabs } from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { notifications as initialNotifications } from '../../data/alerts';
import type { Notification } from '../../types';

const typeIcons: Record<string, string> = {
  grievance: '📋',
  route: '🗺️',
  compliance: '♻️',
  vehicle: '🚛',
  system: '⚙️',
  ai: '🤖',
  nudge: '📲',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifList, setNotifList] = useState<Notification[]>(
    initialNotifications.filter(n => n.role === 'all' || n.role === (user?.role || 'citizen'))
  );
  const [activeTab, setActiveTab] = useState('all');

  const markRead = (id: string) => {
    setNotifList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unread = notifList.filter(n => !n.isRead).length;
  const filtered = activeTab === 'unread' ? notifList.filter(n => !n.isRead) : notifList;

  const tabs = [
    { id: 'all', label: 'All', count: notifList.length },
    { id: 'unread', label: 'Unread', count: unread },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="System messages, alerts, and updates"
        breadcrumb="Notifications"
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
            <CheckCircle className="w-4 h-4" /> Mark All Read
          </Button>
        }
      />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${n.isRead ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50'}`}
                onClick={() => markRead(n.id)}
              >
                <span className="text-xl flex-shrink-0">{typeIcons[n.type] || '📢'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

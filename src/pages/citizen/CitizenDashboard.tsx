import { useNavigate } from 'react-router-dom';
import { ClipboardList, MessageSquare, BookOpen, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, KPICard } from '../../components/common/Cards';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Button } from '../../components/common/Buttons';
import { PageHeader } from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { grievances } from '../../data/grievances';
import { wards } from '../../data/wards';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const myGrievances = grievances.filter(g => g.wardId === (user?.wardId || 12)).slice(0, 3);
  const ward = wards.find(w => w.id === (user?.wardId || 12));

  const scheduleItems = [
    { day: 'Monday', time: '7:00 AM - 9:00 AM', type: 'Wet & Dry Waste', status: 'completed' },
    { day: 'Wednesday', time: '7:00 AM - 9:00 AM', type: 'Wet & Dry Waste', status: 'upcoming' },
    { day: 'Friday', time: '7:00 AM - 9:00 AM', type: 'Wet & Dry Waste', status: 'upcoming' },
    { day: 'Saturday', time: '9:00 AM - 11:00 AM', type: 'Dry & Hazardous', status: 'upcoming' },
  ];

  const nudge = {
    en: 'Please separate wet and dry waste before handing it to the collection team.',
    gu: 'કૃપા કરીને કચરો કલેક્શન ટીમ ને આપતા પહેલા ભીનો અને સૂકો કચરો અલગ કરો.',
    hi: 'कृपया कचरा संग्रहण टीम को देने से पहले गीले और सूखे कचरे को अलग करें।',
  };

  return (
    <div>
      <PageHeader
        title={language === 'gu' ? 'નાગરિક ડેશબોર્ડ' : language === 'hi' ? 'नागरिक डैशबोर्ड' : 'Citizen Dashboard'}
        subtitle={`${t.common.demoNote} · ${user?.name || 'Citizen'}`}
        breadcrumb="Citizen · Dashboard"
        actions={
          <Button icon={<ClipboardList className="w-4 h-4" />} onClick={() => navigate('/citizen/report-grievance')}>
            {t.grievance.title}
          </Button>
        }
      />

      {/* Segregation nudge banner */}
      <div className="mb-5 p-4 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">♻️</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">{language === 'gu' ? 'કચરો અલગ કરવાની રીઝ' : language === 'hi' ? 'पृथक्करण अनुस्मारक' : 'Segregation Reminder'}</p>
          <p className="text-sm text-gray-700 mt-0.5">{nudge[language as 'en' | 'gu' | 'hi']}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KPICard title={t.nav.myGrievances} value={myGrievances.length} subtitle="In your ward" color="blue" onClick={() => navigate('/citizen/my-grievances')} />
        <KPICard title="Ward Compliance" value={`${ward?.segregationCompliance || 61}%`} color={ward?.segregationCompliance && ward.segregationCompliance >= 75 ? 'green' : 'orange'} />
        <KPICard title="Next Collection" value="Tomorrow" subtitle="7:00 AM - 9:00 AM" color="green" onClick={() => navigate('/citizen/schedule')} />
        <KPICard title="Ward" value={`Ward ${user?.wardId || 12}`} subtitle="Your registered ward" color="gray" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* My recent grievances */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">{t.nav.myGrievances}</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/citizen/my-grievances')}>View All</Button>
          </div>
          {myGrievances.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No grievances yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myGrievances.map(g => (
                <div key={g.id} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-blue-600">{g.id}</p>
                    <p className="text-xs font-medium text-gray-800 mt-0.5">{g.categoryLabel}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{new Date(g.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={g.status} />
                    <PriorityBadge priority={g.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Button icon={<ClipboardList className="w-4 h-4" />} className="w-full" onClick={() => navigate('/citizen/report-grievance')}>
              {t.grievance.title}
            </Button>
          </div>
        </Card>

        {/* Collection schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">{t.nav.collectionSchedule}</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/citizen/schedule')}>Full Schedule</Button>
          </div>
          <div className="space-y-2">
            {scheduleItems.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${s.status === 'completed' ? 'bg-gray-50 opacity-60' : 'bg-green-50 border border-green-100'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.status === 'completed' ? 'bg-gray-200' : 'bg-green-100'}`}>
                  {s.status === 'completed' ? <CheckCircle className="w-4 h-4 text-gray-400" /> : <Calendar className="w-4 h-4 text-green-600" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{s.day}</p>
                  <p className="text-[11px] text-gray-500">{s.time} · {s.type}</p>
                </div>
                {s.status === 'upcoming' && <span className="ml-auto text-xs text-green-600 font-medium">Upcoming</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t.nav.reportGrievance, icon: <ClipboardList className="w-5 h-5" />, path: '/citizen/report-grievance', color: 'green' },
          { label: t.nav.segregationGuide, icon: <BookOpen className="w-5 h-5" />, path: '/citizen/segregation-guide', color: 'blue' },
          { label: t.nav.collectionSchedule, icon: <Calendar className="w-5 h-5" />, path: '/citizen/schedule', color: 'orange' },
          { label: t.nav.notifications, icon: <AlertTriangle className="w-5 h-5" />, path: '/notifications', color: 'red' },
        ].map((item, i) => (
          <button key={i} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color === 'green' ? 'bg-green-50 text-green-600' : item.color === 'blue' ? 'bg-blue-50 text-blue-600' : item.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
              {item.icon}
            </div>
            <p className="text-xs font-medium text-gray-700">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

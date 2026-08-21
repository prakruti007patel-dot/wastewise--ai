import { Card } from '../../components/common/Cards';
import { PageHeader } from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { wards } from '../../data/wards';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const schedule = [
  { day: 'Monday', time: '7:00 AM – 9:00 AM', type: 'Wet Waste + Dry Waste', note: 'Regular daily collection', status: 'done' },
  { day: 'Tuesday', time: '7:00 AM – 9:00 AM', type: 'Wet Waste + Dry Waste', note: 'Regular daily collection', status: 'done' },
  { day: 'Wednesday', time: '7:00 AM – 9:00 AM', type: 'Wet Waste + Dry Waste', note: 'Regular daily collection', status: 'upcoming' },
  { day: 'Thursday', time: '7:00 AM – 9:00 AM', type: 'Wet Waste + Dry Waste', note: 'Regular daily collection', status: 'upcoming' },
  { day: 'Friday', time: '7:00 AM – 9:00 AM', type: 'Wet Waste + Dry Waste', note: 'Regular daily collection', status: 'upcoming' },
  { day: 'Saturday', time: '9:00 AM – 11:00 AM', type: 'Dry Waste + Hazardous', note: 'Special: batteries, medicines', status: 'upcoming' },
  { day: 'Sunday', time: 'No Collection', type: '—', note: 'Holiday', status: 'holiday' },
];

const specialEvents = [
  { date: 'Jan 26', title: 'Republic Day — No collection', type: 'holiday' },
  { date: 'Feb 5', title: 'E-Waste drive — Drop at Ward Office', type: 'special' },
  { date: 'Feb 12', title: 'Hazardous waste collection day', type: 'special' },
];

export default function CollectionSchedulePage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const ward = wards.find(w => w.id === (user?.wardId || 12));

  const today = new Date().getDay(); // 0 = Sunday
  const todayName = weekDays[(today + 6) % 7]; // adjust to Mon-first

  return (
    <div>
      <PageHeader
        title={language === 'gu' ? 'સંગ્રહ સમયપત્રક' : language === 'hi' ? 'संग्रह समय-सारणी' : 'Collection Schedule'}
        subtitle={`${ward?.name || 'Ward 12'} — Waste collection timetable`}
        breadcrumb="Citizen · Collection Schedule"
      />

      {/* Today's status */}
      <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-4">
        <Clock className="w-10 h-10 text-blue-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-blue-900">
            Today ({todayName}) —{' '}
            {schedule.find(s => s.day === todayName)?.status === 'done' ? 'Collection completed for today' :
             schedule.find(s => s.day === todayName)?.status === 'holiday' ? 'No collection today (Holiday)' :
             'Collection scheduled today'}
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            {schedule.find(s => s.day === todayName)?.time} · {schedule.find(s => s.day === todayName)?.type}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Weekly schedule */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Weekly Schedule — {ward?.name || 'Ward 12'}
            </h3>
            <div className="space-y-2">
              {schedule.map((s, i) => {
                const isToday = s.day === todayName;
                return (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isToday ? 'border-blue-300 bg-blue-50' : s.status === 'holiday' ? 'border-gray-100 bg-gray-50 opacity-60' : s.status === 'done' ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isToday ? 'bg-blue-100' : s.status === 'done' ? 'bg-gray-100' : s.status === 'holiday' ? 'bg-gray-100' : 'bg-green-100'}`}>
                      {s.status === 'done' ? <CheckCircle className="w-4 h-4 text-gray-400" /> :
                       s.status === 'holiday' ? <AlertTriangle className="w-4 h-4 text-gray-400" /> :
                       <Clock className={`w-4 h-4 ${isToday ? 'text-blue-600' : 'text-green-600'}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>{s.day}</p>
                        {isToday && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Today</span>}
                      </div>
                      <p className="text-xs text-gray-500">{s.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-800">{s.type}</p>
                      <p className="text-[11px] text-gray-400">{s.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Collection Tips</h3>
            <div className="space-y-2">
              {[
                'Keep waste ready by 6:45 AM on collection days',
                'Use green bin for wet waste, blue for dry',
                'Do not mix waste — it helps recycling',
                'For hazardous waste, hand it directly to the special collection team on Saturday',
                'If collection is missed, report via the Grievance portal',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Special Events</h3>
            <div className="space-y-2">
              {specialEvents.map((e, i) => (
                <div key={i} className={`p-2.5 rounded-lg border text-xs ${e.type === 'holiday' ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}`}>
                  <p className="font-semibold text-gray-800">{e.date} — {e.title}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Contact</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p>📞 Municipal Helpline: <strong>1800-XXX-XXXX</strong></p>
              <p>📱 WhatsApp: <strong>+91 XXXXX XXXXX</strong></p>
              <p>🕐 Hours: Mon–Sat, 8AM–8PM</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

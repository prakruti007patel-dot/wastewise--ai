import { useNavigate } from 'react-router-dom';
import {
  MapPin, Truck, CheckSquare, Recycle, MessageSquare, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight, Bot, Zap,
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPICard, Card, SectionHeader } from '../../components/common/Cards';
import { Button } from '../../components/common/Buttons';
import { StatusBadge, PriorityBadge, AlertBadge } from '../../components/common/Badges';
import { PageHeader } from '../../components/common/Table';
import { wards } from '../../data/wards';
import { vehicles } from '../../data/vehicles';
import { grievances } from '../../data/grievances';
import { alerts } from '../../data/alerts';
import { wardCompliance } from '../../data/compliance';

// Generate daily waste data for chart
const dailyWasteData = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (6 - i));
  return {
    day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    wet: Math.round(8000 + Math.random() * 2000),
    dry: Math.round(6000 + Math.random() * 1500),
    mixed: Math.round(2000 + Math.random() * 1000),
  };
});

const topWards = [...wards].sort((a, b) => b.segregationCompliance - a.segregationCompliance).slice(0, 5);
const lowWards = [...wards].sort((a, b) => a.segregationCompliance - b.segregationCompliance).slice(0, 5);

export default function OfficerDashboard() {
  const navigate = useNavigate();

  const totalWards = wards.length;
  const activeVehicles = vehicles.filter(v => v.status === 'on_route').length;
  const avgCollection = Math.round(wards.reduce((s, w) => s + w.collectionCompletion, 0) / wards.length);
  const avgCompliance = Math.round(wardCompliance.reduce((s, w) => s + w.compliancePercent, 0) / wardCompliance.length);
  const openGrievances = grievances.filter(g => g.status !== 'resolved' && g.status !== 'closed').length;
  const criticalAlerts = alerts.filter(a => !a.isRead && (a.type === 'critical' || a.priority === 'critical')).length;

  const unreadAlerts = alerts.filter(a => !a.isRead).slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Municipal Operations Dashboard"
        subtitle="Real-time overview of waste management operations across all 24 wards"
        breadcrumb="Officer · Dashboard"
        actions={
          <Button icon={<Zap className="w-4 h-4" />} onClick={() => navigate('/officer/agents')}>
            AI Agent Center
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard title="Total Wards" value={totalWards} subtitle="Covered areas" icon={<MapPin className="w-5 h-5" />} color="blue" trend="stable" />
        <KPICard title="Active Vehicles" value={activeVehicles} subtitle={`of ${vehicles.length} fleet`} icon={<Truck className="w-5 h-5" />} color="green" trend="stable" trendValue={`${Math.round(activeVehicles/vehicles.length*100)}%`} />
        <KPICard title="Collection Today" value={`${avgCollection}%`} subtitle="Completion rate" icon={<CheckSquare className="w-5 h-5" />} color="green" trend="up" trendValue="+2%" onClick={() => navigate('/officer/live-map')} />
        <KPICard title="Segregation" value={`${avgCompliance}%`} subtitle="Avg compliance" icon={<Recycle className="w-5 h-5" />} color={avgCompliance > 75 ? 'green' : 'orange'} trend="down" trendValue="-3%" onClick={() => navigate('/officer/segregation')} />
        <KPICard title="Open Grievances" value={openGrievances} subtitle="Pending resolution" icon={<MessageSquare className="w-5 h-5" />} color={openGrievances > 20 ? 'orange' : 'blue'} trend="stable" onClick={() => navigate('/officer/grievances')} />
        <KPICard title="Critical Alerts" value={criticalAlerts} subtitle="Need attention" icon={<AlertTriangle className="w-5 h-5" />} color="red" trend="up" trendValue="+2" onClick={() => navigate('/officer/alerts')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Waste collection overview */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Waste Collection Overview" subtitle="7-day daily collection volumes (kg)" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyWasteData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="wet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mixed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kg`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="wet" name="Wet Waste" stroke="#22c55e" fill="url(#wet)" strokeWidth={2} />
              <Area type="monotone" dataKey="dry" name="Dry Waste" stroke="#3b82f6" fill="url(#dry)" strokeWidth={2} />
              <Area type="monotone" dataKey="mixed" name="Mixed Waste" stroke="#f59e0b" fill="url(#mixed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Active alerts */}
        <Card>
          <SectionHeader title="Active Alerts" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/officer/alerts')}>View All <ArrowRight className="w-3 h-3" /></Button>} />
          <div className="space-y-3">
            {unreadAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <AlertBadge type={alert.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{alert.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Ward performance bar chart */}
        <Card>
          <SectionHeader title="Ward Compliance Comparison" subtitle="Top vs bottom performing wards" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/officer/segregation')}>Details <ArrowRight className="w-3 h-3" /></Button>} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[...topWards.slice(0, 3), ...lowWards.slice(0, 3)].map(w => ({
                ward: `W${w.id}`,
                compliance: w.segregationCompliance,
                fill: w.segregationCompliance >= 80 ? '#22c55e' : w.segregationCompliance >= 65 ? '#f59e0b' : '#ef4444',
              }))}
              margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={30} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Compliance']} />
              <Bar dataKey="compliance" name="Compliance %" radius={[4, 4, 0, 0]}>
                {[...topWards.slice(0, 3), ...lowWards.slice(0, 3)].map((w, i) => (
                  <rect key={i} fill={w.segregationCompliance >= 80 ? '#22c55e' : w.segregationCompliance >= 65 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* AI recommendations */}
        <Card>
          <SectionHeader title="AI Recommendations" subtitle="Active suggestions from AI agents" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/officer/agents')}>Agents <ArrowRight className="w-3 h-3" /></Button>} />
          <div className="space-y-3">
            {[
              { agent: 'Route Optimization', msg: 'Reroute Vehicle GJ-01-AB-1234 via Sardar Bridge to avoid Station Road congestion. Saves 12 min.', color: 'blue' },
              { agent: 'Segregation Compliance', msg: 'Ward 19 has shown a 12% decline in compliance. Send targeted Gujarati reminders to 3,284 households.', color: 'green' },
              { agent: 'Ward Analytics', msg: 'Ward 7 collection at 79% — vehicle constraint identified. Request additional vehicle deployment.', color: 'orange' },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-[10px] font-semibold text-purple-600 uppercase">{r.agent} Agent</span>
                </div>
                <p className="text-xs text-gray-700">{r.msg}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent grievances */}
      <Card>
        <SectionHeader
          title="Recent Grievances"
          subtitle="Latest citizen complaints requiring attention"
          actions={<Button icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => navigate('/officer/grievances')}>View All</Button>}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Citizen', 'Ward', 'Category', 'Priority', 'Status', 'Department'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grievances.slice(0, 6).map(g => (
                <tr key={g.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/officer/grievances')}>
                  <td className="px-4 py-2.5 text-xs font-mono text-blue-600 font-medium">{g.id}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-800">{g.citizenName}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">Ward {g.wardId}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">{g.categoryLabel}</td>
                  <td className="px-4 py-2.5"><PriorityBadge priority={g.priority} /></td>
                  <td className="px-4 py-2.5"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-2.5 text-xs text-gray-600 truncate max-w-[140px]">{g.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

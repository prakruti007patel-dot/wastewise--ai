import { useState } from 'react';
import { BarChart3, Zap, FileText, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../../components/common/Buttons';
import { Card, KPICard, SectionHeader } from '../../components/common/Cards';
import { PageHeader } from '../../components/common/Table';
import { RiskBadge } from '../../components/common/Badges';
import { Modal } from '../../components/common/Toast';
import { useToast } from '../../contexts/ToastContext';
import { aiService } from '../../services/ai';
import { wards } from '../../data/wards';
import { wardAnalytics, getWardAnalytics } from '../../data/analytics';
import { wardCompliance } from '../../data/compliance';
import type { AIWardReport } from '../../types';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function WardAnalyticsPage() {
  const { success, info } = useToast();
  const [selectedWardId, setSelectedWardId] = useState<number>(12);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AIWardReport | null>(null);
  const [reportModal, setReportModal] = useState(false);

  const ward = wards.find(w => w.id === selectedWardId)!;
  const analytics = getWardAnalytics(selectedWardId);
  const compliance = wardCompliance.find(w => w.wardId === selectedWardId)!;

  const handleGenerateReport = async () => {
    setGenerating(true);
    info('Ward Analytics Agent generating report...', `Analyzing Ward ${selectedWardId} — all metrics`);
    try {
      const r = await aiService.generateWardReport(selectedWardId);
      setReport(r);
      setReportModal(true);
      success('Ward report generated', `AI analysis complete for Ward ${selectedWardId}`);
    } finally {
      setGenerating(false);
    }
  };

  const wasteDistData = [
    { name: 'Wet', value: analytics.wasteDistribution.wet },
    { name: 'Dry', value: analytics.wasteDistribution.dry },
    { name: 'Hazardous', value: analytics.wasteDistribution.hazardous },
    { name: 'Mixed', value: analytics.wasteDistribution.mixed },
  ];

  return (
    <div>
      <PageHeader
        title="Ward Analytics"
        subtitle="Deep-dive performance analysis for individual wards"
        breadcrumb="Officer · Ward Analytics"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedWardId}
              onChange={e => { setSelectedWardId(Number(e.target.value)); setReport(null); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={0}>All Wards (Overview)</option>
              {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <Button icon={<Zap className="w-4 h-4" />} loading={generating} onClick={handleGenerateReport}>
              {generating ? 'Generating...' : 'Generate Ward AI Report'}
            </Button>
          </div>
        }
      />

      {/* Ward KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-5">
        <KPICard title="Population" value={ward.population.toLocaleString()} color="blue" />
        <KPICard title="Households" value={ward.households.toLocaleString()} color="blue" />
        <KPICard title="Daily Waste" value={`${(ward.dailyWasteKg / 1000).toFixed(1)}t`} color="gray" />
        <KPICard title="Collection" value={`${ward.collectionCompletion}%`} color={ward.collectionCompletion >= 90 ? 'green' : 'orange'} />
        <KPICard title="Compliance" value={`${ward.segregationCompliance}%`} color={ward.segregationCompliance >= 75 ? 'green' : 'red'} />
        <KPICard title="Grievances" value={ward.openGrievances} color="orange" />
        <KPICard title="Vehicles" value={ward.vehiclesAssigned} color="blue" />
        <KPICard title="Avg SLA" value={`${ward.avgResolutionTime}h`} color="gray" />
      </div>

      {/* Risk indicator */}
      <div className={`mb-5 p-4 rounded-xl border ${ward.riskLevel === 'high' ? 'bg-red-50 border-red-200' : ward.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">{ward.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {ward.riskLevel === 'high' ? '⚠ High-risk ward — immediate intervention recommended' :
               ward.riskLevel === 'medium' ? '⚡ Medium-risk ward — monitoring required' :
               '✓ Well-performing ward — maintain current programs'}
            </p>
          </div>
          <RiskBadge risk={ward.riskLevel} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Waste generation trend */}
        <Card>
          <SectionHeader title="Waste Generation Trend" subtitle="30-day daily collection (kg)" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.wasteGenerationTrend.filter((_, i) => i % 3 === 0)} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kg`]} />
              <Line type="monotone" dataKey="kg" name="Waste (kg)" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Compliance trend */}
        <Card>
          <SectionHeader title="Segregation Compliance Trend" subtitle="30-day compliance %" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.complianceTrend.filter((_, i) => i % 3 === 0)} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} width={30} />
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Line type="monotone" dataKey="percent" name="Compliance %" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Grievance trend */}
        <Card>
          <SectionHeader title="Grievance Trend" subtitle="30-day complaint count" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.grievanceTrend.filter((_, i) => i % 3 === 0)} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} width={25} />
              <Tooltip />
              <Bar dataKey="count" name="Grievances" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Waste distribution pie */}
        <Card>
          <SectionHeader title="Waste Distribution" subtitle="Category breakdown for this ward" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={wasteDistData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {wasteDistData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {wasteDistData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">{d.value}%</span>
                </div>
              ))}
              {compliance.mixedWastePercent > 30 && (
                <p className="text-[11px] text-red-600 mt-2 bg-red-50 p-2 rounded">⚠ Mixed waste at {compliance.mixedWastePercent}% — above 25% threshold</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Ward comparison */}
      <Card>
        <SectionHeader title="Ward Performance Comparison" subtitle="All 24 wards — segregation compliance" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={wards.map(w => ({ ward: `W${w.id}`, compliance: w.segregationCompliance, highlight: w.id === selectedWardId }))}
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="ward" tick={{ fontSize: 9 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={30} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Compliance']} />
            <Bar dataKey="compliance" name="Compliance %" radius={[2, 2, 0, 0]}>
              {wards.map((w, i) => (
                <Cell key={i} fill={w.id === selectedWardId ? '#1d4ed8' : w.segregationCompliance >= 80 ? '#22c55e' : w.segregationCompliance >= 65 ? '#f59e0b' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Report Modal */}
      <Modal isOpen={reportModal} onClose={() => setReportModal(false)} title={`Ward ${selectedWardId} AI Report`} maxWidth="lg">
        {report && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-1">Current Status</p>
              <p className="text-sm text-gray-800">{report.currentStatus}</p>
            </div>

            {report.majorIssues.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2">Major Issues</p>
                <div className="space-y-1.5">
                  {report.majorIssues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-xs text-gray-700">
                      <span className="text-red-500 flex-shrink-0">⚠</span> {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-blue-600 mb-2">Trends</p>
              <div className="space-y-1.5">
                {report.trends.map((t, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-lg text-xs text-gray-700">{t}</div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-green-600 mb-2">Recommended Actions</p>
              <div className="space-y-1.5">
                {report.recommendedActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg text-xs text-gray-700">
                    <span className="text-green-600 font-bold flex-shrink-0">{i + 1}.</span> {a}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Expected Impact</p>
              <p className="text-sm text-gray-800">{report.expectedImpact}</p>
            </div>

            <p className="text-[11px] text-gray-400 text-right">Generated: {new Date(report.generatedAt).toLocaleString('en-IN')} · IBM Granite Demo Mode</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

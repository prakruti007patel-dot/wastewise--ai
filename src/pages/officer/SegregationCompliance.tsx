import { useState } from 'react';
import { Recycle, Zap, CheckCircle, Send, Languages } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Button } from '../../components/common/Buttons';
import { Card, KPICard, SectionHeader } from '../../components/common/Cards';
import { RiskBadge, TrendIndicator } from '../../components/common/Badges';
import { Modal } from '../../components/common/Toast';
import { PageHeader } from '../../components/common/Table';
import { FieldWrapper, Select, Textarea } from '../../components/common/Forms';
import { useToast } from '../../contexts/ToastContext';
import { aiService } from '../../services/ai';
import { wardCompliance } from '../../data/compliance';
import type { AIComplianceAnalysis, Language } from '../../types';

const WASTE_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b'];
const RISK_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function SegregationCompliancePage() {
  const { success, info } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIComplianceAnalysis | null>(null);
  const [nudgeModal, setNudgeModal] = useState(false);
  const [nudgeLang, setNudgeLang] = useState<Language>('gu');
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [nudgeWard, setNudgeWard] = useState(19);
  const [sending, setSending] = useState(false);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const avgCompliance = Math.round(wardCompliance.reduce((s, w) => s + w.compliancePercent, 0) / wardCompliance.length);
  const highRisk = wardCompliance.filter(w => w.riskLevel === 'high').length;
  const totalHH = wardCompliance.reduce((s, w) => s + w.households, 0);
  const compliantHH = wardCompliance.reduce((s, w) => s + w.compliantHouseholds, 0);

  const donutData = [
    { name: 'Wet Waste', value: 33 },
    { name: 'Dry Waste', value: 39 },
    { name: 'Hazardous', value: 4 },
    { name: 'Mixed Waste', value: 24 },
  ];

  const barData = wardCompliance.slice(0, 12).map(w => ({
    ward: `W${w.wardId}`,
    compliance: w.compliancePercent,
    fill: w.compliancePercent >= 80 ? '#22c55e' : w.compliancePercent >= 65 ? '#f59e0b' : '#ef4444',
  }));

  const lineData = wardCompliance[18].weeklyTrend.map((v, i) => ({
    day: `Day ${i + 1}`, 'Ward 19': v, 'Ward 12': wardCompliance[11].weeklyTrend[i],
    'Ward 3': wardCompliance[2].weeklyTrend[i],
  }));

  const filtered = filterRisk === 'all' ? wardCompliance : wardCompliance.filter(w => w.riskLevel === filterRisk);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    info('Segregation Compliance Agent analyzing...', 'Reviewing 24 wards, 140,000+ households');
    try {
      const result = await aiService.analyzeCompliance({});
      setAnalysisResult(result);
      success('Compliance analysis complete', `${result.riskWards.length} high-risk wards identified`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOpenNudge = async (wardId: number) => {
    setNudgeWard(wardId);
    setNudgeModal(true);
    const msg = await aiService.generateCitizenNudge({ wardId, language: nudgeLang, messageType: 'segregation' });
    setNudgeMessage(msg);
  };

  const handleLangChange = async (lang: Language) => {
    setNudgeLang(lang);
    const msg = await aiService.generateCitizenNudge({ wardId: nudgeWard, language: lang, messageType: 'segregation' });
    setNudgeMessage(msg);
  };

  const handleSendNudge = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setNudgeModal(false);
    const w = wardCompliance.find(w => w.wardId === nudgeWard);
    success('Citizen nudge sent!', `Message sent to ${w?.nonCompliantHouseholds || 0} households in Ward ${nudgeWard} (${nudgeLang.toUpperCase()})`);
  };

  return (
    <div>
      <PageHeader
        title="Segregation Compliance"
        subtitle="Monitor and improve household waste segregation across all wards"
        breadcrumb="Officer · Segregation Compliance"
        actions={
          <Button icon={<Zap className="w-4 h-4" />} loading={analyzing} onClick={handleAnalyze}>
            {analyzing ? 'Analyzing...' : 'Analyze Compliance'}
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KPICard title="Overall Compliance" value={`${avgCompliance}%`} icon={<Recycle className="w-5 h-5" />} color={avgCompliance > 75 ? 'green' : 'orange'} trend="down" trendValue="-3%" />
        <KPICard title="High Risk Wards" value={highRisk} subtitle="Below 65% threshold" icon={<Recycle className="w-5 h-5" />} color="red" trend="up" trendValue="+2" />
        <KPICard title="Compliant HH" value={`${Math.round(compliantHH / 1000)}K`} subtitle={`of ${Math.round(totalHH / 1000)}K total`} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <KPICard title="Mixed Waste HH" value={`${Math.round((totalHH - compliantHH) / 1000)}K`} subtitle="Need intervention" icon={<Recycle className="w-5 h-5" />} color="orange" />
      </div>

      {/* AI analysis result */}
      {analysisResult && (
        <Card className="mb-5 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-semibold text-purple-800">Segregation Compliance Agent — Analysis Results (Demo Mode)</p>
          </div>
          <div className="space-y-2">
            {analysisResult.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-purple-100">
                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <p className="text-xs text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {analysisResult.riskWards.slice(0, 4).map(wardId => (
              <Button key={wardId} size="sm" variant="secondary" icon={<Send className="w-3 h-3" />} onClick={() => handleOpenNudge(wardId)}>
                Nudge Ward {wardId}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Donut chart */}
        <Card>
          <SectionHeader title="Waste Distribution" subtitle="City-wide average" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                {donutData.map((_, i) => <Cell key={i} fill={WASTE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {donutData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: WASTE_COLORS[i] }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bar chart - ward comparison */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Ward Compliance Comparison" subtitle="Segregation compliance %" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={30} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Compliance']} />
              <Bar dataKey="compliance" name="Compliance %" radius={[3, 3, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.compliance >= 80 ? '#22c55e' : entry.compliance >= 65 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly trend line chart */}
      <Card className="mb-5">
        <SectionHeader title="7-Day Compliance Trend" subtitle="Ward 19, 12, and 3 comparison" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} width={30} />
            <Tooltip formatter={(v: number) => [`${v}%`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Ward 19" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Ward 12" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Ward 3" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Ward table */}
      <Card>
        <SectionHeader
          title="Ward Compliance Details"
          actions={
            <div className="flex items-center gap-2">
              <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none">
                <option value="all">All Wards</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Ward', 'Households', 'Compliant', 'Non-Compliant', 'Compliance %', 'Trend', 'Risk', 'Action'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(w => (
                <tr key={w.wardId} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-xs font-medium text-gray-800">{w.wardName}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600">{w.households.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs text-green-700 font-medium">{w.compliantHouseholds.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs text-red-600">{w.nonCompliantHouseholds.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[60px]">
                        <div className="h-full rounded-full" style={{ width: `${w.compliancePercent}%`, background: w.compliancePercent >= 80 ? '#22c55e' : w.compliancePercent >= 65 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{w.compliancePercent}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><TrendIndicator trend={w.trend} /></td>
                  <td className="px-3 py-2.5"><RiskBadge risk={w.riskLevel} /></td>
                  <td className="px-3 py-2.5">
                    {(w.riskLevel === 'high' || w.riskLevel === 'medium') && (
                      <Button size="sm" variant="ghost" icon={<Send className="w-3 h-3" />} onClick={() => handleOpenNudge(w.wardId)}>Nudge</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Nudge modal */}
      <Modal isOpen={nudgeModal} onClose={() => setNudgeModal(false)} title={`Send Citizen Nudge — Ward ${nudgeWard}`} maxWidth="md">
        <div className="space-y-4">
          <FieldWrapper label="Target Ward" htmlFor="nudge-ward">
            <Select id="nudge-ward" value={nudgeWard} onChange={e => setNudgeWard(Number(e.target.value))}>
              {wardCompliance.filter(w => w.riskLevel !== 'low').map(w => (
                <option key={w.wardId} value={w.wardId}>{w.wardName}</option>
              ))}
            </Select>
          </FieldWrapper>

          <FieldWrapper label="Language" htmlFor="nudge-lang">
            <div className="flex gap-2">
              {(['en', 'gu', 'hi'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${nudgeLang === lang ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
                </button>
              ))}
            </div>
          </FieldWrapper>

          <FieldWrapper label="Message Preview">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 min-h-[80px]">
              {nudgeMessage || 'Generating message...'}
            </div>
          </FieldWrapper>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700">This will send an SMS/notification to approximately <strong>{wardCompliance.find(w => w.wardId === nudgeWard)?.nonCompliantHouseholds.toLocaleString()}</strong> non-compliant households in Ward {nudgeWard}.</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSendNudge} loading={sending} icon={<Send className="w-4 h-4" />} className="flex-1">
              {sending ? 'Sending...' : 'Send Nudge'}
            </Button>
            <Button variant="outline" onClick={() => setNudgeModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

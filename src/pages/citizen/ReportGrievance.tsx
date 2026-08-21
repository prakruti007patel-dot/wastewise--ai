import { useState } from 'react';
import { CheckCircle, Bot, Languages } from 'lucide-react';
import { Button } from '../../components/common/Buttons';
import { Card, SectionHeader } from '../../components/common/Cards';
import { FieldWrapper, Input, Select, Textarea } from '../../components/common/Forms';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { PageHeader } from '../../components/common/Table';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { aiService } from '../../services/ai';
import { grievanceCategories } from '../../data/grievances';
import { wards } from '../../data/wards';
import type { AIGrievanceAnalysis, Language } from '../../types';

export default function ReportGrievancePage() {
  const { success } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [submitted, setSubmitted] = useState(false);
  const [grievanceId, setGrievanceId] = useState('');
  const [analysis, setAnalysis] = useState<AIGrievanceAnalysis | null>(null);

  const [form, setForm] = useState({
    name: '', phone: '', category: '', description: '', location: '', wardId: 12, language: language as Language,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile number required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.description.trim() || form.description.length < 10) e.description = 'Please describe the issue (min 10 chars)';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStep('analyzing');
    try {
      const result = await aiService.analyzeGrievance({
        text: form.description,
        language: form.language,
        wardId: form.wardId,
        location: form.location,
      });
      setAnalysis(result);
      const id = `GRV-2026-${String(Math.floor(10000 + Math.random() * 90000)).slice(0, 5)}`;
      setGrievanceId(id);
      setStep('result');
      success('Grievance submitted!', `ID: ${id} — AI has classified and routed your complaint.`);
    } catch {
      setStep('form');
    }
  };

  const catLabel = (id: string) => {
    const c = grievanceCategories.find(c => c.id === id);
    if (!c) return id;
    return language === 'gu' ? c.labelGu : language === 'hi' ? c.labelHi : c.label;
  };

  const placeholder = {
    en: 'Describe your waste management issue in detail...',
    gu: 'તમારી સમસ્યા વર્ણવો, જેમ કે: "ત્રણ દિવસથી ગાડી આવી નથી."',
    hi: 'अपनी समस्या विस्तार से बताएं, जैसे: "तीन दिनों से गाड़ी नहीं आई।"',
  };

  if (step === 'result' && analysis) {
    return (
      <div>
        <PageHeader title={t.grievance.submitted} breadcrumb="Citizen · Report Grievance" />
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Success */}
          <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{grievanceId}</p>
            <p className="text-sm text-gray-600">{t.grievance.grievanceId}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <StatusBadge status="ai_classified" />
              <PriorityBadge priority={analysis.priority} />
            </div>
          </div>

          {/* AI analysis */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-bold text-purple-800">{t.grievance.aiClassified}</p>
              <span className="text-xs text-purple-500">Confidence: {Math.round(analysis.confidence * 100)}%</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Category</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{analysis.categoryLabel}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Priority</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{analysis.priority}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Language</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{analysis.language === 'gu' ? 'Gujarati' : analysis.language === 'hi' ? 'Hindi' : 'English'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Department</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 text-xs">{analysis.department}</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mb-3">
              <p className="text-[10px] font-semibold text-purple-600 uppercase mb-1.5">AI Reasoning (Municipal Routing Agent)</p>
              <div className="space-y-1">
                {analysis.reasoningFactors.map((f, i) => (
                  <p key={i} className="text-xs text-gray-700">• {f}</p>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">{analysis.summary}</p>
          </Card>

          {/* Next steps */}
          <Card>
            <p className="text-sm font-bold text-gray-900 mb-3">What happens next?</p>
            <div className="space-y-2">
              {[
                `Your grievance has been assigned to ${analysis.department}`,
                'A municipal officer will be notified within 30 minutes',
                `Resolution expected within ${analysis.priority === 'critical' ? '12' : analysis.priority === 'high' ? '24' : '48'} hours`,
                'You will receive SMS updates on your registered mobile number',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  {s}
                </div>
              ))}
            </div>
          </Card>

          <Button className="w-full" onClick={() => { setStep('form'); setForm({ name: '', phone: '', category: '', description: '', location: '', wardId: 12, language: 'en' }); }}>
            Submit Another Grievance
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div>
        <PageHeader title={t.grievance.title} breadcrumb="Citizen · Report Grievance" />
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-16">
            <Bot className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-bold text-gray-900 mb-2">{t.grievance.aiAnalyzing}</p>
            <p className="text-sm text-gray-500 mb-4">Grievance Intake Agent is processing your complaint...</p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {['Detecting language...', 'Classifying category...', 'Assessing priority...', 'Routing to department...'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{s}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.grievance.title} subtitle={t.grievance.description} breadcrumb="Citizen · Report Grievance" />
      <div className="max-w-2xl mx-auto">
        <Card>
          {/* Language selector */}
          <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-lg">
            <Languages className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t.grievance.language}:</span>
            <div className="flex gap-2 ml-1">
              {(['en', 'gu', 'hi'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setForm(f => ({ ...f, language: lang })); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${language === lang ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldWrapper label={t.grievance.name} htmlFor="name" required error={errors.name}>
              <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Ramila Ben Patel" error={!!errors.name} />
            </FieldWrapper>
            <FieldWrapper label={t.grievance.phone} htmlFor="phone" required error={errors.phone}>
              <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" maxLength={10} error={!!errors.phone} />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldWrapper label={t.grievance.category} htmlFor="category" required error={errors.category}>
              <Select id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} error={!!errors.category}>
                <option value="">Select category...</option>
                {grievanceCategories.map(c => (
                  <option key={c.id} value={c.id}>
                    {language === 'gu' ? c.labelGu : language === 'hi' ? c.labelHi : c.label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
            <FieldWrapper label={t.grievance.ward} htmlFor="ward">
              <Select id="ward" value={form.wardId} onChange={e => setForm(f => ({ ...f, wardId: Number(e.target.value) }))}>
                {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </Select>
            </FieldWrapper>
          </div>

          <FieldWrapper label={t.grievance.descriptionField} htmlFor="desc" required error={errors.description} hint={language === 'gu' ? 'ગુજરાતીમાં લખો — AI સ્વ-ભાષા ઓળખ કરશે' : language === 'hi' ? 'हिंदी में लिखें — AI स्वत: भाषा पहचान करेगा' : 'Write in any language — AI will auto-detect'}>
            <Textarea
              id="desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder={placeholder[language as 'en' | 'gu' | 'hi']}
              error={!!errors.description}
              rows={5}
            />
          </FieldWrapper>

          <div className="mt-4">
            <FieldWrapper label={t.grievance.location} htmlFor="loc" required error={errors.location}>
              <Input id="loc" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder={language === 'gu' ? 'જેમ કે: ઇસ્ટ જ઼ોન, ઇસ્ટ ઝ઼ોન' : language === 'hi' ? 'उदाहरण: मुख्य बाजार, वार्ड 12' : 'e.g., Near Market, Isanpur Road'} error={!!errors.location} />
            </FieldWrapper>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Grievance Intake Agent will analyze your complaint using IBM Granite AI (Demo Mode)
            </p>
          </div>

          <Button className="w-full mt-5" size="lg" onClick={handleSubmit}>
            {t.grievance.submit}
          </Button>
        </Card>
      </div>
    </div>
  );
}

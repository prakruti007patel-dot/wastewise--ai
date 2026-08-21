import { Link } from 'react-router-dom';
import { Trash2, Route, Recycle, MessageSquare, GitBranch, BarChart3, ArrowRight, CheckCircle, Cpu, Globe, Shield } from 'lucide-react';

const agents = [
  { icon: <Route className="w-6 h-6" />, name: 'Route Optimization Agent', desc: 'Dynamically optimizes waste collection routes based on vehicle location, waste volume, and traffic conditions.', color: 'blue' },
  { icon: <Recycle className="w-6 h-6" />, name: 'Segregation Compliance Agent', desc: 'Monitors ward-level segregation compliance and triggers multilingual citizen nudge campaigns.', color: 'green' },
  { icon: <MessageSquare className="w-6 h-6" />, name: 'Grievance Intake Agent', desc: 'Accepts citizen grievances in English, Gujarati, and Hindi — classifying category and priority automatically.', color: 'purple' },
  { icon: <GitBranch className="w-6 h-6" />, name: 'Municipal Routing Agent', desc: 'Routes classified grievances to the correct department, assigns officers, and sets SLA timelines.', color: 'orange' },
  { icon: <BarChart3 className="w-6 h-6" />, name: 'Ward Analytics Agent', desc: 'Generates actionable ward-level insights, identifies trends, flags risk areas, and recommends interventions.', color: 'red' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
};

const problems = [
  'Poor door-to-door waste segregation compliance across wards',
  'Inefficient collection routes causing fuel waste and delays',
  'Citizen grievances delayed or incorrectly routed',
  'No centralized ward-level performance analytics',
  'Officers lack actionable AI-driven insights',
  'Communication barriers in multilingual cities',
];

const features = [
  { title: 'Multilingual AI', desc: 'Processes grievances in English, Gujarati, and Hindi with automatic language detection.' },
  { title: 'Real-time Route AI', desc: 'Continuously analyzes vehicle positions and optimizes collection paths to minimize fuel and time.' },
  { title: 'Compliance Monitoring', desc: 'Tracks household-level segregation compliance across 24 wards with trend analysis.' },
  { title: 'Automated Routing', desc: 'Grievances are automatically classified and routed to the right department in seconds.' },
  { title: 'Ward Analytics', desc: 'AI-generated ward reports with risk indicators, trends, and specific recommended actions.' },
  { title: 'Citizen Nudges', desc: 'Targeted multilingual notifications to non-compliant households based on data analysis.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">WasteWise AI</p>
              <p className="text-[10px] text-gray-400 -mt-0.5">Municipal Waste Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/login" className="text-sm font-medium px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Cpu className="w-4 h-4" />
            Powered by IBM Granite LLM · IBM Cloud Ready
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Agentic AI for Smarter<br />
            <span className="text-green-600">Municipal Waste Management</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Optimize collection routes, improve waste segregation, intelligently route citizen grievances, and empower municipal officers with ward-level AI insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?role=officer" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm">
              Officer Demo Login <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login?role=citizen" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
              Citizen Demo Login
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">⚠ Demo prototype — all data is fictional and for demonstration only</p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">The Problem We Solve</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Municipal waste management in Indian cities faces systemic challenges that AI can help address.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Five Intelligent AI Agents</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Each agent handles a specific municipal domain, collaborating as a unified intelligent system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[a.color]}`}>
                  {a.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{a.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            {[
              { label: 'Citizen', sub: 'Submits grievance / data' },
              { label: 'AI Agents', sub: 'Classify, analyze, route' },
              { label: 'Municipal Operations', sub: 'Receive routed tasks' },
              { label: 'Analytics', sub: 'Track performance' },
              { label: 'Better Decisions', sub: 'AI-driven insights' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-0">
                <div className="text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-700 font-bold text-lg mb-2">{i + 1}</div>
                  <p className="text-xs font-semibold text-gray-800">{step.label}</p>
                  <p className="text-[10px] text-gray-400">{step.sub}</p>
                </div>
                {i < 4 && <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cpu className="w-6 h-6" />, label: 'IBM Granite LLM', sub: 'AI Intelligence' },
              { icon: <Globe className="w-6 h-6" />, label: 'IBM Cloud', sub: 'Deployment' },
              { icon: <Shield className="w-6 h-6" />, label: 'React + TypeScript', sub: 'Frontend' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Node.js + Express', sub: 'Backend' },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 mx-auto rounded-lg bg-white border border-gray-200 flex items-center justify-center text-green-600 mb-3">{t.icon}</div>
                <p className="text-sm font-semibold text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-400">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore the Demo?</h2>
          <p className="text-green-100 mb-8">Try the complete prototype with realistic mock data from a fictional Gujarat municipal corporation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?role=officer" className="px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm">
              Login as Municipal Officer
            </Link>
            <Link to="/login?role=citizen" className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 border border-green-400 transition-colors text-sm">
              Login as Citizen
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">WasteWise AI — Municipal Solid Waste &amp; Circular Economy Agent</p>
        <p className="text-xs mt-2">Built with IBM Bob · IBM Granite LLM · React · TypeScript · Tailwind CSS</p>
        <p className="text-xs mt-1 text-gray-600">Demo prototype — fictional data only · Not affiliated with any real municipal corporation</p>
      </footer>
    </div>
  );
}

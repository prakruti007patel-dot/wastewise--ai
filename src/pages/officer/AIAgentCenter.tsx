import { useState } from 'react';
import { Bot, Zap, Activity, CheckCircle, Clock, Route, Recycle, MessageSquare, GitBranch, BarChart3, ArrowDown, ArrowRight } from 'lucide-react';
import { Card, SectionHeader } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/Badges';
import { Button } from '../../components/common/Buttons';
import { PageHeader } from '../../components/common/Table';
import { agentCards } from '../../data/alerts';
import type { AgentStatus } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
  Route: <Route className="w-6 h-6" />,
  Recycle: <Recycle className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
};

const statusColors: Record<AgentStatus, string> = {
  active: 'text-green-600 bg-green-50 border-green-200',
  monitoring: 'text-blue-600 bg-blue-50 border-blue-200',
  needs_attention: 'text-orange-600 bg-orange-50 border-orange-200',
  idle: 'text-gray-500 bg-gray-50 border-gray-200',
};

const statusDots: Record<AgentStatus, string> = {
  active: 'bg-green-500 animate-pulse',
  monitoring: 'bg-blue-500',
  needs_attention: 'bg-orange-500 animate-pulse',
  idle: 'bg-gray-400',
};

export default function AIAgentCenterPage() {
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [agentActivity, setAgentActivity] = useState<Record<string, string>>({});

  const handleRunAgent = async (agentId: string) => {
    setRunningAgent(agentId);
    setAgentActivity(prev => ({ ...prev, [agentId]: 'Initializing...' }));
    await new Promise(r => setTimeout(r, 600));
    setAgentActivity(prev => ({ ...prev, [agentId]: 'Analyzing data...' }));
    await new Promise(r => setTimeout(r, 900));
    setAgentActivity(prev => ({ ...prev, [agentId]: 'Processing results...' }));
    await new Promise(r => setTimeout(r, 700));
    setAgentActivity(prev => ({ ...prev, [agentId]: 'Done ✓' }));
    setRunningAgent(null);
  };

  return (
    <div>
      <PageHeader
        title="AI Agent Center"
        subtitle="Monitor and interact with all five intelligent municipal waste management agents"
        breadcrumb="Officer · AI Agent Center"
      />

      {/* Demo note */}
      <div className="mb-5 p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center gap-3">
        <Bot className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-purple-800">IBM Granite Demo Mode Active</p>
          <p className="text-xs text-purple-600">All agents are using mock intelligence. Connect IBM Cloud credentials to activate IBM Granite LLM.</p>
        </div>
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {agentCards.map(agent => (
          <Card key={agent.id} className={`border-2 ${statusColors[agent.status]}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${statusColors[agent.status]}`}>
                  {iconMap[agent.icon]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">{agent.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDots[agent.status]}`} />
                    <span className="text-xs font-medium capitalize text-gray-600">
                      {agent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{agent.purpose}</p>

            {/* Stats */}
            {agent.stats && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.entries(agent.stats).map(([k, v]) => (
                  <div key={k} className="p-2 bg-white rounded-lg border border-gray-100 text-center">
                    <p className="text-sm font-bold text-gray-900">{v}</p>
                    <p className="text-[10px] text-gray-400">{k}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Last action */}
            <div className="p-3 bg-gray-50 rounded-lg mb-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Last Action</p>
              <p className="text-xs text-gray-700">{agent.lastAction}</p>
            </div>

            {/* Current recommendation */}
            <div className="p-3 bg-green-50 rounded-lg mb-3 border border-green-100">
              <p className="text-[10px] font-semibold text-green-600 uppercase mb-1">Current Recommendation</p>
              <p className="text-xs text-gray-700">{agent.currentRecommendation}</p>
            </div>

            {/* Activity indicator */}
            {agentActivity[agent.id] && (
              <div className="p-2 bg-blue-50 rounded-lg mb-2 text-xs text-blue-700 font-medium">
                {agentActivity[agent.id]}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{agent.tasksCompleted.toLocaleString()} tasks completed</span>
              <Button
                size="sm"
                variant="outline"
                loading={runningAgent === agent.id}
                onClick={() => handleRunAgent(agent.id)}
                icon={<Activity className="w-3 h-3" />}
              >
                {runningAgent === agent.id ? 'Running...' : 'Run Agent'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Agent workflow visualization */}
      <Card>
        <SectionHeader title="Agent Collaboration Workflow" subtitle="How the five agents work together" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Flow 1: Grievance */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Grievance Flow</p>
            {[
              { label: 'Citizen Data', sub: 'Text in EN/GU/HI', icon: '👤' },
              { label: 'Grievance Intake Agent', sub: 'Classify & prioritize', icon: '🤖', agent: true },
              { label: 'Municipal Routing Agent', sub: 'Assign dept & officer', icon: '🤖', agent: true },
              { label: 'Municipal Department', sub: 'Receives task', icon: '🏛️' },
              { label: 'Resolution', sub: 'Grievance closed', icon: '✅' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium w-48 ${step.agent ? 'bg-purple-50 border border-purple-200 text-purple-800' : 'bg-gray-50 border border-gray-200 text-gray-700'}`}>
                  <span className="text-base mr-1">{step.icon}</span>
                  <span className="font-semibold">{step.label}</span>
                  <br /><span className="text-[10px] text-gray-500">{step.sub}</span>
                </div>
                {i < 4 && <ArrowDown className="w-4 h-4 text-gray-300 my-1" />}
              </div>
            ))}
          </div>

          {/* Flow 2: Collection */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Collection Flow</p>
            {[
              { label: 'Collection Data', sub: 'Vehicle GPS & load', icon: '🚛' },
              { label: 'Route Optimization Agent', sub: 'Optimize paths', icon: '🤖', agent: true },
              { label: 'Optimized Routes', sub: 'Dispatched to drivers', icon: '🗺️' },
              { label: 'Ward Analytics Agent', sub: 'Track performance', icon: '🤖', agent: true },
              { label: 'Better Decisions', sub: 'Insights → actions', icon: '📊' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium w-48 ${step.agent ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-gray-50 border border-gray-200 text-gray-700'}`}>
                  <span className="text-base mr-1">{step.icon}</span>
                  <span className="font-semibold">{step.label}</span>
                  <br /><span className="text-[10px] text-gray-500">{step.sub}</span>
                </div>
                {i < 4 && <ArrowDown className="w-4 h-4 text-gray-300 my-1" />}
              </div>
            ))}
          </div>

          {/* Flow 3: Compliance */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Compliance Flow</p>
            {[
              { label: 'Segregation Data', sub: 'Ward-level reports', icon: '📋' },
              { label: 'Compliance Agent', sub: 'Identify risk wards', icon: '🤖', agent: true },
              { label: 'Citizen Nudges', sub: 'EN/GU/HI messages', icon: '📲' },
              { label: 'Behavior Change', sub: 'Compliance improves', icon: '♻️' },
              { label: 'Ward Analytics Agent', sub: 'Track improvement', icon: '🤖', agent: true },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium w-48 ${step.agent ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 border border-gray-200 text-gray-700'}`}>
                  <span className="text-base mr-1">{step.icon}</span>
                  <span className="font-semibold">{step.label}</span>
                  <br /><span className="text-[10px] text-gray-500">{step.sub}</span>
                </div>
                {i < 4 && <ArrowDown className="w-4 h-4 text-gray-300 my-1" />}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

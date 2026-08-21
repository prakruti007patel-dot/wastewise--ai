import { useState } from 'react';
import { MessageSquare, Bot, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { Button } from '../../components/common/Buttons';
import { Card, SectionHeader } from '../../components/common/Cards';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Modal } from '../../components/common/Toast';
import { PageHeader, Tabs } from '../../components/common/Table';
import { useToast } from '../../contexts/ToastContext';
import { aiService } from '../../services/ai';
import { grievances as initialGrievances } from '../../data/grievances';
import type { Grievance, GrievanceStatus, Priority } from '../../types';

const STATUS_OPTIONS: GrievanceStatus[] = ['submitted', 'ai_classified', 'assigned', 'in_progress', 'resolved', 'closed'];

export default function GrievanceManagementPage() {
  const { success, info } = useToast();
  const [grievanceList, setGrievanceList] = useState<Grievance[]>(initialGrievances);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [detailModal, setDetailModal] = useState(false);
  const [routingGrievanceId, setRoutingGrievanceId] = useState<string | null>(null);

  const filtered = grievanceList.filter(g => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    if (filterPriority !== 'all' && g.priority !== filterPriority) return false;
    return true;
  });

  const handleRoute = async (g: Grievance) => {
    setRoutingGrievanceId(g.id);
    info('Municipal Routing Agent analyzing...', `Classifying: ${g.categoryLabel}`);
    try {
      const result = await aiService.classifyGrievanceRouting({
        category: g.category,
        priority: g.priority,
        wardId: g.wardId,
        description: g.description,
      });
      setGrievanceList(prev => prev.map(gr =>
        gr.id === g.id
          ? { ...gr, status: 'assigned', department: result.department, assignedOfficer: result.officer, slaHours: result.slaHours, aiReasoningSummary: result.reasoningFactors.join(' · '), updatedAt: new Date().toISOString() }
          : gr
      ));
      success('Grievance routed!', `Assigned to ${result.department} — ${result.officer} (SLA: ${result.slaHours}h)`);
    } finally {
      setRoutingGrievanceId(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: GrievanceStatus) => {
    setGrievanceList(prev => prev.map(g =>
      g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString(), resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : g.resolvedAt } : g
    ));
    success('Status updated', `Grievance ${id} moved to ${newStatus.replace('_', ' ')}`);
    if (selectedGrievance?.id === id) {
      setSelectedGrievance(prev => prev ? { ...prev, status: newStatus } : prev);
    }
  };

  const counts = {
    all: grievanceList.length,
    open: grievanceList.filter(g => !['resolved', 'closed'].includes(g.status)).length,
    critical: grievanceList.filter(g => g.priority === 'critical').length,
    resolved: grievanceList.filter(g => g.status === 'resolved' || g.status === 'closed').length,
  };

  const tabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'open', label: 'Open', count: counts.open },
    { id: 'critical', label: 'Critical', count: counts.critical },
    { id: 'resolved', label: 'Resolved', count: counts.resolved },
  ];

  const handleTabChange = (id: string) => {
    if (id === 'all') setFilterStatus('all');
    else if (id === 'open') setFilterStatus('submitted');
    else if (id === 'critical') { setFilterStatus('all'); setFilterPriority('critical'); }
    else if (id === 'resolved') setFilterStatus('resolved');
  };

  return (
    <div>
      <PageHeader
        title="Grievance Management"
        subtitle="Citizen grievances with AI classification and intelligent routing"
        breadcrumb="Officer · Grievances"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Grievances', value: grievanceList.length, color: 'text-gray-900' },
          { label: 'Open', value: counts.open, color: 'text-orange-600' },
          { label: 'Critical', value: counts.critical, color: 'text-red-600' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-600' },
        ].map((s, i) => (
          <Card key={i} className="text-center py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <Tabs tabs={tabs} activeTab={filterStatus === 'all' ? 'all' : filterStatus} onChange={handleTabChange} />
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Citizen', 'Ward', 'Category', 'Priority', 'Department', 'Officer', 'Status', 'SLA', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-400">No grievances found</td></tr>
              ) : filtered.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-xs font-mono text-blue-600 font-medium">{g.id}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-800 font-medium">{g.citizenName}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600">Ward {g.wardId}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 whitespace-nowrap">{g.categoryLabel}</td>
                  <td className="px-3 py-2.5"><PriorityBadge priority={g.priority} /></td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 truncate max-w-[120px]">{g.department}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 truncate max-w-[110px]">{g.assignedOfficer === 'Unassigned' ? <span className="text-orange-500">Unassigned</span> : g.assignedOfficer}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={g.status} /></td>
                  <td className="px-3 py-2.5 text-xs text-gray-500">{g.slaHours}h</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Eye className="w-3 h-3" />}
                        onClick={() => { setSelectedGrievance(g); setDetailModal(true); }}
                      >
                        View
                      </Button>
                      {(g.status === 'submitted' || g.status === 'ai_classified') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={routingGrievanceId === g.id}
                          icon={<Bot className="w-3 h-3" />}
                          onClick={() => handleRoute(g)}
                        >
                          Route
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grievance detail modal */}
      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Grievance Details" maxWidth="lg">
        {selectedGrievance && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">{selectedGrievance.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Created: {new Date(selectedGrievance.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={selectedGrievance.priority} />
                <StatusBadge status={selectedGrievance.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Citizen</p>
                <p className="font-medium text-gray-900">{selectedGrievance.citizenName}</p>
                <p className="text-xs text-gray-500">{selectedGrievance.citizenPhone}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-medium text-gray-900">Ward {selectedGrievance.wardId}</p>
                <p className="text-xs text-gray-500 truncate">{selectedGrievance.location}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="font-medium text-gray-900 text-xs">{selectedGrievance.department}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                <p className="font-medium text-gray-900 text-xs">{selectedGrievance.assignedOfficer}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{selectedGrievance.description}</p>
            </div>

            {selectedGrievance.aiReasoningSummary && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-semibold text-purple-700">AI Routing Analysis</p>
                  {selectedGrievance.aiConfidence && (
                    <span className="text-[10px] text-purple-500">Confidence: {Math.round(selectedGrievance.aiConfidence * 100)}%</span>
                  )}
                </div>
                <p className="text-xs text-gray-700">{selectedGrievance.aiReasoningSummary}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedGrievance.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${selectedGrievance.status === s ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

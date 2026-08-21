import { useNavigate } from 'react-router-dom';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Card } from '../../components/common/Cards';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Button } from '../../components/common/Buttons';
import { PageHeader } from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { grievances } from '../../data/grievances';

export default function MyGrievancesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const myGrievances = grievances.filter(g => g.wardId === (user?.wardId || 12));

  const statusSteps = ['submitted', 'ai_classified', 'assigned', 'in_progress', 'resolved'];

  return (
    <div>
      <PageHeader
        title="My Grievances"
        subtitle="Track all your submitted complaints and their resolution status"
        breadcrumb="Citizen · My Grievances"
        actions={
          <Button icon={<PlusCircle className="w-4 h-4" />} onClick={() => navigate('/citizen/report-grievance')}>
            New Grievance
          </Button>
        }
      />

      {myGrievances.length === 0 ? (
        <Card className="text-center py-16">
          <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-base font-semibold text-gray-600">No grievances submitted yet</p>
          <p className="text-sm text-gray-400 mt-1">Submit your first grievance to track waste management issues</p>
          <Button className="mt-6" onClick={() => navigate('/citizen/report-grievance')}>Report a Grievance</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {myGrievances.map(g => {
            const stepIdx = statusSteps.indexOf(g.status);
            return (
              <Card key={g.id}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-blue-600 font-mono">{g.id}</span>
                      <StatusBadge status={g.status} />
                      <PriorityBadge priority={g.priority} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{g.categoryLabel}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{g.location} · {new Date(g.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>Ward {g.wardId}</p>
                    <p className="mt-0.5">{g.department}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg mb-4">{g.description}</p>

                {/* Status tracker */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((s, i) => {
                      const done = i <= stepIdx;
                      const active = i === stepIdx;
                      return (
                        <div key={s} className="flex flex-col items-center flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 bg-white text-gray-400'} ${active ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
                            {done ? '✓' : i + 1}
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1 text-center capitalize hidden sm:block">{s.replace('_', ' ')}</p>
                          {i < statusSteps.length - 1 && (
                            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-100 -z-10">
                              <div className="h-full bg-green-500 transition-all" style={{ width: `${(stepIdx / (statusSteps.length - 1)) * 100}%` }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned officer */}
                {g.assignedOfficer !== 'Unassigned' && (
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                    <span>Assigned to: <strong className="text-gray-700">{g.assignedOfficer}</strong></span>
                    <span>SLA: {g.slaHours}h</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

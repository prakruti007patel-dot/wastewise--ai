import type { Alert, Notification, AgentCard } from '../types';

export const alerts: Alert[] = [
  { id: 'ALT-001', type: 'critical', title: 'Vehicle Capacity Critical', message: 'Vehicle GJ-01-AB-1042 has exceeded 90% capacity in Ward 19. Immediate unloading required.', wardId: 19, vehicleId: 'GJ-01-AB-1042', priority: 'critical', isRead: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString(), actionLabel: 'View Vehicle', actionRoute: '/officer/route-optimization' },
  { id: 'ALT-002', type: 'warning', title: 'Low Segregation Compliance', message: 'Ward 19 segregation compliance has dropped to 58% — below the 65% threshold.', wardId: 19, priority: 'high', isRead: false, createdAt: new Date(Date.now() - 45 * 60000).toISOString(), actionLabel: 'View Compliance', actionRoute: '/officer/segregation' },
  { id: 'ALT-003', type: 'critical', title: 'Collection Delay Alert', message: 'Ward 7 collection completion is at 64%. 12 collection points still pending after schedule window.', wardId: 7, priority: 'critical', isRead: false, createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(), actionLabel: 'View Ward', actionRoute: '/officer/ward-analytics' },
  { id: 'ALT-004', type: 'warning', title: 'High Mixed-Waste Complaints', message: 'Ward 12 has received 5 mixed-waste complaints in the last 48 hours — above normal threshold.', wardId: 12, priority: 'high', isRead: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), actionLabel: 'View Grievances', actionRoute: '/officer/grievances' },
  { id: 'ALT-005', type: 'ai_recommendation', title: 'Route Optimization Available', message: 'Route Optimization Agent identified a 9.4 km shorter route for Vehicle GJ-01-AB-1234.', vehicleId: 'GJ-01-AB-1234', priority: 'medium', isRead: false, createdAt: new Date(Date.now() - 20 * 60000).toISOString(), actionLabel: 'Optimize Routes', actionRoute: '/officer/route-optimization' },
  { id: 'ALT-006', type: 'warning', title: 'SLA Breach Risk', message: '3 grievances in Ward 19 are approaching SLA breach. Immediate action required.', wardId: 19, priority: 'high', isRead: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString(), actionLabel: 'View Grievances', actionRoute: '/officer/grievances' },
  { id: 'ALT-007', type: 'info', title: 'Collection Schedule Updated', message: 'Ward 3 and Ward 16 collection schedules updated for tomorrow (22-Jan). 2 vehicles reassigned.', priority: 'low', isRead: true, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'ALT-008', type: 'ai_recommendation', title: 'Citizen Nudge Recommended', message: 'Segregation Compliance Agent recommends sending Gujarati-language reminders to Ward 12 and Ward 19.', wardId: 12, priority: 'medium', isRead: true, createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), actionLabel: 'Send Nudge', actionRoute: '/officer/segregation' },
  { id: 'ALT-009', type: 'warning', title: 'Vehicle Fuel Low', message: 'Vehicle GJ-01-AB-1042 fuel level at 28%. Return to depot or refuel.', vehicleId: 'GJ-01-AB-1042', priority: 'medium', isRead: true, createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: 'ALT-010', type: 'info', title: 'Ward 16 Best Performance', message: 'Ward 16 - Naranpura achieved 96% collection completion this week. Model ward performance.', wardId: 16, priority: 'low', isRead: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
];

export const notifications: Notification[] = [
  { id: 'NTF-001', type: 'grievance', title: 'New Grievance Submitted', message: 'GRV-2026-00124: Missed collection reported in Ward 12 by Ramila Ben Patel.', isRead: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), role: 'officer' },
  { id: 'NTF-002', type: 'route', title: 'Route Optimization Completed', message: 'Route Optimization Agent saved 9.4 km across 8 vehicles. Updated routes dispatched.', isRead: false, createdAt: new Date(Date.now() - 20 * 60000).toISOString(), role: 'officer' },
  { id: 'NTF-003', type: 'compliance', title: 'Compliance Alert: Ward 19', message: 'Ward 19 segregation compliance fell 12% over 7 days. Citizen nudge campaign recommended.', isRead: false, createdAt: new Date(Date.now() - 45 * 60000).toISOString(), role: 'officer' },
  { id: 'NTF-004', type: 'vehicle', title: 'Vehicle Full: GJ-01-AB-1237', message: 'Vehicle GJ-01-AB-1237 reached full capacity in Ward 4. Dispatching alternate vehicle.', isRead: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), role: 'officer' },
  { id: 'NTF-005', type: 'ai', title: 'AI Ward Report Ready', message: 'Ward Analytics Agent generated insight report for Ward 7. Action recommended.', isRead: true, createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), role: 'officer' },
  { id: 'NTF-006', type: 'grievance', title: 'Grievance Assigned', message: 'Your grievance GRV-2026-00124 has been assigned to Inspector Deepak Chauhan.', isRead: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), role: 'citizen' },
  { id: 'NTF-007', type: 'nudge', title: 'Waste Segregation Reminder', message: 'Please separate wet and dry waste before handing to the collection team. Collection tomorrow at 7AM.', isRead: false, createdAt: new Date(Date.now() - 1 * 3600000).toISOString(), role: 'citizen' },
  { id: 'NTF-008', type: 'grievance', title: 'Grievance Status Updated', message: 'Your grievance GRV-2026-00121 has been resolved. Please rate the service.', isRead: true, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), role: 'citizen' },
];

export const agentCards: AgentCard[] = [
  {
    id: 'route-optimization',
    name: 'Route Optimization Agent',
    purpose: 'Dynamically optimizes waste collection routes based on vehicle location, waste volume, traffic conditions, and collection priorities.',
    status: 'active',
    lastAction: 'Optimized 18 vehicle routes — 9.4 km saved across fleet',
    tasksCompleted: 1248,
    currentRecommendation: 'Reroute Vehicle GJ-01-AB-1234 via Sardar Bridge to avoid Station Road congestion.',
    icon: 'Route',
    stats: { 'Vehicles Monitored': 20, 'Wards Covered': 24, 'Collection Points': 312, 'Avg Savings': '9.4 km' }
  },
  {
    id: 'segregation-compliance',
    name: 'Segregation Compliance Agent',
    purpose: 'Monitors household and ward-level waste segregation compliance, identifies risk areas, and triggers citizen nudge campaigns.',
    status: 'needs_attention',
    lastAction: 'Flagged Ward 19 and Ward 12 for declining compliance — nudge campaign triggered',
    tasksCompleted: 3891,
    currentRecommendation: 'Ward 19 compliance at 58%. Send Gujarati-language segregation reminders to 3,284 households.',
    icon: 'Recycle',
    stats: { 'Wards Monitored': 24, 'High Risk Wards': 5, 'Nudges Sent Today': 2840, 'Compliance Trend': '↓ 12%' }
  },
  {
    id: 'grievance-intake',
    name: 'Grievance Intake Agent',
    purpose: 'Accepts citizen grievances in English, Gujarati, and Hindi. Automatically classifies category, detects priority, and extracts location.',
    status: 'active',
    lastAction: 'Classified GRV-2026-00124 as Missed Collection, Priority High — Gujarati input',
    tasksCompleted: 892,
    currentRecommendation: 'GRV-2026-00118 pending classification. Overflowing garbage pattern detected in Ward 6.',
    icon: 'MessageSquare',
    stats: { 'Grievances Today': 7, 'Auto-Classified': '95%', 'Languages Supported': 3, 'Avg Classify Time': '1.2s' }
  },
  {
    id: 'municipal-routing',
    name: 'Municipal Routing Agent',
    purpose: 'Routes classified grievances to the correct municipal department, assigns responsible officers, sets SLA, and tracks resolution.',
    status: 'active',
    lastAction: 'Assigned GRV-2026-00124 to Solid Waste Collection dept, Officer Deepak Chauhan',
    tasksCompleted: 876,
    currentRecommendation: 'GRV-2026-00122 needs manual officer assignment — enforcement area understaffed.',
    icon: 'GitBranch',
    stats: { 'Pending Routing': 3, 'Avg Assign Time': '2.1 min', 'Dept Utilization': '78%', 'SLA Compliance': '84%' }
  },
  {
    id: 'ward-analytics',
    name: 'Ward Analytics Agent',
    purpose: 'Generates ward-level insights, identifies trends, flags risk areas, and provides actionable recommendations for municipal officers.',
    status: 'monitoring',
    lastAction: 'Generated insight report for Ward 7 — collection delay root cause identified',
    tasksCompleted: 214,
    currentRecommendation: 'Ward 12 requires dual-focus: excellent collection (94%) but critically low compliance (61%). Campaign needed.',
    icon: 'BarChart3',
    stats: { 'Reports Generated': 214, 'Wards Analyzed': 24, 'Insights Today': 12, 'Accuracy': '91%' }
  },
];

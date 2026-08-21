import type { Grievance } from '../types';

// Demo grievance data — fictional municipal corpus
const now = new Date();
const dt = (daysAgo: number, hoursAgo = 0) => new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000).toISOString();

export const grievances: Grievance[] = [
  {
    id: 'GRV-2026-00124', citizenName: 'Ramila Ben Patel', citizenPhone: '9898010001', wardId: 12, category: 'missed_collection',
    categoryLabel: 'Missed Collection', description: 'અમારા વિસ્તારમાં ત્રણ દિવસથી કચરો લેવા કોઈ આવ્યું નથી.',
    language: 'gu', priority: 'high', status: 'in_progress', department: 'Solid Waste Collection',
    assignedOfficer: 'Inspector Deepak Chauhan', assignedOfficerEmail: 'deepak.chauhan@gmcorp.gov',
    location: 'Isanpur Road, Ward 12', coordinates: [22.984, 72.627], createdAt: dt(0, 3), updatedAt: dt(0, 1),
    slaHours: 24, aiSummary: 'Citizen reports 3-day missed collection in Ward 12. High priority due to repeated pattern.',
    aiConfidence: 0.94, aiCategory: 'missed_collection', aiPriority: 'high',
    aiReasoningSummary: 'Matched category: Missed Collection. Matched ward: Ward 12. Priority elevated due to repeated complaints.'
  },
  {
    id: 'GRV-2026-00123', citizenName: 'Suresh Kumar Sharma', citizenPhone: '9898010002', wardId: 19, category: 'overflowing_garbage',
    categoryLabel: 'Overflowing Garbage', description: 'कचरा डिब्बा 2 दिनों से भरा हुआ है और दुर्गंध आ रही है।',
    language: 'hi', priority: 'critical', status: 'assigned', department: 'Solid Waste Collection',
    assignedOfficer: 'Inspector Priya Shah', assignedOfficerEmail: 'priya.shah@gmcorp.gov',
    location: 'Near Market, Danilimda, Ward 19', coordinates: [22.971, 72.588], createdAt: dt(1, 2), updatedAt: dt(0, 5),
    slaHours: 12, aiSummary: 'Overflowing garbage bin near market — public health concern.',
    aiConfidence: 0.97, aiCategory: 'overflowing_garbage', aiPriority: 'critical',
    aiReasoningSummary: 'Matched category: Overflowing Garbage. Public health risk detected. Critical priority assigned.'
  },
  {
    id: 'GRV-2026-00122', citizenName: 'Anita Joshi', citizenPhone: '9898010003', wardId: 7, category: 'illegal_dumping',
    categoryLabel: 'Illegal Dumping', description: 'Someone is dumping construction debris on the roadside near Plot 45B, Bopal.',
    language: 'en', priority: 'high', status: 'ai_classified', department: 'Illegal Dumping Enforcement',
    assignedOfficer: 'Unassigned', assignedOfficerEmail: '',
    location: 'Plot 45B, Bopal Bypass Road, Ward 7', coordinates: [23.029, 72.462], createdAt: dt(0, 1), updatedAt: dt(0, 1),
    slaHours: 48, aiSummary: 'Illegal construction debris dumping reported near Bopal Bypass.',
    aiConfidence: 0.89, aiCategory: 'illegal_dumping', aiPriority: 'high',
    aiReasoningSummary: 'Matched category: Illegal Dumping. Construction debris detected. Forwarded to enforcement.'
  },
  {
    id: 'GRV-2026-00121', citizenName: 'Mohammed Salim Khan', citizenPhone: '9898010004', wardId: 14, category: 'vehicle_issue',
    categoryLabel: 'Vehicle Issue', description: 'Collection vehicle came but refused to take wet waste separately. Mixed everything.',
    language: 'en', priority: 'medium', status: 'resolved', department: 'Vehicle Maintenance',
    assignedOfficer: 'Officer Kalpesh Patel', assignedOfficerEmail: 'kalpesh.patel@gmcorp.gov',
    location: 'Juhapura Chowk, Ward 14', coordinates: [23.001, 72.517], createdAt: dt(2, 4), updatedAt: dt(1, 6),
    slaHours: 48, aiSummary: 'Collection vehicle not following segregation protocol.',
    aiConfidence: 0.82, aiCategory: 'vehicle_issue', aiPriority: 'medium',
    aiReasoningSummary: 'Vehicle non-compliance with segregation protocol. Driver training flagged.',
    resolvedAt: dt(1, 6)
  },
  {
    id: 'GRV-2026-00120', citizenName: 'Priya Nair', citizenPhone: '9898010005', wardId: 3, category: 'segregation_issue',
    categoryLabel: 'Segregation Issue', description: 'Collection team is not following wet/dry segregation. Please take action.',
    language: 'en', priority: 'medium', status: 'resolved', department: 'Solid Waste Collection',
    assignedOfficer: 'Supervisor Rekha Dave', assignedOfficerEmail: 'rekha.dave@gmcorp.gov',
    location: 'Paldi Cross Road, Ward 3', coordinates: [23.013, 72.563], createdAt: dt(3, 2), updatedAt: dt(2, 8),
    slaHours: 48, aiSummary: 'Segregation protocol violation during collection.',
    aiConfidence: 0.91, aiCategory: 'segregation_issue', aiPriority: 'medium',
    aiReasoningSummary: 'Segregation complaint. Driver assigned for retraining.', resolvedAt: dt(2, 8)
  },
  {
    id: 'GRV-2026-00119', citizenName: 'Ghanshyam Bhai Desai', citizenPhone: '9898010006', wardId: 22, category: 'missed_collection',
    categoryLabel: 'Missed Collection', description: 'ગઈ કાલ થી આ વિસ્તારમાં ગાડી આવી નથી.',
    language: 'gu', priority: 'high', status: 'in_progress', department: 'Solid Waste Collection',
    assignedOfficer: 'Inspector Heena Vora', assignedOfficerEmail: 'heena.vora@gmcorp.gov',
    location: 'Bapunagar Main Road, Ward 22', coordinates: [23.061, 72.632], createdAt: dt(1, 5), updatedAt: dt(0, 2),
    slaHours: 24, aiSummary: 'Missed collection reported for 1 day in Ward 22.',
    aiConfidence: 0.93, aiCategory: 'missed_collection', aiPriority: 'high',
    aiReasoningSummary: 'Matched category: Missed Collection. Ward 22 flagged for route delay.'
  },
  {
    id: 'GRV-2026-00118', citizenName: 'Sunita Verma', citizenPhone: '9898010007', wardId: 6, category: 'overflowing_garbage',
    categoryLabel: 'Overflowing Garbage', description: 'नगर निगम के डब्बे भरे हुए हैं, कोई नहीं आता।',
    language: 'hi', priority: 'high', status: 'submitted', department: 'Solid Waste Collection',
    assignedOfficer: 'Unassigned', assignedOfficerEmail: '',
    location: 'Chandkheda Sector 7, Ward 6', coordinates: [23.121, 72.589], createdAt: dt(0, 0), updatedAt: dt(0, 0),
    slaHours: 12, aiSummary: 'Community bins overflowing in Ward 6.',
    aiConfidence: 0.96, aiCategory: 'overflowing_garbage', aiPriority: 'high',
    aiReasoningSummary: 'Submitted — pending AI classification.'
  },
  {
    id: 'GRV-2026-00117', citizenName: 'Bharat Lal Mishra', citizenPhone: '9898010008', wardId: 9, category: 'mixed_collection',
    categoryLabel: 'Mixed Waste Collection', description: 'Despite segregating waste at home, the vehicle mixes it at collection.',
    language: 'en', priority: 'medium', status: 'assigned', department: 'Solid Waste Collection',
    assignedOfficer: 'Inspector Amit Pandya', assignedOfficerEmail: 'amit.pandya@gmcorp.gov',
    location: 'Nikol Ring Road, Ward 9', coordinates: [23.051, 72.652], createdAt: dt(2, 3), updatedAt: dt(1, 4),
    slaHours: 48, aiSummary: 'Vehicle mixing segregated waste during collection in Ward 9.',
    aiConfidence: 0.87, aiCategory: 'mixed_collection', aiPriority: 'medium',
    aiReasoningSummary: 'Segregation non-compliance at vehicle level. Supervisor review needed.'
  },
  {
    id: 'GRV-2026-00116', citizenName: 'Fatima Shaikh', citizenPhone: '9898010009', wardId: 19, category: 'missed_collection',
    categoryLabel: 'Missed Collection', description: 'Collection truck not coming regularly. Last 2 days missed.',
    language: 'en', priority: 'high', status: 'in_progress', department: 'Solid Waste Collection',
    assignedOfficer: 'Inspector Priya Shah', assignedOfficerEmail: 'priya.shah@gmcorp.gov',
    location: 'Danilimda Near Mosque, Ward 19', coordinates: [22.969, 72.586], createdAt: dt(1, 8), updatedAt: dt(0, 3),
    slaHours: 24, aiSummary: 'Repeated missed collections in Ward 19. Chronic issue.',
    aiConfidence: 0.95, aiCategory: 'missed_collection', aiPriority: 'high',
    aiReasoningSummary: 'Ward 19 has 4 missed collection complaints this week — escalated.'
  },
  {
    id: 'GRV-2026-00115', citizenName: 'Rajiv Kulkarni', citizenPhone: '9898010010', wardId: 4, category: 'sanitation',
    categoryLabel: 'Sanitation Issue', description: 'Drainage blockage near waste collection point causing sanitation hazard.',
    language: 'en', priority: 'high', status: 'in_progress', department: 'Sanitation',
    assignedOfficer: 'Officer Nirmal Thakkar', assignedOfficerEmail: 'nirmal.thakkar@gmcorp.gov',
    location: 'Maninagar Station Road, Ward 4', coordinates: [22.999, 72.601], createdAt: dt(3, 1), updatedAt: dt(2, 7),
    slaHours: 24, aiSummary: 'Drainage blockage creating sanitation hazard at waste point.',
    aiConfidence: 0.88, aiCategory: 'sanitation', aiPriority: 'high',
    aiReasoningSummary: 'Public health risk. Sanitation dept alerted. Site inspection scheduled.'
  },
];

export const grievanceCategories = [
  { id: 'missed_collection', label: 'Missed Collection', labelGu: 'ચૂકી ગયેલ સંગ્રહ', labelHi: 'मिस्ड संग्रहण', department: 'Solid Waste Collection' as const, defaultPriority: 'high' as const },
  { id: 'mixed_collection', label: 'Mixed Waste Collection', labelGu: 'મિશ્ર કચરો સંગ્રહ', labelHi: 'मिश्रित कचरा संग्रहण', department: 'Solid Waste Collection' as const, defaultPriority: 'medium' as const },
  { id: 'overflowing_garbage', label: 'Overflowing Garbage', labelGu: 'ઉભરાતો કચરો', labelHi: 'उफनता कचरा', department: 'Solid Waste Collection' as const, defaultPriority: 'critical' as const },
  { id: 'illegal_dumping', label: 'Illegal Dumping', labelGu: 'ગેરકાનૂની ડમ્પિંગ', labelHi: 'अवैध डंपिंग', department: 'Illegal Dumping Enforcement' as const, defaultPriority: 'high' as const },
  { id: 'vehicle_issue', label: 'Vehicle Issue', labelGu: 'વાહનની સમસ્યા', labelHi: 'वाहन समस्या', department: 'Vehicle Maintenance' as const, defaultPriority: 'medium' as const },
  { id: 'segregation_issue', label: 'Segregation Issue', labelGu: 'અલગીકરણ સમસ્યા', labelHi: 'पृथक्करण समस्या', department: 'Solid Waste Collection' as const, defaultPriority: 'medium' as const },
  { id: 'sanitation', label: 'Sanitation Issue', labelGu: 'સ્વચ્છતા સમસ્યા', labelHi: 'सफाई समस्या', department: 'Sanitation' as const, defaultPriority: 'high' as const },
  { id: 'other', label: 'Other', labelGu: 'અન્ય', labelHi: 'अन्य', department: 'Citizen Services' as const, defaultPriority: 'low' as const },
];

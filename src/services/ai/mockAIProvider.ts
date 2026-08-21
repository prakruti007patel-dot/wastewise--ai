/**
 * Mock AI Provider — WasteWise AI
 *
 * Provides deterministic, realistic mock AI responses for demonstration.
 * Used when IBM Granite credentials are not configured.
 * All responses simulate what the real Granite LLM would return.
 */

import type { AIProvider } from './aiProvider';
import type {
  AIGrievanceAnalysis,
  AIComplianceAnalysis,
  AIWardReport,
  RouteOptimizationResult,
  Language,
  Priority,
  Department,
} from '../../types';
import { wardCompliance } from '../../data/compliance';
import { vehicles } from '../../data/vehicles';
import { grievanceCategories } from '../../data/grievances';
import { wards } from '../../data/wards';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Department assignment rules
const categoryDeptMap: Record<string, { dept: Department; officer: string; sla: number }> = {
  missed_collection: { dept: 'Solid Waste Collection', officer: 'Inspector Deepak Chauhan', sla: 24 },
  mixed_collection: { dept: 'Solid Waste Collection', officer: 'Supervisor Rekha Dave', sla: 48 },
  overflowing_garbage: { dept: 'Solid Waste Collection', officer: 'Inspector Priya Shah', sla: 12 },
  illegal_dumping: { dept: 'Illegal Dumping Enforcement', officer: 'Officer Rajan Mehta', sla: 48 },
  vehicle_issue: { dept: 'Vehicle Maintenance', officer: 'Officer Kalpesh Patel', sla: 48 },
  segregation_issue: { dept: 'Solid Waste Collection', officer: 'Supervisor Rekha Dave', sla: 48 },
  sanitation: { dept: 'Sanitation', officer: 'Officer Nirmal Thakkar', sla: 24 },
  other: { dept: 'Citizen Services', officer: 'Officer Meena Rao', sla: 72 },
};

// Language detection heuristics
const detectLanguage = (text: string): Language => {
  const guChars = /[\u0A80-\u0AFF]/;
  const hiChars = /[\u0900-\u097F]/;
  if (guChars.test(text)) return 'gu';
  if (hiChars.test(text)) return 'hi';
  return 'en';
};

// Keyword-based category detection
const detectCategory = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes('miss') || lower.includes('not come') || lower.includes('આવ્યું નથી') || lower.includes('नहीं आया') || lower.includes('nt came') || lower.includes('no collect') || lower.includes('ત્રણ દિ') || lower.includes('aat nahi')) return 'missed_collection';
  if (lower.includes('overflow') || lower.includes('full bin') || lower.includes('ઉભરા') || lower.includes('भरा') || lower.includes('bhara')) return 'overflowing_garbage';
  if (lower.includes('dump') || lower.includes('illegal') || lower.includes('ગેરકાનૂ') || lower.includes('अवैध')) return 'illegal_dumping';
  if (lower.includes('vehicle') || lower.includes('truck') || lower.includes('driver') || lower.includes('gaadi') || lower.includes('ગાડ')) return 'vehicle_issue';
  if (lower.includes('segregat') || lower.includes('mix') || lower.includes('dry') || lower.includes('wet') || lower.includes('અલગ')) return 'segregation_issue';
  if (lower.includes('drain') || lower.includes('sanit') || lower.includes('smell') || lower.includes('stink') || lower.includes('durg')) return 'sanitation';
  return 'missed_collection'; // default
};

export class MockAIProvider implements AIProvider {
  readonly providerName = 'WasteWise Mock AI (Demo Mode)';
  readonly isMock = true;

  async analyzeGrievance(params: { text: string; language?: Language; wardId?: number; location?: string }): Promise<AIGrievanceAnalysis> {
    await delay(1200 + Math.random() * 800); // Simulate AI processing

    const detectedLang = params.language || detectLanguage(params.text);
    const categoryId = detectCategory(params.text);
    const catDef = grievanceCategories.find(c => c.id === categoryId) || grievanceCategories[0];
    const deptInfo = categoryDeptMap[categoryId] || categoryDeptMap['other'];

    // Determine priority
    let priority: Priority = catDef.defaultPriority;
    if (categoryId === 'overflowing_garbage') priority = 'critical';
    if (categoryId === 'missed_collection' && (params.text.includes('ત્રણ') || params.text.includes('3 day') || params.text.includes('three'))) priority = 'high';

    const wardId = params.wardId || (priority === 'critical' ? 19 : 12);
    const ward = wards.find(w => w.id === wardId);

    return {
      category: categoryId,
      categoryLabel: catDef.label,
      priority,
      language: detectedLang,
      wardId,
      department: deptInfo.dept,
      summary: `Citizen reports ${catDef.label.toLowerCase()} in ${ward?.name || `Ward ${wardId}`}. Detected language: ${detectedLang.toUpperCase()}. Priority assessed as ${priority.toUpperCase()}.`,
      confidence: 0.88 + Math.random() * 0.1,
      reasoningFactors: [
        `Matched category: ${catDef.label}`,
        `Language detected: ${detectedLang === 'gu' ? 'Gujarati' : detectedLang === 'hi' ? 'Hindi' : 'English'}`,
        `Priority level: ${priority} based on category and context`,
        `Suggested department: ${deptInfo.dept}`,
        wardId === 19 ? `Ward 19 flagged for repeated complaints — priority elevated` : `Ward ${wardId} mapped from location`,
      ],
      suggestedActions: [
        `Dispatch collection team to ${params.location || `Ward ${wardId}`} within ${deptInfo.sla} hours`,
        'Update citizen on status via SMS',
        priority === 'critical' ? 'Notify ward supervisor immediately' : 'Schedule routine follow-up',
      ],
    };
  }

  async optimizeRoutes(params: { vehicleIds: string[]; considerTraffic?: boolean }): Promise<RouteOptimizationResult[]> {
    await delay(2000 + Math.random() * 1000);

    const selectedVehicles = vehicles.filter(v => params.vehicleIds.includes(v.id));

    return selectedVehicles.map(vehicle => {
      const originalKm = 35 + Math.random() * 20;
      const savings = 2 + Math.random() * 8;
      const optimizedKm = originalKm - savings;
      const timeSaved = Math.round(savings * 3.3);
      const fuelSaved = parseFloat((savings * 0.51).toFixed(1));

      return {
        vehicleId: vehicle.id,
        originalRoute: vehicle.assignedRoute,
        optimizedRoute: [...vehicle.assignedRoute].reverse(),
        originalDistanceKm: parseFloat(originalKm.toFixed(1)),
        optimizedDistanceKm: parseFloat(optimizedKm.toFixed(1)),
        distanceSavedKm: parseFloat(savings.toFixed(1)),
        timeSavedMin: timeSaved,
        fuelSavedL: fuelSaved,
        priorityCollectionPoints: vehicle.assignedRoute.slice(0, 2),
        reasoning: [
          'Reordered collection points to minimize backtracking',
          params.considerTraffic ? 'Avoided high-traffic zones (7-9 AM window)' : 'Standard distance optimization applied',
          `Ward ${vehicle.wardId} priority points served first`,
          `Load factor ${Math.round(vehicle.currentLoad / vehicle.capacity * 100)}% — capacity optimized`,
        ],
      };
    });
  }

  async analyzeCompliance(_params: { wardIds?: number[] }): Promise<AIComplianceAnalysis> {
    await delay(1500 + Math.random() * 500);

    const lowWards = wardCompliance
      .filter(w => w.compliancePercent < 70)
      .sort((a, b) => a.compliancePercent - b.compliancePercent);

    return {
      riskWards: lowWards.map(w => w.wardId),
      priorityInterventions: lowWards.slice(0, 4).map(w => ({
        wardId: w.wardId,
        reason: `Compliance at ${w.compliancePercent}% — ${w.trend === 'down' ? 'declining trend detected' : 'sustained low performance'}`,
        action: `Launch Gujarati-language awareness campaign in ${w.wardName}. Target ${w.nonCompliantHouseholds} non-compliant households.`,
      })),
      overallTrend: 'down',
      insights: [
        `Ward 19 has shown a 12% decline in segregation compliance over the last 7 days. Send targeted Gujarati-language reminders to households in this ward.`,
        `Ward 12 compliance dropped from 73% to 61% in 30 days despite high collection completion (94%). Household-level awareness is the key gap.`,
        `Wards 3, 16, and 23 are model performers — their community engagement practices can be replicated in low-performing areas.`,
        `Mixed waste percentage exceeds 35% in 5 wards — indicating lack of awareness rather than infrastructure issues.`,
      ],
      nudgeMessage: {
        en: 'Please separate wet and dry waste before handing it to the collection team. Proper segregation helps build a cleaner city.',
        gu: 'કૃપા કરીને કચરો કલેક્શન ટીમ ને આપતા પહેલા ભીનો અને સૂકો કચરો અલગ કરો. સાચો અલગીકરણ સ્વચ્છ શહેર બાંધવામાં મદદ કરે છે.',
        hi: 'कृपया कचरा संग्रहण टीम को देने से पहले गीले और सूखे कचरे को अलग करें। उचित पृथक्करण एक स्वच्छ शहर बनाने में मदद करता है।',
      },
    };
  }

  async generateWardReport(wardId: number): Promise<AIWardReport> {
    await delay(2200 + Math.random() * 800);

    const ward = wards.find(w => w.id === wardId);
    const compliance = wardCompliance.find(w => w.wardId === wardId);
    const w = ward!;
    const c = compliance!;

    const isHighRisk = c.compliancePercent < 65 || w.collectionCompletion < 82;

    return {
      wardId,
      currentStatus: isHighRisk
        ? `Ward ${wardId} — ${w.name.split(' - ')[1]} is currently at HIGH RISK. Collection completion: ${w.collectionCompletion}%. Segregation compliance: ${c.compliancePercent}%. ${w.openGrievances} open grievances require immediate attention.`
        : `Ward ${wardId} — ${w.name.split(' - ')[1]} is performing adequately. Collection completion at ${w.collectionCompletion}% and segregation compliance at ${c.compliancePercent}%.`,
      majorIssues: [
        c.compliancePercent < 65 ? `Critical: Segregation compliance at ${c.compliancePercent}% — households not separating waste` : null,
        w.collectionCompletion < 85 ? `Route delays affecting ${100 - w.collectionCompletion}% of daily collection targets` : null,
        w.openGrievances > 10 ? `${w.openGrievances} unresolved grievances — SLA breach risk` : null,
        c.mixedWastePercent > 30 ? `High mixed-waste ratio (${c.mixedWastePercent}%) indicating citizen awareness gap` : null,
      ].filter(Boolean) as string[],
      trends: [
        `Compliance trend: ${c.trend === 'down' ? `📉 Declining — dropped from ${c.weeklyTrend[0]}% to ${c.weeklyTrend[6]}% over 7 days` : c.trend === 'up' ? `📈 Improving — up from ${c.weeklyTrend[0]}% to ${c.weeklyTrend[6]}% over 7 days` : '📊 Stable compliance over 7 days'}`,
        `Collection completion: ${w.trend === 'stable' ? 'Consistent' : w.trend === 'up' ? 'Improving' : 'Declining'} trend`,
        `Wet waste ratio at ${c.wetWastePercent}% — ${c.wetWastePercent > 35 ? 'good' : 'below target 35%'}`,
      ],
      riskAreas: isHighRisk ? [
        `Residential clusters with >40% mixed waste — immediate outreach needed`,
        `Vehicle capacity constraints causing collection delays`,
        `Citizen awareness gap in dense residential zones`,
      ] : [
        `Minor risk: dry waste percentage could be improved`,
        `Monitor hazardous waste disposal compliance`,
      ],
      recommendedActions: [
        `Launch ${c.compliancePercent < 65 ? 'emergency' : 'routine'} citizen awareness campaign in Gujarati, Hindi, and English`,
        `Assign ${w.vehiclesAssigned < 4 ? 'additional vehicles' : 'route optimization'} to improve collection coverage`,
        `Conduct field inspection of top ${Math.ceil(w.openGrievances / 3)} grievance locations`,
        c.compliancePercent < 70 ? `Deploy compliance officers for household visits in non-compliant blocks` : `Maintain current compliance programs`,
        `Set up community feedback sessions with residents' associations`,
      ],
      expectedImpact: `Implementing these actions is expected to improve segregation compliance by 8-12% within 30 days and reduce grievances by 25-30%. Collection efficiency can improve by 5-8% with route optimization.`,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateCitizenNudge(params: { wardId: number; language: Language; messageType: string }): Promise<string> {
    await delay(800 + Math.random() * 400);

    const messages: Record<Language, Record<string, string>> = {
      en: {
        segregation: 'Please separate wet and dry waste before handing it to the collection team. Use green bins for kitchen waste and blue bins for paper, plastic, and metal.',
        missed_collection: `We regret the delay in waste collection in Ward ${params.wardId}. Our team will reach your area within 24 hours. We apologize for the inconvenience.`,
        awareness: 'Did you know? Proper waste segregation can reduce landfill waste by up to 60% and supports recycling in your city.',
        schedule: `Waste collection in Ward ${params.wardId} is scheduled for tomorrow at 7:00 AM. Please keep your segregated waste ready at the collection point.`,
      },
      gu: {
        segregation: 'કૃપા કરીને કચરો કલેક્શન ટીમ ને આપતા પહેલા ભીનો અને સૂકો કચરો અલગ કરો. રસોઈ કચરો લીલા ડબ્બામાં અને કાગળ, પ્લાસ્ટિક, ધાતુ વાદળી ડબ્બામાં નાખો.',
        missed_collection: `વોર્ડ ${params.wardId} માં કચરો સંગ્રહ મોડો થવા બદલ ક્ષમા. અમારી ટીમ ૨૪ કલાક માં આ વિસ્તારમાં આવશે. અગવડ માટે ખેદ.`,
        awareness: 'શું તમે જાણો છો? સાચો કચરો અલગ કરવાથી ૬૦% ઘન કચરો ઓછો થઈ શકે છે અને રિસાઇક્લિંગ વધે છે.',
        schedule: `વોર્ડ ${params.wardId} માં કાલ સવારે ૭:૦૦ વાગ્યે કચરો સંગ્રહ થશે. કૃપા કરીને અલગ કરેલ કચરો કલેક્શન પૉઇન્ટ પર તૈયાર રાખો.`,
      },
      hi: {
        segregation: 'कृपया कचरा संग्रहण टीम को देने से पहले गीले और सूखे कचरे को अलग करें। रसोई का कचरा हरी बाल्टी में और कागज, प्लास्टिक, धातु नीली बाल्टी में डालें।',
        missed_collection: `वार्ड ${params.wardId} में कचरा संग्रहण में देरी के लिए खेद है। हमारी टीम 24 घंटे में आपके क्षेत्र में आएगी।`,
        awareness: 'क्या आप जानते हैं? सही कचरा पृथक्करण से 60% तक लैंडफिल कचरा कम हो सकता है।',
        schedule: `वार्ड ${params.wardId} में कल सुबह 7:00 बजे कचरा संग्रहण होगा। कृपया अलग किया हुआ कचरा संग्रह बिंदु पर तैयार रखें।`,
      },
    };

    return messages[params.language]?.[params.messageType] || messages['en']?.['segregation'];
  }

  async classifyGrievanceRouting(params: { category: string; priority: Priority; wardId: number; description: string }): Promise<{
    department: Department;
    officer: string;
    slaHours: number;
    reasoningFactors: string[];
  }> {
    await delay(900 + Math.random() * 600);

    const deptInfo = categoryDeptMap[params.category] || categoryDeptMap['other'];
    let slaHours = deptInfo.sla;
    if (params.priority === 'critical') slaHours = Math.min(slaHours, 12);
    if (params.priority === 'high') slaHours = Math.min(slaHours, 24);

    return {
      department: deptInfo.dept,
      officer: deptInfo.officer,
      slaHours,
      reasoningFactors: [
        `Matched category: ${grievanceCategories.find(c => c.id === params.category)?.label || params.category}`,
        `Matched ward: Ward ${params.wardId}`,
        params.priority === 'critical' ? 'Priority elevated — SLA reduced to 12 hours' : `SLA set to ${slaHours} hours based on category priority`,
        `Assigned department: ${deptInfo.dept}`,
        `Responsible officer: ${deptInfo.officer}`,
      ],
    };
  }
}

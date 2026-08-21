/**
 * AI Routes — WasteWise API
 *
 * These endpoints proxy requests to IBM Granite LLM when credentials are configured.
 * Falls back to mock responses for demo mode.
 *
 * IBM Granite Integration:
 * Set IBM_CLOUD_API_KEY, IBM_CLOUD_PROJECT_ID, IBM_GRANITE_ENDPOINT in .env
 */

import { Router, Request, Response } from 'express';
const router = Router();

const useGranite = !!process.env.IBM_CLOUD_API_KEY;

// IBM Granite API call helper (when credentials available)
async function callGranite(prompt: string): Promise<string> {
  if (!useGranite) throw new Error('Granite not configured');

  const tokenResponse = await fetch(
    'https://iam.cloud.ibm.com/identity/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `apikey=${process.env.IBM_CLOUD_API_KEY}&grant_type=urn:ibm:params:oauth:grant-type:apikey`,
    }
  );
  const { access_token } = await tokenResponse.json() as { access_token: string };

  const response = await fetch(
    `${process.env.IBM_GRANITE_ENDPOINT || 'https://us-south.ml.cloud.ibm.com'}/ml/v1/text/generation?version=2023-05-29`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
      body: JSON.stringify({
        model_id: process.env.IBM_GRANITE_MODEL || 'ibm/granite-13b-chat-v2',
        input: prompt,
        project_id: process.env.IBM_CLOUD_PROJECT_ID,
        parameters: { decoding_method: 'greedy', max_new_tokens: 500, temperature: 0.1 },
      }),
    }
  );
  const data = await response.json() as { results: { generated_text: string }[] };
  return data.results?.[0]?.generated_text || '';
}

// Analyze grievance
router.post('/analyze-grievance', async (req: Request, res: Response) => {
  const { text, language, wardId, location } = req.body;

  if (useGranite) {
    try {
      const prompt = `You are a municipal waste management AI assistant for Gujarat, India.
Analyze this citizen grievance and respond with JSON only:
Text: "${text}"
Language: ${language}
Ward: ${wardId}
Location: ${location}

Respond with this exact JSON structure:
{"category":"missed_collection|overflowing_garbage|illegal_dumping|vehicle_issue|segregation_issue|sanitation|other","categoryLabel":"string","priority":"low|medium|high|critical","language":"en|gu|hi","wardId":${wardId},"department":"Solid Waste Collection|Sanitation|Vehicle Maintenance|Public Health|Illegal Dumping Enforcement|Citizen Services","summary":"brief summary","confidence":0.9,"reasoningFactors":["factor1","factor2"],"suggestedActions":["action1"]}`;

      const result = await callGranite(prompt);
      const json = JSON.parse(result);
      return res.json(json);
    } catch (err) {
      console.warn('Granite failed, falling back to mock:', err);
    }
  }

  // Mock response
  const isGujarati = /[\u0A80-\u0AFF]/.test(text);
  const isHindi = /[\u0900-\u097F]/.test(text);
  const detectedLang = isGujarati ? 'gu' : isHindi ? 'hi' : 'en';
  const category = text.toLowerCase().includes('miss') || text.includes('આવ્યું નથી') || text.includes('नहीं आया') ? 'missed_collection' : 'overflowing_garbage';

  res.json({
    category,
    categoryLabel: category === 'missed_collection' ? 'Missed Collection' : 'Overflowing Garbage',
    priority: 'high',
    language: detectedLang,
    wardId: wardId || 12,
    department: 'Solid Waste Collection',
    summary: `Citizen reports ${category.replace('_', ' ')} in Ward ${wardId || 12}. AI Demo Mode.`,
    confidence: 0.91,
    reasoningFactors: [
      `Matched category: ${category === 'missed_collection' ? 'Missed Collection' : 'Overflowing Garbage'}`,
      `Language detected: ${detectedLang === 'gu' ? 'Gujarati' : detectedLang === 'hi' ? 'Hindi' : 'English'}`,
      `Priority: high based on complaint type`,
    ],
    suggestedActions: ['Dispatch collection team within 24 hours', 'Update citizen via SMS'],
  });
});

// Optimize routes (demo only on backend, detailed logic in frontend mock)
router.post('/optimize-routes', (req: Request, res: Response) => {
  const { vehicleIds } = req.body;
  res.json({ message: 'Route optimization — full logic in frontend AIService', vehicleCount: vehicleIds?.length || 0 });
});

// Analyze compliance
router.post('/analyze-compliance', (req: Request, res: Response) => {
  res.json({
    riskWards: [7, 12, 14, 19, 22],
    overallTrend: 'down',
    insights: ['Ward 19 has declining compliance — immediate intervention required', 'Ward 12 has high collection but low compliance'],
    nudgeMessage: {
      en: 'Please separate wet and dry waste before handing to the collection team.',
      gu: 'કૃપા કરીને ભીનો અને સૂકો કચરો અલગ કરો.',
      hi: 'कृपया गीले और सूखे कचरे को अलग करें।',
    },
  });
});

// Generate ward report
router.post('/ward-report', (req: Request, res: Response) => {
  const { wardId } = req.body;
  res.json({
    wardId,
    currentStatus: `Ward ${wardId} analysis complete — see frontend for detailed mock report.`,
    majorIssues: ['Segregation compliance needs improvement'],
    recommendedActions: ['Launch awareness campaign', 'Optimize collection routes'],
    generatedAt: new Date().toISOString(),
  });
});

// Generate citizen nudge
router.post('/citizen-nudge', (req: Request, res: Response) => {
  const { wardId, language, messageType } = req.body;
  const messages: Record<string, string> = {
    en: 'Please separate wet and dry waste before handing it to the collection team.',
    gu: 'કૃપા કરીને ભીનો અને સૂકો કચરો અલગ કરો.',
    hi: 'कृपया गीले और सूखे कचरे को अलग करें।',
  };
  res.json({ message: messages[language] || messages.en, wardId, messageType });
});

// Classify routing
router.post('/classify-routing', (req: Request, res: Response) => {
  const { category, priority, wardId } = req.body;
  const deptMap: Record<string, string> = {
    missed_collection: 'Solid Waste Collection',
    overflowing_garbage: 'Solid Waste Collection',
    illegal_dumping: 'Illegal Dumping Enforcement',
    vehicle_issue: 'Vehicle Maintenance',
    sanitation: 'Sanitation',
    other: 'Citizen Services',
  };
  res.json({
    department: deptMap[category] || 'Citizen Services',
    officer: 'Officer On Duty',
    slaHours: priority === 'critical' ? 12 : priority === 'high' ? 24 : 48,
    reasoningFactors: [`Matched category: ${category}`, `Ward: ${wardId}`, `SLA based on priority: ${priority}`],
  });
});

export default router;

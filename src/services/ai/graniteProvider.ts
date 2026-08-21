/**
 * IBM Granite AI Provider — WasteWise AI
 *
 * Connects to IBM Granite LLM via IBM Cloud WatsonX.
 * Requires: IBM_CLOUD_API_KEY, IBM_CLOUD_PROJECT_ID, IBM_GRANITE_ENDPOINT
 *
 * Configure via backend environment variables only.
 * The frontend NEVER accesses IBM credentials directly.
 * All Granite API calls go through the backend /api/ai/* endpoints.
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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class GraniteAIProvider implements AIProvider {
  readonly providerName = 'IBM Granite LLM (IBM Cloud WatsonX)';
  readonly isMock = false;

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Granite API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async analyzeGrievance(params: {
    text: string;
    language: Language;
    wardId?: number;
    location?: string;
  }): Promise<AIGrievanceAnalysis> {
    return this.post('/ai/analyze-grievance', params);
  }

  async optimizeRoutes(params: {
    vehicleIds: string[];
    considerTraffic?: boolean;
  }): Promise<RouteOptimizationResult[]> {
    return this.post('/ai/optimize-routes', params);
  }

  async analyzeCompliance(params: { wardIds?: number[] }): Promise<AIComplianceAnalysis> {
    return this.post('/ai/analyze-compliance', params);
  }

  async generateWardReport(wardId: number): Promise<AIWardReport> {
    return this.post('/ai/ward-report', { wardId });
  }

  async generateCitizenNudge(params: {
    wardId: number;
    language: Language;
    messageType: string;
  }): Promise<string> {
    const result = await this.post<{ message: string }>('/ai/citizen-nudge', params);
    return result.message;
  }

  async classifyGrievanceRouting(params: {
    category: string;
    priority: Priority;
    wardId: number;
    description: string;
  }): Promise<{
    department: Department;
    officer: string;
    slaHours: number;
    reasoningFactors: string[];
  }> {
    return this.post('/ai/classify-routing', params);
  }
}

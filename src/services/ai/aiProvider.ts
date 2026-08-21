/**
 * AI Provider Interface — WasteWise AI
 *
 * All AI providers (Mock or IBM Granite) must implement this interface.
 * This ensures the UI layer is completely decoupled from the AI backend.
 */

import type {
  AIGrievanceAnalysis,
  AIComplianceAnalysis,
  AIWardReport,
  RouteOptimizationResult,
  Language,
  Priority,
  Department,
} from '../../types';

export interface AIProvider {
  /** Analyze and classify a citizen grievance from natural language input */
  analyzeGrievance(params: {
    text: string;
    language: Language;
    wardId?: number;
    location?: string;
  }): Promise<AIGrievanceAnalysis>;

  /** Optimize collection routes for a set of vehicles */
  optimizeRoutes(params: {
    vehicleIds: string[];
    considerTraffic?: boolean;
  }): Promise<RouteOptimizationResult[]>;

  /** Analyze ward segregation compliance and recommend interventions */
  analyzeCompliance(params: {
    wardIds?: number[];
  }): Promise<AIComplianceAnalysis>;

  /** Generate a comprehensive ward analytics report */
  generateWardReport(wardId: number): Promise<AIWardReport>;

  /** Generate a citizen nudge message for a specific ward and language */
  generateCitizenNudge(params: {
    wardId: number;
    language: Language;
    messageType: 'segregation' | 'missed_collection' | 'awareness' | 'schedule';
  }): Promise<string>;

  /** Classify grievance routing — which dept and officer to assign */
  classifyGrievanceRouting(params: {
    category: string;
    priority: Priority;
    wardId: number;
    description: string;
  }): Promise<{
    department: Department;
    officer: string;
    slaHours: number;
    reasoningFactors: string[];
  }>;

  /** Provider name for display */
  readonly providerName: string;
  readonly isMock: boolean;
}

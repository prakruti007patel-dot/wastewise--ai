// ============================================================
// Core Entity Types for WasteWise AI
// ============================================================

export type WasteCategory = 'wet' | 'dry' | 'hazardous' | 'mixed' | 'sanitary';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type GrievanceStatus = 'submitted' | 'ai_classified' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type VehicleStatus = 'on_route' | 'idle' | 'maintenance' | 'full' | 'completed';
export type AgentStatus = 'active' | 'monitoring' | 'needs_attention' | 'idle';
export type Language = 'en' | 'gu' | 'hi';
export type AlertType = 'critical' | 'warning' | 'info' | 'ai_recommendation';
export type UserRole = 'officer' | 'citizen';
export type TrendDirection = 'up' | 'down' | 'stable';
export type Department =
  | 'Solid Waste Collection'
  | 'Sanitation'
  | 'Vehicle Maintenance'
  | 'Public Health'
  | 'Illegal Dumping Enforcement'
  | 'Citizen Services';

// ============================================================
// Ward
// ============================================================

export interface Ward {
  id: number;
  name: string;
  population: number;
  households: number;
  area: number; // sq km
  dailyWasteKg: number;
  collectionCompletion: number; // percentage
  segregationCompliance: number; // percentage
  openGrievances: number;
  vehiclesAssigned: number;
  routeEfficiency: number; // percentage
  avgResolutionTime: number; // hours
  coordinates: [number, number]; // [lat, lng]
  trend: TrendDirection;
  riskLevel: 'low' | 'medium' | 'high';
}

// ============================================================
// Vehicle
// ============================================================

export interface Vehicle {
  id: string;
  driverName: string;
  driverPhone: string;
  wardId: number;
  capacity: number; // tons
  currentLoad: number; // tons
  status: VehicleStatus;
  currentLocation: [number, number]; // [lat, lng]
  routeProgress: number; // percentage
  collectionPointsTotal: number;
  collectionPointsCompleted: number;
  assignedRoute: string[];
  fuelLevel: number; // percentage
  lastUpdated: string;
}

// ============================================================
// Collection Point
// ============================================================

export interface CollectionPoint {
  id: string;
  wardId: number;
  name: string;
  address: string;
  coordinates: [number, number];
  wasteEstimateKg: number;
  lastCollected: string;
  status: 'pending' | 'collected' | 'skipped' | 'overflow';
  type: 'household' | 'commercial' | 'bulk' | 'community';
  priority: Priority;
}

// ============================================================
// Grievance
// ============================================================

export interface GrievanceCategory {
  id: string;
  label: string;
  labelGu: string;
  labelHi: string;
  department: Department;
  defaultPriority: Priority;
}

export interface Grievance {
  id: string;
  citizenName: string;
  citizenPhone: string;
  wardId: number;
  category: string;
  categoryLabel: string;
  description: string;
  language: Language;
  priority: Priority;
  status: GrievanceStatus;
  department: Department;
  assignedOfficer: string;
  assignedOfficerEmail: string;
  location: string;
  coordinates?: [number, number];
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  resolvedAt?: string;
  aiSummary?: string;
  aiConfidence?: number;
  imageUrl?: string;
  // AI classification data
  aiCategory?: string;
  aiPriority?: Priority;
  aiReasoningSummary?: string;
}

// ============================================================
// Compliance
// ============================================================

export interface WardCompliance {
  wardId: number;
  wardName: string;
  households: number;
  compliantHouseholds: number;
  nonCompliantHouseholds: number;
  compliancePercent: number;
  wetWastePercent: number;
  dryWastePercent: number;
  hazardousPercent: number;
  mixedWastePercent: number;
  trend: TrendDirection;
  weeklyTrend: number[]; // 7 days
  riskLevel: 'low' | 'medium' | 'high';
  lastInspection: string;
}

// ============================================================
// Analytics
// ============================================================

export interface WardAnalytics {
  wardId: number;
  period: string;
  wasteGenerationTrend: { date: string; kg: number }[];
  complianceTrend: { date: string; percent: number }[];
  collectionTrend: { date: string; percent: number }[];
  grievanceTrend: { date: string; count: number }[];
  wasteDistribution: {
    wet: number;
    dry: number;
    hazardous: number;
    mixed: number;
  };
  kpis: {
    avgCollectionCompletion: number;
    avgSegregationCompliance: number;
    totalGrievances: number;
    resolvedGrievances: number;
    avgResolutionHours: number;
    totalWasteKg: number;
  };
}

// ============================================================
// Alert
// ============================================================

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  wardId?: number;
  vehicleId?: string;
  priority: Priority;
  isRead: boolean;
  createdAt: string;
  actionLabel?: string;
  actionRoute?: string;
}

// ============================================================
// Notification
// ============================================================

export interface Notification {
  id: string;
  type: 'grievance' | 'route' | 'compliance' | 'vehicle' | 'system' | 'ai' | 'nudge';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: string;
  role: UserRole | 'all';
}

// ============================================================
// AI Agent
// ============================================================

export interface AgentCard {
  id: string;
  name: string;
  purpose: string;
  status: AgentStatus;
  lastAction: string;
  tasksCompleted: number;
  currentRecommendation: string;
  icon: string;
  stats?: Record<string, string | number>;
}

// ============================================================
// Route Optimization
// ============================================================

export interface RouteOptimizationResult {
  vehicleId: string;
  originalRoute: string[];
  optimizedRoute: string[];
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  distanceSavedKm: number;
  timeSavedMin: number;
  fuelSavedL: number;
  priorityCollectionPoints: string[];
  reasoning: string[];
}

// ============================================================
// AI Service Types
// ============================================================

export interface AIGrievanceAnalysis {
  category: string;
  categoryLabel: string;
  priority: Priority;
  language: Language;
  wardId: number;
  department: Department;
  summary: string;
  confidence: number;
  reasoningFactors: string[];
  suggestedActions: string[];
}

export interface AIComplianceAnalysis {
  riskWards: number[];
  priorityInterventions: { wardId: number; reason: string; action: string }[];
  overallTrend: TrendDirection;
  insights: string[];
  nudgeMessage: Record<Language, string>;
}

export interface AIWardReport {
  wardId: number;
  currentStatus: string;
  majorIssues: string[];
  trends: string[];
  riskAreas: string[];
  recommendedActions: string[];
  expectedImpact: string;
  generatedAt: string;
}

// ============================================================
// User / Auth
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  wardId?: number;
  designation?: string;
  phone?: string;
  avatar?: string;
}

// ============================================================
// Citizen Nudge
// ============================================================

export interface CitizenNudge {
  id: string;
  wardId: number;
  language: Language;
  messageType: 'segregation' | 'missed_collection' | 'schedule' | 'awareness' | 'ward_alert';
  message: string;
  scheduledAt: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  targetHouseholds: number;
}

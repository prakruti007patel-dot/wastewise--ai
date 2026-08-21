# WasteWise AI — Architecture Documentation

## System Overview

WasteWise AI is a full-stack agentic AI application with a React frontend, Express backend, and IBM Granite LLM integration layer.

```
┌────────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                           │
│                                                                    │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐    │
│  │  Auth Layer │  │            React Application              │    │
│  │  (session   │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │   storage)  │  │  │ Officer  │ │ Citizen  │ │  Public  │  │    │
│  └─────────────┘  │  │  Pages   │ │  Pages   │ │  Pages   │  │    │
│                   │  └──────────┘ └──────────┘ └──────────┘  │    │
│                   │  ┌─────────────────────────────────────┐  │    │
│                   │  │       AI Service Abstraction         │  │    │
│                   │  │  MockAIProvider | GraniteAIProvider  │  │    │
│                   │  └─────────────────────────────────────┘  │    │
│                   └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST (when Granite mode)
                                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                    Express Backend (Node.js)                       │
│                                                                    │
│  /api/wards    /api/vehicles    /api/grievances                    │
│  /api/analytics  /api/notifications                                │
│  /api/ai/*  (Granite proxy)                                        │
└────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ IBM Cloud API (when configured)
                                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                       IBM Cloud WatsonX                            │
│                    IBM Granite LLM                                 │
│   ibm/granite-13b-chat-v2  (or other Granite model)               │
└────────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App.tsx
├── BrowserRouter
│   ├── AuthProvider
│   │   ├── LanguageProvider
│   │   │   ├── ToastProvider
│   │   │   │   ├── / → LandingPage
│   │   │   │   ├── /login → LoginPage
│   │   │   │   ├── /officer/* → AppLayout
│   │   │   │   │   ├── Sidebar (navigation)
│   │   │   │   │   ├── TopBar (language, notifications)
│   │   │   │   │   └── Outlet → Officer Pages
│   │   │   │   └── /citizen/* → AppLayout
│   │   │   │       └── Outlet → Citizen Pages
```

### State Management
- **React Context** — Auth, Language, Toasts (no external state library)
- **Local component state** — Page-specific data
- **Session storage** — User auth persistence across refreshes
- All mock data is imported from TypeScript data files

### AI Service Layer
```typescript
AIProvider (interface)
    ├── MockAIProvider   — Default, no credentials needed
    └── GraniteAIProvider — Activated via VITE_AI_PROVIDER=granite
```

The factory pattern in `src/services/ai/index.ts` resolves the correct provider based on environment variables. UI components **never import providers directly** — they only use the `aiService` singleton.

## Security Architecture

1. **No secrets in frontend** — IBM credentials never touch browser
2. **Backend proxy** — All Granite API calls go through Express server
3. **Environment variables** — Configured via `.env` (never committed)
4. **Input sanitization** — Form validation on all user inputs
5. **CORS** — Backend allows only frontend origin

## Data Flow

### Grievance Flow
```
Citizen writes text (EN/GU/HI)
    → ReportGrievance component calls aiService.analyzeGrievance()
    → MockAIProvider (or Granite) detects language, classifies category
    → Returns AIGrievanceAnalysis (category, priority, dept, summary)
    → UI shows grievance ID and AI analysis card
    → Separately, classifyGrievanceRouting() assigns dept + officer
```

### Route Optimization Flow
```
Officer clicks "Optimize Routes"
    → RouteOptimization component calls aiService.optimizeRoutes()
    → MockAIProvider generates per-vehicle optimized routes
    → Returns RouteOptimizationResult[] with distances/savings
    → UI shows before/after table + updated map
```

### Compliance Nudge Flow
```
Officer clicks "Analyze Compliance"
    → SegregationCompliance calls aiService.analyzeCompliance()
    → Returns risk wards, insights, nudge messages in 3 languages
    → Officer selects ward + language → aiService.generateCitizenNudge()
    → Modal shows preview → "Send" triggers mock notification
```

## Map Implementation

Uses **Leaflet + OpenStreetMap** (free, no API key):
- Dynamically imported to avoid SSR issues
- Vehicle markers with color-coded status (green/red/orange)
- Collection point markers
- Graceful fallback if tiles fail to load
- Demo locations are fictional coordinates in Gujarat area

## IBM Cloud Readiness

The application can be deployed to IBM Cloud as follows:
1. **Frontend** → IBM Cloud Static Files / IBM Code Engine
2. **Backend** → IBM Code Engine (Node.js container)
3. **Database** → IBM Cloudant or IBM Db2
4. **AI** → IBM WatsonX with Granite model
5. **Object Storage** → IBM Cloud Object Storage for grievance images

# WasteWise AI — Municipal Solid Waste & Circular Economy Agent

> **Agentic AI-powered Municipal Waste Management Platform for Gujarat, India**
> Built with IBM Bob · IBM Granite LLM · React · TypeScript · Tailwind CSS

---

## 🌿 Overview

**WasteWise AI** is a complete agentic AI prototype for municipal solid waste management. It demonstrates five intelligent AI agents collaborating to improve waste collection, segregation compliance, grievance routing, and ward-level decision-making for municipal corporations in Gujarat, India.

> ⚠️ **Demo Prototype** — All data is fictional and synthetic. This application does not represent any real municipal corporation. Use for demonstration and hackathon purposes only.

---

## 🎯 Problem Statement

Municipal waste management in Indian cities faces systemic challenges:

1. **Poor door-to-door waste segregation** — Citizens lack awareness and reminders
2. **Inefficient collection routes** — Vehicles waste fuel and time with suboptimal paths
3. **Delayed grievance resolution** — Complaints misrouted or unresolved for days
4. **No centralized ward analytics** — Officers lack data-driven ward-level insights
5. **Communication barriers** — Officers can't reach citizens in regional languages
6. **Reactive instead of proactive** — No AI-driven early warning system

---

## 🤖 Five AI Agents

| Agent | Purpose | Tech |
|-------|---------|------|
| **Route Optimization Agent** | Optimize collection routes based on vehicle location, waste volume, and traffic | IBM Granite LLM |
| **Segregation Compliance Agent** | Monitor compliance, identify risk wards, trigger citizen nudge campaigns | IBM Granite LLM |
| **Grievance Intake Agent** | Accept multilingual grievances, auto-classify category and priority | IBM Granite LLM |
| **Municipal Routing Agent** | Route grievances to correct department, assign officer, set SLA | IBM Granite LLM |
| **Ward Analytics Agent** | Generate ward insights, trend analysis, risk flags, recommendations | IBM Granite LLM |

---

## ✨ Features

- **Multi-role demo** — Municipal Officer and Citizen accounts
- **Multilingual UI** — English, Gujarati (ગુજરાતી), Hindi (हिंदी)
- **5 Agentic AI workflows** with realistic mock AI responses
- **Route optimization** — Interactive map with before/after comparison
- **Segregation compliance monitoring** — Charts, trends, risk analysis
- **Intelligent grievance routing** — Auto-classification in 3 languages
- **Ward analytics dashboard** — AI-generated ward reports
- **Citizen nudge system** — Multilingual targeted notifications
- **Interactive Leaflet/OpenStreetMap** — Vehicle and collection point tracking
- **Recharts analytics** — Line, bar, area, pie charts with tooltips
- **IBM Granite ready** — Clean provider abstraction for real LLM connection
- **Responsive design** — Works on desktop, tablet, and mobile

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   WasteWise AI Frontend              │
│           React + TypeScript + Vite + Tailwind       │
├─────────────────┬───────────────────────────────────┤
│  Citizen Portal │       Officer Dashboard             │
│  (EN/GU/HI)     │  (24 wards, 20 vehicles, 5 agents) │
├─────────────────┴───────────────────────────────────┤
│              AI Service Layer (abstracted)           │
│    MockAIProvider ←→ GraniteAIProvider               │
├─────────────────────────────────────────────────────┤
│              Express Backend (Node.js)               │
│  /api/wards  /api/vehicles  /api/ai/*                │
├─────────────────────────────────────────────────────┤
│              IBM Cloud / IBM Granite LLM             │
│           (optional — mock used by default)          │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 5 (build tool)
- Tailwind CSS (utility-first styling)
- React Router v6 (routing)
- Recharts (data visualization)
- Leaflet + OpenStreetMap (maps — no paid API)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- CORS, dotenv

**AI:**
- IBM Granite LLM (IBM Cloud WatsonX) — optional
- Mock AI Provider (default, no credentials needed)

---

## 📁 Project Structure

```
wastewise-ai/
├── src/
│   ├── components/
│   │   ├── common/          # Badges, Cards, Buttons, Forms, Table, Toast
│   │   └── maps/            # LeafletMap component
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Demo auth state
│   │   ├── LanguageContext.tsx  # EN/GU/HI
│   │   └── ToastContext.tsx # Toast notifications
│   ├── data/
│   │   ├── wards.ts         # 24 ward mock data
│   │   ├── vehicles.ts      # 20 vehicle mock data
│   │   ├── grievances.ts    # 10 grievance examples
│   │   ├── compliance.ts    # Segregation compliance
│   │   ├── analytics.ts     # Ward analytics data
│   │   └── alerts.ts        # Alerts, notifications, agent cards
│   ├── i18n/
│   │   ├── en.ts, gu.ts, hi.ts  # Translations
│   │   └── index.ts
│   ├── layouts/
│   │   ├── Sidebar.tsx      # Navigation sidebar + top bar
│   │   └── AppLayout.tsx    # Main layout wrapper
│   ├── pages/
│   │   ├── Landing.tsx      # Public landing page
│   │   ├── Login.tsx        # Demo login
│   │   ├── officer/         # 8 officer pages
│   │   └── citizen/         # 5 citizen pages
│   ├── services/
│   │   └── ai/
│   │       ├── aiProvider.ts      # Interface
│   │       ├── mockAIProvider.ts  # Mock AI (default)
│   │       ├── graniteProvider.ts # IBM Granite (optional)
│   │       └── index.ts           # Factory
│   ├── types/
│   │   └── index.ts         # All TypeScript types
│   ├── App.tsx              # Routing
│   └── main.tsx             # Entry point
│
├── server/
│   └── src/
│       ├── index.ts         # Express server
│       └── routes/          # API routes
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AGENTS.md
│   └── API.md
│
├── .env.example             # Environment variables template
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16 (tested with v20.17.0)
- npm >= 8

### 1. Clone / Open the project
```bash
cd wastewise-ai
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up environment (optional)
```bash
cp .env.example .env
# Edit .env to add IBM Cloud credentials (optional — app works without them)
```

### 4. Run the frontend (development mode)
```bash
npm run dev
```
Open: **http://localhost:5173**

### 5. (Optional) Run the backend API
```bash
cd server
npm install
npm run dev
```
Backend at: **http://localhost:3001**

---

## 🔐 Demo Accounts

| Role | Name | Login |
|------|------|-------|
| **Municipal Officer** | Rajesh Kumar Sharma | Click "Officer Demo Login" |
| **Citizen** | Meena Patel (Ward 12) | Click "Citizen Demo Login" |

No password required for demo mode.

---

## 🤖 IBM Granite Integration

### Default Mode (Demo / Mock AI)
The application runs fully without any IBM Cloud credentials. All AI responses are generated by `MockAIProvider` — realistic, deterministic mock responses.

### IBM Granite Mode
1. Get IBM Cloud API Key from [IBM Cloud Console](https://cloud.ibm.com)
2. Create a WatsonX project and note the Project ID
3. Set in `.env`:
```env
VITE_AI_PROVIDER=granite
IBM_CLOUD_API_KEY=your_api_key_here
IBM_CLOUD_PROJECT_ID=your_project_id_here
IBM_GRANITE_ENDPOINT=https://us-south.ml.cloud.ibm.com
IBM_GRANITE_MODEL=ibm/granite-13b-chat-v2
```
4. Run the backend (`cd server && npm run dev`)
5. The frontend will now proxy AI requests through the backend to IBM Granite

> **Security:** IBM credentials are NEVER sent to the frontend. All Granite API calls happen on the server side only.

---

## 📋 Demo Flows

### Flow 1: Segregation Non-Compliance → Citizen Nudge
1. Login as **Municipal Officer**
2. Navigate to **Segregation Compliance**
3. Click **"Analyze Compliance"** — AI identifies high-risk wards
4. Click **"Nudge"** for Ward 19 — select Gujarati
5. Preview the Gujarati message → Send

### Flow 2: Route Optimization
1. Login as **Municipal Officer**
2. Navigate to **Route Optimization**
3. Select vehicles → Click **"Optimize Routes with AI"**
4. View distance/time/fuel savings breakdown

### Flow 3: Citizen Grievance (Multilingual)
1. Login as **Citizen**
2. Navigate to **Report Grievance**
3. Select **ગુજરાતી** → Write: "ત્રણ દિવસથી ગાડી આવી નથી"
4. Submit → AI auto-classifies as "Missed Collection, High Priority"

### Flow 4: Officer Resolves Grievance
1. Login as **Municipal Officer** → Grievances
2. View AI-classified grievance → Click **"Route"** (AI assigns dept)
3. Update status to "In Progress" → "Resolved"

### Flow 5: Ward AI Report
1. Login as **Municipal Officer** → Ward Analytics
2. Select **Ward 12** → Click **"Generate Ward AI Report"**
3. Read AI-generated insights, trends, and recommendations

---

## 🗺️ Application Pages

**Officer (8 pages):**
- Dashboard — KPI overview, alerts, AI recommendations
- Live Map — Vehicle tracking on OpenStreetMap
- Route Optimization — AI route optimization with comparison table
- Segregation Compliance — Charts, ward table, nudge system
- Grievance Management — Full CRUD with AI routing
- Ward Analytics — Deep analytics + AI report generation
- AI Agent Center — 5 agent cards + workflow visualization
- Alerts — All system alerts and AI recommendations

**Citizen (5 pages):**
- Dashboard — Summary, schedule, grievance status
- Report Grievance — Multilingual form with AI analysis
- My Grievances — Status tracker with timeline
- Segregation Guide — Visual guide in 3 languages
- Collection Schedule — Weekly timetable

**Common (2 pages):**
- Notifications — Unified notification center
- Profile/Settings — Language preference, account info

---

## 🔮 Future Improvements

1. **Real IBM Granite integration** with production WatsonX credentials
2. **PostgreSQL database** — Replace in-memory data with persistent storage
3. **WebSocket real-time updates** — Live vehicle tracking
4. **SMS gateway integration** — Actual citizen nudge delivery (e.g., MSG91)
5. **Computer vision** — Image analysis for grievance photos
6. **Mobile app** — React Native citizen app
7. **Predictive analytics** — Waste generation forecasting
8. **Multi-city support** — Scale beyond single municipal corporation
9. **IoT integration** — Smart bin sensor data
10. **Offline-first PWA** — Works in low-connectivity areas

---

## 📄 License

MIT License — Built as a hackathon/college project prototype.

---

## 🏆 Built With

- **IBM Bob** — AI-powered development environment
- **IBM Granite LLM** — Foundation AI model (IBM Cloud WatsonX)
- **React + TypeScript** — Frontend framework
- **Tailwind CSS** — Utility-first CSS
- **Node.js + Express** — Backend API
- **Leaflet + OpenStreetMap** — Free, open-source maps
- **Recharts** — Data visualization

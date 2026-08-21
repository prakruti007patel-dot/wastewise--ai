# WasteWise AI — Agent Documentation

## Overview

WasteWise AI deploys five specialized AI agents that collaborate to manage municipal solid waste operations. Each agent is implemented as a service function backed by IBM Granite LLM (or Mock AI in demo mode).

---

## Agent 1: Route Optimization Agent

**Purpose:** Dynamically optimize waste collection routes across the municipal vehicle fleet.

**Inputs:**
- Vehicle locations (GPS coordinates)
- Assigned ward
- Current load vs. capacity
- Collection points with waste estimates
- Traffic conditions (simulated)
- Fuel level

**Processing:**
1. Identifies vehicles approaching capacity
2. Calculates current route distance using collection point order
3. Applies nearest-neighbor heuristic with priority weighting
4. Considers traffic windows (7-9 AM rush)
5. Reorders collection points to minimize backtracking

**Outputs:**
- Optimized collection point order per vehicle
- Distance saved (km)
- Time saved (minutes)
- Fuel saved (liters)
- List of reasoning factors

**IBM Granite Prompt Design:**
```
Analyze vehicle routes and optimize for minimum distance and time.
Input: vehicle positions, collection points, waste volumes.
Output JSON: {vehicleId, originalRoute, optimizedRoute, savings}
```

---

## Agent 2: Segregation Compliance Tracking Agent

**Purpose:** Monitor household-level and ward-level waste segregation compliance. Identify risk areas and trigger citizen communication.

**Inputs:**
- Per-ward household compliance data
- 7-day compliance trend
- Mixed waste percentages
- Wet/dry/hazardous ratios

**Processing:**
1. Computes ward compliance percentage from household data
2. Detects declining trend (>5% drop in 7 days = high risk)
3. Identifies wards with mixed waste percentage >35%
4. Cross-references with grievance data (segregation complaints)
5. Generates prioritized intervention list

**Outputs:**
- Risk ward list (ranked)
- Per-ward intervention reasoning
- Nudge message in EN/GU/HI
- Overall trend direction

**IBM Granite Prompt Design:**
```
Analyze waste segregation compliance for these wards.
Identify declining trends and suggest citizen outreach messages.
Generate Gujarati/Hindi/English nudge messages.
```

---

## Agent 3: Grievance Intake Agent

**Purpose:** Accept citizen complaints in natural language (English, Gujarati, Hindi). Automatically detect language, classify category, and assess priority.

**Inputs:**
- Raw citizen text (any of 3 languages)
- Optional: location, ward selection

**Processing:**
1. Unicode character range detection (Gujarati: U+0A80–U+0AFF, Hindi: U+0900–U+097F)
2. Keyword pattern matching for category classification
3. Context-based priority assessment (repeated complaint, keywords like "3 days", "health hazard")
4. Location extraction (if provided)
5. Summary generation

**Outputs:**
- Category (8 possible categories)
- Priority (low/medium/high/critical)
- Language detected
- Ward mapping
- Suggested department
- AI summary
- Confidence score
- Reasoning factors (displayed in UI)

**Supported Categories:**
1. Missed Collection
2. Mixed Waste Collection
3. Overflowing Garbage
4. Illegal Dumping
5. Vehicle Issue
6. Segregation Issue
7. Sanitation Issue
8. Other

**IBM Granite Prompt Design:**
```
You are a municipal waste management AI for Gujarat, India.
Analyze this citizen grievance (may be in Gujarati, Hindi, or English).
Extract: category, priority, language, ward, department assignment.
Return structured JSON with reasoning.
```

---

## Agent 4: Municipal Routing Agent

**Purpose:** Route classified grievances to the correct municipal department. Assign responsible officer and set SLA based on priority.

**Inputs:**
- Classified grievance (category, priority, wardId)
- Grievance description

**Processing:**
1. Maps category → department using rule-based logic
2. Looks up ward-specific officer assignments
3. Calculates SLA based on category priority:
   - Critical: 12 hours
   - High: 24 hours
   - Medium: 48 hours
   - Low: 72 hours
4. Generates routing decision with reasoning factors
5. Returns concise decision summary (no chain-of-thought exposed)

**Outputs:**
- Assigned department
- Assigned officer name + email
- SLA in hours
- 3-5 reasoning factors (human-readable)

**Department → Category Mapping:**
| Category | Department |
|----------|-----------|
| missed_collection | Solid Waste Collection |
| overflowing_garbage | Solid Waste Collection |
| illegal_dumping | Illegal Dumping Enforcement |
| vehicle_issue | Vehicle Maintenance |
| sanitation | Sanitation |
| other | Citizen Services |

---

## Agent 5: Ward Analytics Dashboard Agent

**Purpose:** Generate comprehensive ward-level intelligence reports. Identify trends, flag risks, and recommend actionable interventions.

**Inputs:**
- 30-day time series data (waste generation, compliance, collection, grievances)
- Current KPIs (collection %, compliance %, open grievances, vehicles)
- Risk classification

**Processing:**
1. Analyzes trend direction for each metric
2. Identifies anomalies (sharp drops, spikes)
3. Cross-correlates compliance vs. collection vs. grievance patterns
4. Classifies overall ward risk (low/medium/high)
5. Generates prioritized action recommendations

**Outputs:**
- Current status summary
- Major issues list
- Trend analysis (per metric)
- Risk areas
- Recommended actions (5-6 specific actions)
- Expected impact statement
- Generated timestamp

**IBM Granite Prompt Design:**
```
Generate a comprehensive waste management report for Ward {id}.
Data: collection rate, compliance %, grievances, waste volume trends.
Output: status, issues, trends, recommendations, expected impact.
Format as structured JSON.
```

---

## Agent Collaboration

```
                    ┌─────────────────────────────────────────┐
                    │           WASTEWISE AI SYSTEM            │
                    └─────────────────────────────────────────┘
                              │              │
                ┌─────────────┘              └─────────────┐
                ▼                                          ▼
    ┌──────────────────────┐              ┌──────────────────────────┐
    │    GRIEVANCE FLOW    │              │    OPERATIONS FLOW        │
    │                      │              │                            │
    │  Citizen Input (text)│              │  GPS + Load Data           │
    │         ▼            │              │          ▼                 │
    │  Grievance Intake    │              │  Route Optimization        │
    │    Agent             │              │    Agent                   │
    │  (classify, priority)│              │  (optimize paths)          │
    │         ▼            │              │          ▼                 │
    │  Municipal Routing   │              │  Dispatch optimized routes │
    │    Agent             │              │                            │
    │  (assign dept/SLA)   │              │  Segregation Data          │
    │         ▼            │              │          ▼                 │
    │  Department Action   │              │  Compliance Agent          │
    │         ▼            │              │  (risk wards + nudges)     │
    │  Resolution          │              │          ▼                 │
    │         ▼            │              │  Citizen Nudges Sent       │
    │  Ward Analytics      │              │          ▼                 │
    │    Agent (track)     │              │  Ward Analytics            │
    └──────────────────────┘              └──────────────────────────┘
```

All five agents feed data into the Ward Analytics Agent, which provides officers with a unified view of ward performance.

# WasteWise AI — API Documentation

## Base URL
`http://localhost:3001/api`

## Authentication
No authentication required for demo mode. Production deployment would use IBM App ID or similar.

---

## Health Check

### GET /api/health
Returns server status and AI provider mode.

**Response:**
```json
{
  "status": "ok",
  "service": "WasteWise AI API",
  "version": "1.0.0",
  "aiProvider": "Mock AI (Demo Mode)",
  "timestamp": "2026-01-22T10:00:00.000Z"
}
```

---

## Wards

### GET /api/wards
Returns all 24 wards with KPIs.

### GET /api/wards/:id
Returns a single ward by ID.

---

## Vehicles

### GET /api/vehicles
Returns all vehicles with live status.

---

## Grievances

### GET /api/grievances
Returns all grievances.

**Query params:** `wardId`, `status`, `priority`

### POST /api/grievances
Submit a new grievance.

**Request body:**
```json
{
  "citizenName": "Ramila Ben Patel",
  "citizenPhone": "9898010001",
  "wardId": 12,
  "category": "missed_collection",
  "description": "ત્રણ દિવસથી ગાડી આવી નથી.",
  "language": "gu",
  "location": "Isanpur Road"
}
```

**Response:**
```json
{
  "id": "GRV-2026-00124",
  "status": "submitted",
  "wardId": 12,
  "createdAt": "2026-01-22T10:00:00.000Z"
}
```

### PATCH /api/grievances/:id
Update grievance status.

**Request body:**
```json
{
  "status": "in_progress",
  "assignedOfficer": "Inspector Deepak Chauhan"
}
```

---

## Analytics

### GET /api/analytics/wards/:id
Returns 30-day analytics for a ward.

---

## AI Endpoints (Granite Proxy)

### POST /api/ai/analyze-grievance
Analyze and classify a citizen grievance.

**Request:**
```json
{
  "text": "ત્રણ દિવસથી ગાડી આવી નથી",
  "language": "gu",
  "wardId": 12,
  "location": "Isanpur Road"
}
```

**Response:**
```json
{
  "category": "missed_collection",
  "categoryLabel": "Missed Collection",
  "priority": "high",
  "language": "gu",
  "wardId": 12,
  "department": "Solid Waste Collection",
  "summary": "...",
  "confidence": 0.94,
  "reasoningFactors": ["..."],
  "suggestedActions": ["..."]
}
```

### POST /api/ai/optimize-routes
Optimize collection routes for given vehicles.

**Request:**
```json
{
  "vehicleIds": ["GJ-01-AB-1234", "GJ-01-AB-1235"],
  "considerTraffic": true
}
```

### POST /api/ai/analyze-compliance
Analyze ward segregation compliance.

**Request:**
```json
{
  "wardIds": [12, 19, 7]
}
```

### POST /api/ai/ward-report
Generate AI report for a ward.

**Request:**
```json
{
  "wardId": 12
}
```

### POST /api/ai/citizen-nudge
Generate targeted citizen nudge message.

**Request:**
```json
{
  "wardId": 19,
  "language": "gu",
  "messageType": "segregation"
}
```

**Response:**
```json
{
  "message": "કૃપા કરીને ભીનો અને સૂકો કચરો અલગ કરો.",
  "wardId": 19,
  "messageType": "segregation"
}
```

### POST /api/ai/classify-routing
Route a grievance to the correct department.

**Request:**
```json
{
  "category": "missed_collection",
  "priority": "high",
  "wardId": 12,
  "description": "..."
}
```

**Response:**
```json
{
  "department": "Solid Waste Collection",
  "officer": "Inspector Deepak Chauhan",
  "slaHours": 24,
  "reasoningFactors": ["Matched category: Missed Collection", "Ward 12 mapped", "SLA 24h for high priority"]
}
```

---

## Error Responses

All errors return:
```json
{
  "error": "Error type",
  "message": "Human-readable description"
}
```

HTTP status codes:
- `400` — Bad request / validation error
- `404` — Resource not found
- `500` — Internal server error

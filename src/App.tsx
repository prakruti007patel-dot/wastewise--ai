import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';

// Layouts
import { AppLayout } from './layouts/AppLayout';

// Public pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';

// Officer pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import LiveMapPage from './pages/officer/LiveMap';
import RouteOptimizationPage from './pages/officer/RouteOptimization';
import SegregationCompliancePage from './pages/officer/SegregationCompliance';
import GrievanceManagementPage from './pages/officer/GrievanceManagement';
import WardAnalyticsPage from './pages/officer/WardAnalytics';
import AIAgentCenterPage from './pages/officer/AIAgentCenter';
import AlertsPage from './pages/officer/AlertsPage';

// Citizen pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportGrievancePage from './pages/citizen/ReportGrievance';
import MyGrievancesPage from './pages/citizen/MyGrievances';
import SegregationGuidePage from './pages/citizen/SegregationGuide';
import CollectionSchedulePage from './pages/citizen/CollectionSchedule';

// Common pages
import NotificationsPage from './pages/common/Notifications';
import ProfilePage from './pages/common/Profile';

// Guard for authenticated routes
const RequireAuth = ({ children, role }: { children: React.ReactNode; role?: 'officer' | 'citizen' }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'officer' ? '/officer/dashboard' : '/citizen/dashboard'} replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Officer routes */}
      <Route path="/officer" element={<RequireAuth role="officer"><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/officer/dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="live-map" element={<LiveMapPage />} />
        <Route path="route-optimization" element={<RouteOptimizationPage />} />
        <Route path="segregation" element={<SegregationCompliancePage />} />
        <Route path="grievances" element={<GrievanceManagementPage />} />
        <Route path="ward-analytics" element={<WardAnalyticsPage />} />
        <Route path="agents" element={<AIAgentCenterPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Citizen routes */}
      <Route path="/citizen" element={<RequireAuth role="citizen"><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/citizen/dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="report-grievance" element={<ReportGrievancePage />} />
        <Route path="my-grievances" element={<MyGrievancesPage />} />
        <Route path="segregation-guide" element={<SegregationGuidePage />} />
        <Route path="schedule" element={<CollectionSchedulePage />} />
      </Route>

      {/* Common routes (accessible from both roles) */}
      <Route path="/notifications" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<NotificationsPage />} />
      </Route>
      <Route path="/profile" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'officer' ? '/officer/dashboard' : '/citizen/dashboard'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

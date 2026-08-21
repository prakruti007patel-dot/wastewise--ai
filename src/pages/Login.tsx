import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, User, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam === 'officer' || roleParam === 'citizen') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'officer' ? '/officer/dashboard' : '/citizen/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate auth
    login(selectedRole);
    setLoading(false);
  };

  const demoAccounts = [
    {
      role: 'officer' as UserRole,
      name: 'Rajesh Kumar Sharma',
      email: 'rajesh.sharma@gmcorp.gov',
      designation: 'Ward Health Officer',
      icon: <Shield className="w-5 h-5" />,
      color: 'green',
      description: 'Access full municipal operations dashboard, route optimization, grievance management, and AI agent center.',
    },
    {
      role: 'citizen' as UserRole,
      name: 'Meena Patel',
      email: 'meena.patel@example.com',
      designation: 'Citizen — Ward 12',
      icon: <User className="w-5 h-5" />,
      color: 'blue',
      description: 'Report grievances in Gujarati/Hindi/English, track status, view segregation guide, and collection schedule.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-green-600 flex items-center justify-center mb-4 shadow-lg">
          <Trash2 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">WasteWise AI</h1>
        <p className="text-gray-500 text-sm mt-1">Municipal Solid Waste Management Platform</p>
      </div>

      {/* Login card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Demo Login</h2>
          <p className="text-sm text-gray-500 mt-1">Select a demo account to explore the platform</p>
        </div>

        {/* Demo accounts */}
        <div className="space-y-3 mb-6">
          {demoAccounts.map(account => (
            <button
              key={account.role}
              onClick={() => setSelectedRole(account.role)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedRole === account.role
                  ? account.color === 'green' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${account.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{account.name}</p>
                    {selectedRole === account.role && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${account.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{account.designation}</p>
                  <p className="text-xs text-gray-400 mt-1">{account.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Logging in...
            </>
          ) : (
            <>Enter as {selectedRole === 'officer' ? 'Municipal Officer' : 'Citizen'} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
          <p className="text-xs text-yellow-700">⚠ <strong>Demo Mode:</strong> This is a prototype using fictional data. No real authentication is required.</p>
        </div>
      </div>

      <a href="/" className="mt-6 text-sm text-gray-400 hover:text-gray-600">← Back to home</a>
    </div>
  );
}

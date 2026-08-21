import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Route, Recycle, MessageSquare, BarChart3,
  Bot, Bell, Settings, LogOut, Users, Menu, X, ChevronLeft,
  Trash2, ClipboardList, BookOpen, Calendar, User, AlertTriangle, GitBranch,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const officerNavItems: NavItem[] = [
  { path: '/officer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/officer/live-map', label: 'Live Map', icon: <Map className="w-4 h-4" /> },
  { path: '/officer/route-optimization', label: 'Route Optimization', icon: <Route className="w-4 h-4" /> },
  { path: '/officer/segregation', label: 'Segregation Compliance', icon: <Recycle className="w-4 h-4" /> },
  { path: '/officer/grievances', label: 'Grievances', icon: <MessageSquare className="w-4 h-4" />, badge: 5 },
  { path: '/officer/ward-analytics', label: 'Ward Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { path: '/officer/agents', label: 'AI Agent Center', icon: <Bot className="w-4 h-4" /> },
  { path: '/officer/alerts', label: 'Alerts & Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: 6 },
];

const citizenNavItems: NavItem[] = [
  { path: '/citizen/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/citizen/report-grievance', label: 'Report Grievance', icon: <ClipboardList className="w-4 h-4" /> },
  { path: '/citizen/my-grievances', label: 'My Grievances', icon: <MessageSquare className="w-4 h-4" /> },
  { path: '/citizen/segregation-guide', label: 'Segregation Guide', icon: <BookOpen className="w-4 h-4" /> },
  { path: '/citizen/schedule', label: 'Collection Schedule', icon: <Calendar className="w-4 h-4" /> },
];

const commonNavItems: NavItem[] = [
  { path: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: 3 },
  { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NavLink = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group',
        isActive
          ? 'bg-green-50 text-green-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {item.badge != null && item.badge > 0 && (
        <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white', collapsed ? 'absolute -top-1 -right-1 text-[10px]' : 'ml-auto')}>
          {item.badge}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
};

const SidebarContent = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'officer' ? officerNavItems : citizenNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 px-4 py-4 border-b border-gray-100', collapsed && 'justify-center')}>
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
          <Trash2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">WasteWise AI</p>
            <p className="text-[10px] text-gray-400">Municipal Operations</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={clsx('ml-auto text-gray-400 hover:text-gray-600 rounded p-0.5', collapsed && 'ml-0')}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={clsx('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user.role === 'officer' ? 'Municipal Officer' : 'Citizen'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            {user?.role === 'officer' ? 'Municipal Operations' : 'Citizen Services'}
          </p>
        )}
        {navItems.map(item => <NavLink key={item.path} item={item} collapsed={collapsed} />)}

        {!collapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mt-4 mb-2">Account</p>}
        <div className={clsx(!collapsed && 'mt-2')}>
          {commonNavItems.map(item => <NavLink key={item.path} item={item} collapsed={collapsed} />)}
        </div>
      </nav>

      {/* Bottom: Demo note + Logout */}
      <div className="px-3 py-3 border-t border-gray-100">
        {!collapsed && (
          <div className="mb-2 px-2 py-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-[10px] text-yellow-700 font-medium">⚠ Demo Mode — Mock Data</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-200 flex-shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <SidebarContent collapsed={false} onToggle={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
};

// Top header bar
export const TopBar = ({ onMobileMenuClick }: { onMobileMenuClick: () => void }) => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:block">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">
              {user?.role === 'officer' ? 'Municipal Officer Dashboard' : 'Citizen Portal'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as 'en' | 'gu' | 'hi')}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Language"
        >
          <option value="en">EN</option>
          <option value="gu">ગુ</option>
          <option value="hi">हि</option>
        </select>
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
          {user?.name.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};

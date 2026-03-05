import { useAuthStore } from '@/store/authStore';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ListOrdered, AlertTriangle, Upload, ChevronLeft, ChevronRight, Scale,
  TrendingUp, Calendar, Download,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['registrar', 'junior_judge', 'senior_judge', 'admin'] },
  { label: 'Priority Queue', path: '/priority', icon: ListOrdered, roles: ['registrar', 'junior_judge', 'senior_judge'] },
  { label: 'Delay Patterns', path: '/delay-patterns', icon: TrendingUp, roles: ['registrar', 'senior_judge'] },
  { label: 'Escalation Watch', path: '/escalation', icon: AlertTriangle, roles: ['registrar'] },
  { label: 'Calendar / Schedule', path: '/calendar', icon: Calendar, roles: ['registrar', 'junior_judge', 'senior_judge'] },
  { label: 'Upload New Data', path: '/upload', icon: Upload, roles: ['admin', 'registrar'] },
  { label: 'Export Current View', path: '/export', icon: Download, roles: ['registrar', 'junior_judge', 'senior_judge', 'admin'] },
];

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = NAV_ITEMS.filter((item) => role && item.roles.includes(role));

  return (
    <aside
      className={`h-full bg-card border-r border-border flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <Scale className="w-6 h-6 text-primary shrink-0" />
        {!collapsed && <span className="font-bold text-foreground text-lg">JustAI</span>}
      </div>

      <nav className="flex-1 py-3 space-y-1 px-2">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}

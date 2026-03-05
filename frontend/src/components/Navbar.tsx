import { useAuthStore, ROLE_LABELS } from '@/store/authStore';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { userName, role, logout } = useAuthStore();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Welcome, <span className="font-medium text-foreground">{userName}</span>
        </span>
        {role && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
            {ROLE_LABELS[role]}
          </span>
        )}
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}

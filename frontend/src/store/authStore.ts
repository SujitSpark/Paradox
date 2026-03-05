import { create } from 'zustand';

export type UserRole =
  | 'registrar'
  | 'junior_judge'
  | 'senior_judge'
  | 'admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  registrar: 'Court Registrar / Administrative Officer',
  junior_judge: 'Junior Judge / Link Judge',
  senior_judge: 'Senior Judge / Principal District Judge',
  admin: 'System Administrator (Court IT)',
};

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  role: UserRole | null;
  login: (userName: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const stored = localStorage.getItem('justai_auth');
  const initial = stored ? JSON.parse(stored) : null;

  return {
    isAuthenticated: !!initial,
    userName: initial?.userName || '',
    role: initial?.role || null,
    login: (userName, role) => {
      localStorage.setItem('justai_auth', JSON.stringify({ userName, role }));
      set({ isAuthenticated: true, userName, role });
    },
    logout: () => {
      localStorage.removeItem('justai_auth');
      set({ isAuthenticated: false, userName: '', role: null });
    },
  };
});

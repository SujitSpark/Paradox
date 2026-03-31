import { Bell, Search, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCasesStore } from '../store/casesStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { searchQuery, setSearchQuery } = useCasesStore();
  const showSearch = location.pathname === '/all-cases';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <header className="h-16 bg-surface/85 backdrop-blur-md border-b border-outline-variant/10 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex-1 flex items-center gap-4 group">
        {showSearch ? (
          <>
            <label htmlFor="search" className="cursor-pointer group-hover:scale-110 transition-transform">
              <Search className="text-on-surface/30 w-5 h-5 group-focus-within:text-primary" />
            </label>
            <input 
              id="search"
              type="text" 
              placeholder="Search for cases, parties, or petitions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-sans text-sm w-full placeholder:text-on-surface/30 text-on-surface transition-all placeholder:font-medium focus:scale-[1.01]"
            />
          </>
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="flex items-center gap-6 pr-2">
        <div className="relative group cursor-pointer p-2 rounded-full hover:bg-surface-container-low transition-colors">
          <Bell className="w-5 h-5 text-on-surface/40 group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-tertiary rounded-full border border-surface shadow-sm" />
        </div>
        
        <div className="h-4 w-[1px] bg-outline-variant/20 mx-1" />
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 group p-1.5 rounded-sm hover:bg-red-50 text-on-surface/40 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] font-sans uppercase font-bold tracking-[0.1em]">Sign Out</span>
        </button>

      </div>
    </header>
  );
}

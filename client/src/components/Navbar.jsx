import { useLocation } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/publish': 'Publish',
  '/accounts': 'Connected Accounts',
  '/settings': 'Settings',
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-border p-2 text-muted hover:bg-bg hover:text-white md:hidden transition-colors"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
      </div>

      {user && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg px-3 py-1.5 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User size={14} />
          </div>
          <span className="text-xs font-semibold text-white max-w-[140px] truncate">
            {user.name}
          </span>
        </div>
      )}
    </header>
  );
};

export default Navbar;

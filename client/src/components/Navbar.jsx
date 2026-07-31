import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/publish': 'Publish',
  '/accounts': 'Connected Accounts',
  '/settings': 'Settings',
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const title = pageTitles[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between bg-bg px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-border bg-card p-2 text-muted transition-colors hover:text-white md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="mb-1 hidden text-xs text-muted sm:block">Workspace <span className="px-1 text-border">/</span> {title}</p>
          <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        </div>
      </div>

      {user && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className="flex items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-card"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              {(user.name || 'U').slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden max-w-[140px] text-xs font-semibold text-white sm:block sm:truncate">{user.name}</span>
            <ChevronDown size={15} className={`hidden text-muted transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-xl border border-border bg-card p-1.5 shadow-sm" role="menu">
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-bg hover:text-white"
                role="menuitem"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Users,
  Settings,
  LogOut,
  X,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/publish', label: 'Publish', icon: Send },
  { to: '/accounts', label: 'Accounts', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg/90 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-border bg-card transition-[width,transform] duration-200 md:static md:translate-x-0 ${
          isCollapsed ? 'md:w-[72px]' : 'md:w-60'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex h-20 items-center border-b border-border ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'}`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Share2 size={16} />
            </div>
            <div className={isCollapsed ? 'md:hidden' : ''}>
              <h1 className="text-sm font-bold tracking-tight text-white">
                Publisher
              </h1>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggle}
              className="hidden rounded-lg p-2 text-muted transition-colors hover:bg-bg hover:text-white md:inline-flex"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-bg hover:text-white md:hidden"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6" aria-label="Primary navigation">
          <p className={`px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted ${isCollapsed ? 'md:hidden' : ''}`}>
            Workspace
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  isCollapsed ? 'md:justify-center' : ''
                } ${
                  isActive
                    ? 'bg-bg text-white'
                    : 'text-muted hover:bg-bg hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive ? 'text-primary' : 'text-muted group-hover:text-white'
                    }`}
                  />
                  <span className={isCollapsed ? 'md:hidden' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-2 ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg text-xs font-bold text-primary">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className={`min-w-0 ${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="truncate text-xs font-semibold text-white">{user?.name || 'User'}</p>
              <p className="truncate text-[11px] text-muted">Signed in</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-bg hover:text-white ${isCollapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={18} />
            <span className={isCollapsed ? 'md:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

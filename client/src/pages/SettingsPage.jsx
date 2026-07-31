import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import { LogOut, User, Mail } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage profile information and user session.
        </p>
      </div>

      {/* User Profile */}
      <Card className="p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-white tracking-tight border-b border-border pb-3">
          User Profile
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3.5 rounded-xl border border-border bg-bg p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Name</p>
              <p className="text-sm font-semibold text-white truncate mt-0.5">
                {user?.name || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border bg-bg p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-white truncate mt-0.5">
                {user?.email || '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Session */}
      <Card className="p-6 md:p-8 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight border-b border-border pb-3">
          Session
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Sign Out</p>
            <p className="text-xs text-muted mt-0.5">
              Log out of your internal session on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-bg px-5 py-2.5 text-sm font-semibold text-muted transition-all hover:border-primary/40 hover:text-white"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

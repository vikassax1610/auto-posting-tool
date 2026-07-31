import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import { LogOut, User, Mail, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="border-b border-border pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Workspace preferences</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-2 text-sm text-muted">Review your profile, session security, and the publishing defaults for this workspace.</p>
      </div>

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-primary">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Profile</h2>
            <p className="mt-1 text-sm text-muted">The identity associated with this workspace session.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center gap-2 text-muted">
              <User size={15} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Name</span>
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-white">{user?.name || '—'}</p>
          </div>
          <div className="rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center gap-2 text-muted">
              <Mail size={15} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Email</span>
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-white">{user?.email || '—'}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-primary">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Security</h2>
            <p className="mt-1 text-sm text-muted">Keep your account and active workspace session protected.</p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-bg">
          <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Password protection</h3>
              <p className="mt-1 text-sm text-muted">Your account is secured with the password you set during registration.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Enabled
            </span>
          </div>
          <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Active session</h3>
              <p className="mt-1 text-sm text-muted">You are currently signed in on this device.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Current session
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-primary">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Application preferences</h2>
            <p className="mt-1 text-sm text-muted">The currently active publishing behavior for your workspace.</p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-bg">
          <div className="flex items-center justify-between gap-5 px-4 py-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Publishing results</h3>
              <p className="mt-1 text-sm text-muted">Show a delivery result for every selected platform after publishing.</p>
            </div>
            <span className="h-5 w-9 shrink-0 rounded-full bg-primary p-0.5" aria-label="Enabled">
              <span className="block h-4 w-4 translate-x-4 rounded-full bg-white" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-5 px-4 py-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Media validation</h3>
              <p className="mt-1 text-sm text-muted">Require a supported image or video attachment before publishing.</p>
            </div>
            <span className="h-5 w-9 shrink-0 rounded-full bg-primary p-0.5" aria-label="Enabled">
              <span className="block h-4 w-4 translate-x-4 rounded-full bg-white" />
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-error/40 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Sign out of this device</h2>
            <p className="mt-1 text-sm leading-6 text-muted">End this session and return to the workspace sign-in screen.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-error/60 px-4 text-sm font-semibold text-error transition-colors hover:bg-error hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

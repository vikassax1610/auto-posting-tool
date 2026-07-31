import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, Unlink, CheckCircle, RefreshCw } from 'lucide-react';
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from '../components/icons/PlatformIcons.jsx';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import {
  getAccounts,
  connectAccount,
  disconnectAccount,
} from '../services/account.service.js';

const platformCards = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Publish updates to a profile or company page.',
    icon: LinkedInIcon,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Publish posts to your connected Facebook page.',
    icon: FacebookIcon,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Share image and video posts to Instagram Business.',
    icon: InstagramIcon,
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    description: 'Create media pins on your connected Pinterest board.',
    icon: PinterestIcon,
  },
];

const AccountsPage = () => {
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await getAccounts();
      setAccounts(data.connectedAccounts || {});
    } catch {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform) => {
    setActionLoading(platform);
    try {
      await connectAccount(platform);
      toast.success(`${platform} connected successfully`);
      await fetchAccounts();
    } catch {
      toast.error(`Failed to connect ${platform}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (platform) => {
    setActionLoading(platform);
    try {
      await disconnectAccount(platform);
      toast.success(`${platform} disconnected`);
      await fetchAccounts();
    } catch {
      toast.error(`Failed to disconnect ${platform}`);
    } finally {
      setActionLoading(null);
    }
  };

  const connectedCount = Object.values(accounts).filter((account) => account?.connected).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Integrations</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Connected accounts</h1>
          <p className="mt-2 text-sm text-muted">Manage the social accounts available for publishing in this workspace.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <span className={`h-2 w-2 rounded-full ${connectedCount ? 'bg-success' : 'bg-muted'}`} />
          <span className="text-sm font-semibold text-white">{loading ? 'Checking connections' : `${connectedCount} of ${platformCards.length} connected`}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {platformCards.map(({ id }) => (
            <Card key={id} className="min-h-[266px] p-6">
              <div className="flex items-start justify-between">
                <span className="h-12 w-12 rounded-xl bg-bg" />
                <span className="h-7 w-24 rounded-full bg-bg" />
              </div>
              <span className="mt-8 block h-5 w-28 rounded bg-bg" />
              <span className="mt-3 block h-4 w-4/5 rounded bg-bg" />
              <span className="mt-8 block h-11 w-36 rounded-xl bg-bg" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {platformCards.map(({ id, label, description, icon: Icon }) => {
            const account = accounts[id] || {};
            const isConnected = account.connected;
            const isLoading = actionLoading === id;
            const connectionName = account.accountName || `${label} account`;
            const buttonLabel = account.accountName ? 'Reconnect account' : 'Connect account';

            return (
              <Card key={id} hover className="flex min-h-[266px] flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                    <Icon size={23} />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${isConnected ? 'border-success/40 bg-success/10 text-success' : 'border-border bg-bg text-muted'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-success' : 'bg-muted'}`} />
                    {isConnected ? 'Connected' : 'Not connected'}
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold tracking-tight text-white">{label}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-bg px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Account information</p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{isConnected ? connectionName : 'No account connected'}</p>
                  <p className="mt-1 truncate text-xs text-muted">{isConnected && account.accountId ? `ID: ${account.accountId}` : 'Connection required before publishing'}</p>
                </div>

                <div className="mt-auto pt-5">
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => handleDisconnect(id)}
                      disabled={isLoading}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted transition-colors hover:border-error/60 hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? <Loader size="sm" /> : <Unlink size={16} />}
                      Disconnect account
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(id)}
                      disabled={isLoading}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? <Loader size="sm" /> : account.accountName ? <RefreshCw size={16} /> : <Link size={16} />}
                      {buttonLabel}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && connectedCount === 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <CheckCircle size={18} className="mt-0.5 shrink-0 text-warning" />
          <div>
            <h2 className="text-sm font-semibold text-white">Connect an account to begin publishing</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Your posts will only be sent to channels that you explicitly connect here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;

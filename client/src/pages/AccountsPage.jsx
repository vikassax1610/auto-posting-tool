import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, Unlink } from 'lucide-react';
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
    description: 'Publish updates to profile or company page',
    icon: LinkedInIcon,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Publish posts to Facebook page',
    icon: FacebookIcon,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Share photos and videos to Instagram Business',
    icon: InstagramIcon,
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    description: 'Create and pin media to Pinterest boards',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Connected Accounts
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage integrations and connections for each social platform.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {platformCards.map(({ id, label, description, icon: Icon }) => {
          const account = accounts[id] || {};
          const isConnected = account.connected;
          const isLoading = actionLoading === id;

          return (
            <Card key={id} hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg border border-border text-primary">
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">{label}</h3>
                    <div className="flex items-center gap-2 rounded-full border border-border bg-bg px-2.5 py-1">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isConnected ? 'bg-primary' : 'bg-muted/40'
                        }`}
                      />
                      <span className="text-[11px] font-medium text-muted">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-muted leading-relaxed">{description}</p>

                  <div className="mt-5">
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnect(id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-2 text-xs font-semibold text-muted transition-all hover:border-primary/40 hover:text-white disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader size="sm" />
                        ) : (
                          <Unlink size={14} />
                        )}
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader size="sm" />
                        ) : (
                          <Link size={14} />
                        )}
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsPage;

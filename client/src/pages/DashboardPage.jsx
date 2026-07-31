import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Users,
  CheckCircle,
  Activity,
  XCircle,
  ArrowRight,
  Image as ImageIcon,
  Film,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import { getPublishHistory } from '../services/publish.service.js';
import { getAccounts } from '../services/account.service.js';
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from '../components/icons/PlatformIcons.jsx';

const platformMeta = [
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { id: 'pinterest', label: 'Pinterest', icon: PinterestIcon },
];

const platformNames = Object.fromEntries(platformMeta.map(({ id, label }) => [id, label]));

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPublished: 0,
    successCount: 0,
    failedCount: 0,
    connectedCount: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const [historyResult, accountsResult] = await Promise.allSettled([
        getPublishHistory(),
        getAccounts(),
      ]);

      let historyLogs = [];
      let connectedAccounts = {};

      if (historyResult.status === 'fulfilled') {
        historyLogs = historyResult.value.data.logs || [];
        setLogs(historyLogs);
      }

      if (accountsResult.status === 'fulfilled') {
        connectedAccounts = accountsResult.value.data.connectedAccounts || {};
        setAccounts(connectedAccounts);
      }

      let successCount = 0;
      let failedCount = 0;
      historyLogs.forEach((log) => {
        Object.values(log.platforms || {}).forEach((platform) => {
          if (platform.status === 'success') successCount += 1;
          if (platform.status === 'failed') failedCount += 1;
        });
      });

      setStats({
        totalPublished: historyLogs.length,
        successCount,
        failedCount,
        connectedCount: Object.values(connectedAccounts).filter((account) => account?.connected).length,
      });
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'Posts published', value: stats.totalPublished, icon: Activity, color: 'text-primary' },
    { label: 'Successful delivery', value: stats.successCount, icon: CheckCircle, color: 'text-success' },
    { label: 'Needs attention', value: stats.failedCount, icon: XCircle, color: 'text-error' },
    { label: 'Connected accounts', value: stats.connectedCount, icon: Users, color: 'text-warning' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="mt-2 text-sm text-muted">Track your social publishing activity and keep every channel ready to go.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/publish')}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99]"
        >
          <Send size={16} />
          Create post
        </button>
      </div>

      <section aria-label="Publishing statistics">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Publishing at a glance</h2>
            <p className="mt-1 text-sm text-muted">Live totals from your recent publishing history.</p>
          </div>
          {loading && <span className="text-xs text-muted">Loading metrics...</span>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} hover className="min-h-36 p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-muted">{label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg ${color}`}>
                  <Icon size={17} />
                </div>
              </div>
              <p className="mt-7 text-4xl font-bold tracking-tight text-white">{loading ? '—' : value}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.8fr)]">
        <section aria-labelledby="quick-actions-heading">
          <div className="mb-4">
            <h2 id="quick-actions-heading" className="text-xl font-semibold tracking-tight text-white">Quick actions</h2>
            <p className="mt-1 text-sm text-muted">Move directly into the work that matters.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate('/publish')}
              className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors duration-200 hover:border-primary/50 hover:bg-bg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                  <Send size={18} />
                </div>
                <ArrowRight size={18} className="mt-1 text-muted transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mt-7 text-base font-semibold text-white">Create and publish</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">Compose a new post, attach media, and send it to selected channels.</p>
            </button>
            <button
              type="button"
              onClick={() => navigate('/accounts')}
              className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors duration-200 hover:border-primary/50 hover:bg-bg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                  <Users size={18} />
                </div>
                <ArrowRight size={18} className="mt-1 text-muted transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mt-7 text-base font-semibold text-white">Manage accounts</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">Review channel connections and keep publishing permissions current.</p>
            </button>
          </div>
        </section>

        <section aria-labelledby="platform-summary-heading">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id="platform-summary-heading" className="text-xl font-semibold tracking-tight text-white">Platform status</h2>
              <p className="mt-1 text-sm text-muted">Your current publishing destinations.</p>
            </div>
            <button type="button" onClick={() => navigate('/accounts')} className="text-xs font-semibold text-primary transition-opacity hover:opacity-80">
              Manage
            </button>
          </div>
          <Card className="divide-y divide-border p-0">
            {platformMeta.map(({ id, label, icon: Icon }) => {
              const isConnected = accounts[id]?.connected;
              return (
                <div key={id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                      <Icon size={17} />
                    </div>
                    <span className="text-sm font-semibold text-white">{label}</span>
                  </div>
                  {loading ? (
                    <span className="h-5 w-16 rounded-full bg-bg" aria-label="Loading status" />
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${isConnected ? 'border-success/40 bg-success/10 text-success' : 'border-border bg-bg text-muted'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-success' : 'bg-muted'}`} />
                      {isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  )}
                </div>
              );
            })}
          </Card>
        </section>
      </div>

      <section aria-labelledby="activity-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="activity-heading" className="text-xl font-semibold tracking-tight text-white">Recent activity</h2>
            <p className="mt-1 text-sm text-muted">The latest 50 publishing attempts from your workspace.</p>
          </div>
          {!loading && logs.length > 0 && <span className="text-xs text-muted">{logs.length} recent record{logs.length === 1 ? '' : 's'}</span>}
        </div>

        <Card className="p-4 sm:p-5">
          {loading ? (
            <div className="space-y-3" aria-label="Loading recent activity">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg bg-card" />
                    <span className="h-8 w-36 rounded bg-card" />
                  </div>
                  <span className="h-7 w-20 rounded-full bg-card" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-bg text-muted">
                <Sparkles size={21} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">No publishing activity yet</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">Your completed posts and delivery results will appear here once you publish.</p>
              <button
                type="button"
                onClick={() => navigate('/publish')}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Send size={15} />
                Create first post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const targetPlatforms = Object.keys(log.platforms || {});
                const isAllSuccess = Object.values(log.platforms || {}).every((platform) => platform.status === 'success');

                return (
                  <div key={log._id} className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
                        {log.mediaType === 'video' ? <Film size={16} /> : <ImageIcon size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{log.mediaType === 'video' ? 'Video post' : 'Image post'}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                          <span>{targetPlatforms.map((platform) => platformNames[platform] || platform).join(', ')}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1"><Clock size={12} />{formatDate(log.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${isAllSuccess ? 'border-success/40 bg-success/10 text-success' : 'border-error/40 bg-error/10 text-error'}`}>
                      {isAllSuccess ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {isAllSuccess ? 'Delivered' : 'Partial failure'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;

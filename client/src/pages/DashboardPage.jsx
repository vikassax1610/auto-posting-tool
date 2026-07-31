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
import Loader from '../components/Loader.jsx';
import { getPublishHistory } from '../services/publish.service.js';

const platformNames = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  pinterest: 'Pinterest',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [stats, setStats] = useState({
    totalPublished: 0,
    successCount: 0,
    failedCount: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getPublishHistory();
        const historyLogs = data.logs || [];
        setLogs(historyLogs);

        let successCount = 0;
        let failedCount = 0;

        historyLogs.forEach((log) => {
          Object.values(log.platforms || {}).forEach((p) => {
            if (p.status === 'success') successCount++;
            if (p.status === 'failed') failedCount++;
          });
        });

        setStats({
          totalPublished: historyLogs.length,
          successCount,
          failedCount,
        });
      } catch {
        // Non-critical error
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const statCards = [
    {
      label: 'Total Publishes',
      value: stats.totalPublished,
      icon: Activity,
    },
    {
      label: 'Successful Posts',
      value: stats.successCount,
      icon: CheckCircle,
    },
    {
      label: 'Failed Executions',
      value: stats.failedCount,
      icon: XCircle,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section: Title Left, "New Post" Button Right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your social publishing performance and recent activity.
          </p>
        </div>
        <button
          onClick={() => navigate('/publish')}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send size={16} />
          <span>New Post</span>
        </button>
      </div>

      {/* 2. Stat Cards Grid (120-140px Height) */}
      <div className="grid gap-6 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex h-[130px] flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg border border-border text-primary">
                <Icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Quick Actions Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Quick Actions
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Quick Action 1: Create & Publish */}
          <div
            onClick={() => navigate('/publish')}
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg border border-border text-primary group-hover:border-primary/40 transition-colors">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  Create & Publish Post
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  Compose caption, attach media, and broadcast instantly
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-muted group-hover:text-primary transition-colors"
            />
          </div>

          {/* Quick Action 2: Connected Accounts */}
          <div
            onClick={() => navigate('/accounts')}
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg border border-border text-primary group-hover:border-primary/40 transition-colors">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  Connected Accounts
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  Manage active channel integrations & credentials
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-muted group-hover:text-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Recent Activity
          </h2>
          <span className="text-xs text-muted">
            Latest 50 execution logs
          </span>
        </div>

        <Card className="p-6">
          {loadingHistory ? (
            <div className="flex h-40 items-center justify-center">
              <Loader size="md" />
            </div>
          ) : logs.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border text-muted">
                <Sparkles size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">
                No Publishing Activity Yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-muted">
                Create your first post to see platform execution history and status logs here.
              </p>
              <button
                onClick={() => navigate('/publish')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-hover"
              >
                <Send size={14} />
                <span>Create First Post</span>
              </button>
            </div>
          ) : (
            /* Activity Feed Table / List */
            <div className="space-y-3">
              {logs.map((log) => {
                const targetPlatforms = Object.keys(log.platforms || {});
                const isAllSuccess = Object.values(log.platforms || {}).every(
                  (p) => p.status === 'success'
                );

                return (
                  <div
                    key={log._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-bg p-4 transition-colors hover:border-primary/30"
                  >
                    {/* Media Type & Platform Count */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card border border-border text-primary">
                        {log.mediaType === 'video' ? (
                          <Film size={16} />
                        ) : (
                          <ImageIcon size={16} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white capitalize">
                            {log.mediaType || 'Media'} Post
                          </span>
                          <span className="text-xs text-muted">•</span>
                          <span className="text-xs text-muted">
                            {targetPlatforms
                              .map((p) => platformNames[p] || p)
                              .join(', ')}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                          <Clock size={12} />
                          <span>{formatDate(log.publishedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${isAllSuccess
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border bg-card text-muted'
                          }`}
                      >
                        {isAllSuccess ? (
                          <>
                            <CheckCircle size={13} />
                            <span>Success</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
                            <span>Partial Failure</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

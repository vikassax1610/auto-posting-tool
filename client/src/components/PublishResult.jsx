import { CheckCircle, XCircle } from 'lucide-react';
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from './icons/PlatformIcons.jsx';

const platformMeta = {
  linkedin: { label: 'LinkedIn', icon: LinkedInIcon },
  facebook: { label: 'Facebook', icon: FacebookIcon },
  instagram: { label: 'Instagram', icon: InstagramIcon },
  pinterest: { label: 'Pinterest', icon: PinterestIcon },
};

const PublishResult = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold text-muted uppercase tracking-wider">
        Publishing results
      </h3>
      <div className="space-y-2.5">
        {Object.entries(results).map(([platform, result]) => {
          const meta = platformMeta[platform];
          if (!meta) return null;

          const Icon = meta.icon;
          const isSuccess = result.status === 'success';

          return (
            <div
              key={platform}
              className="flex flex-col gap-3 rounded-xl border border-border bg-bg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-primary">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-white">
                  {meta.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    <CheckCircle size={14} />
                      Published
                  </span>
                ) : (
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-error/40 bg-error/10 px-2.5 py-1 text-xs font-medium text-error">
                    <XCircle size={14} className="shrink-0" />
                      {result.error || 'Failed'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublishResult;

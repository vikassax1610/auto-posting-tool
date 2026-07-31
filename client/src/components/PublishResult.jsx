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
        Publish Results
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
              className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-primary">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-white">
                  {meta.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <>
                    <CheckCircle size={16} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      Published
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-muted" />
                    <span className="text-sm text-muted">
                      {result.error || 'Failed'}
                    </span>
                  </>
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

import { Check } from 'lucide-react';
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from './icons/PlatformIcons.jsx';

const platforms = [
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { id: 'pinterest', label: 'Pinterest', icon: PinterestIcon },
];

const PlatformSelector = ({ selected, onChange }) => {
  const togglePlatform = (platformId) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter((id) => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  const selectAll = () => {
    if (selected.length === platforms.length) {
      onChange([]);
    } else {
      onChange(platforms.map((p) => p.id));
    }
  };

  const isAllSelected = selected.length === platforms.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Target platforms
          </label>
          <p className="mt-1 text-xs text-muted">Select every channel that should receive this post.</p>
        </div>
        <button
          type="button"
          onClick={selectAll}
          className="shrink-0 text-xs font-semibold text-primary transition-opacity hover:opacity-80"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {platforms.map(({ id, label, icon: Icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => togglePlatform(id)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-border bg-bg text-muted hover:border-primary/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-card text-muted'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold">{label}</span>
              </div>

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-card'
                }`}
              >
                {isSelected && <Check size={13} strokeWidth={2.5} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;

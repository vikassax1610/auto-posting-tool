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
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Target Platforms
        </label>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs font-medium text-primary hover:underline transition-all"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {platforms.map(({ id, label, icon: Icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => togglePlatform(id)}
              className={`flex items-center justify-between rounded-xl border p-3.5 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-bg text-white font-semibold'
                  : 'border-border bg-bg/50 text-muted font-medium hover:border-primary/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-sm">{label}</span>
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

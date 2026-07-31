import { Send } from 'lucide-react';
import Loader from './Loader.jsx';

const PublishButton = ({ onClick, loading, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
    >
      {loading ? (
        <>
          <Loader size="sm" />
          <span>Publishing to selected platforms...</span>
        </>
      ) : (
        <>
          <Send size={18} />
          <span>Publish</span>
        </>
      )}
    </button>
  );
};

export default PublishButton;

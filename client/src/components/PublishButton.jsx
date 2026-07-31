import { Send } from 'lucide-react';
import Loader from './Loader.jsx';

const PublishButton = ({ onClick, loading, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:scale-100"
    >
      {loading ? (
        <>
          <Loader size="sm" />
          <span>Publishing to Selected Platforms...</span>
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

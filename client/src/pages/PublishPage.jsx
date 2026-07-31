import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, RotateCcw, Send } from 'lucide-react';
import Card from '../components/Card.jsx';
import Textarea from '../components/Textarea.jsx';
import MediaUploader from '../components/MediaUploader.jsx';
import PlatformSelector from '../components/PlatformSelector.jsx';
import PublishButton from '../components/PublishButton.jsx';
import PublishResult from '../components/PublishResult.jsx';
import Loader from '../components/Loader.jsx';
import { publishPost } from '../services/publish.service.js';

const PublishPage = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setResults(null);
  };

  const handlePublish = async () => {
    if (!caption.trim()) {
      toast.error('Please write a caption');
      return;
    }
    if (!file) {
      toast.error('Please upload a media file');
      return;
    }
    if (platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('media', file);
      formData.append('platforms', JSON.stringify(platforms));

      const { data } = await publishPost(formData);
      setResults(data.results);

      const allSuccess = Object.values(data.results).every(
        (result) => result.status === 'success'
      );
      if (allSuccess) {
        toast.success('Published to all platforms!');
      } else {
        toast('Published with some errors', { icon: '⚠️' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Publishing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCaption('');
    setFile(null);
    setPlatforms([]);
    setResults(null);
  };

  const hasDraft = caption || file || platforms.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Publishing workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create a post</h1>
          <p className="mt-2 text-sm text-muted">Write once, choose your channels, and publish from one focused workspace.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasDraft || loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={16} />
          Clear draft
        </button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                <Send size={17} />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">Post details</h2>
                <p className="mt-1 text-sm text-muted">Start with the message your audience will see.</p>
              </div>
            </div>
            <Textarea
              id="caption"
              label="Caption"
              placeholder="Write your post caption..."
              value={caption}
              onChange={(event) => {
                setCaption(event.target.value);
                setResults(null);
              }}
              rows={7}
              aria-describedby="caption-helper"
            />
            <div id="caption-helper" className="mt-2 flex justify-between text-xs text-muted">
              <span>Make it clear, relevant, and ready to share.</span>
              <span>{caption.length} characters</span>
            </div>
          </Card>

          <Card className="p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-white">Media</h2>
              <p className="mt-1 text-sm text-muted">Attach the image or video that belongs with your post.</p>
            </div>
            <MediaUploader
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-white">Distribution</h2>
              <p className="mt-1 text-sm text-muted">Choose the accounts receiving this post.</p>
            </div>
            <PlatformSelector selected={platforms} onChange={(nextPlatforms) => {
              setPlatforms(nextPlatforms);
              setResults(null);
            }} />

            <div className="my-6 border-t border-border" />

            <div className="mb-5 rounded-xl border border-border bg-bg p-4">
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-white">Publishing in progress</p>
                    <p className="mt-0.5 text-xs text-muted">Sending your post to the selected platforms.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className={caption && file && platforms.length ? 'text-success' : 'text-muted'} />
                  <div>
                    <p className="text-sm font-semibold text-white">Ready when you are</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {platforms.length ? `${platforms.length} platform${platforms.length > 1 ? 's' : ''} selected` : 'Select one or more platforms to continue.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <PublishButton
              onClick={handlePublish}
              loading={loading}
              disabled={!caption.trim() || !file || platforms.length === 0}
            />
          </Card>

          {results && (
            <Card className="p-5 sm:p-6">
              <PublishResult results={results} />
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
              >
                <RotateCcw size={16} />
                Create a new post
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishPage;

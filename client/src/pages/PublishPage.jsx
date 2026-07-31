import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../components/Card.jsx';
import Textarea from '../components/Textarea.jsx';
import MediaUploader from '../components/MediaUploader.jsx';
import PlatformSelector from '../components/PlatformSelector.jsx';
import PublishButton from '../components/PublishButton.jsx';
import PublishResult from '../components/PublishResult.jsx';
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
        (r) => r.status === 'success'
      );
      if (allSuccess) {
        toast.success('Published to all platforms!');
      } else {
        toast('Published with some errors', { icon: '⚠️' });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Publishing failed'
      );
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Publish Post
        </h1>
        <p className="mt-1 text-sm text-muted">
          Compose your message, attach media, select channels, and publish immediately.
        </p>
      </div>

      <Card className="space-y-6 p-6 md:p-8">
        {/* Caption */}
        <Textarea
          id="caption"
          label="Caption"
          placeholder="Write your post caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Media Uploader */}
        <MediaUploader
          file={file}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
        />

        {/* Platform Selector */}
        <PlatformSelector selected={platforms} onChange={setPlatforms} />

        {/* Publish Action */}
        <div className="pt-2">
          <PublishButton
            onClick={handlePublish}
            loading={loading}
            disabled={!caption.trim() || !file || platforms.length === 0}
          />
        </div>
      </Card>

      {/* Results Card */}
      {results && (
        <Card className="p-6 md:p-8">
          <PublishResult results={results} />
          <button
            onClick={handleReset}
            className="mt-6 w-full rounded-xl border border-border bg-bg py-3 text-sm font-semibold text-white transition-all hover:border-primary/40 hover:text-primary"
          >
            Create New Post
          </button>
        </Card>
      )}
    </div>
  );
};

export default PublishPage;

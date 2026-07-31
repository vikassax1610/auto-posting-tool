import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';

const MediaUploader = ({ file, onFileSelect, onFileRemove }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isVideo = file?.type?.startsWith('video/');
  const isImage = file?.type?.startsWith('image/');
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-muted uppercase tracking-wider">
        Media Attachment
      </label>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 px-6 transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-bg/50 hover:border-primary/50 hover:bg-card-hover'
          }`}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-bg border border-border text-primary">
            <Upload size={20} />
          </div>
          <p className="text-sm font-semibold text-white">
            <span className="text-primary hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-muted">
            Images (JPG, PNG, GIF, WebP) or Videos (MP4, MOV, WebM) up to 50MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg">
          {/* Preview Display */}
          <div className="relative flex items-center justify-center bg-black/80 p-4 min-h-[200px]">
            {isImage && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-72 rounded-xl object-contain"
              />
            )}
            {isVideo && (
              <video
                src={previewUrl}
                controls
                className="max-h-72 w-full rounded-xl"
              />
            )}
          </div>

          {/* Metadata Bar */}
          <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-white font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg border border-border text-primary">
                {isImage ? <ImageIcon size={16} /> : <Film size={16} />}
              </div>
              <div className="min-w-0">
                <p className="max-w-[240px] truncate text-sm text-white font-medium">{file.name}</p>
                <p className="text-xs text-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onFileRemove}
              className="rounded-lg border border-border p-2 text-muted transition-colors hover:border-primary/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;

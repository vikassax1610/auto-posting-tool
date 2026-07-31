import { useEffect, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';

const MediaUploader = ({ file, onFileSelect, onFileRemove }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

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

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = '';
    onFileRemove();
  };

  const isVideo = file?.type?.startsWith('video/');
  const isImage = file?.type?.startsWith('image/');
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Media attachment
        </label>
        <span className="text-xs text-muted">Image or video · up to 50MB</span>
      </div>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload a media attachment"
          className={`flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-primary bg-primary/10'
              : 'border-border bg-bg hover:border-primary/50'
          }`}
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary">
            <Upload size={20} />
          </div>
          <p className="text-sm font-semibold text-white">
            Drop your media here, or <span className="text-primary">browse files</span>
          </p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
            JPG, PNG, GIF, WebP, MP4, MOV, AVI, or WebM
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
        <div className="overflow-hidden rounded-2xl border border-border bg-bg">
          <div className="relative flex min-h-[260px] items-center justify-center border-b border-border p-4 sm:min-h-[320px]">
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

          <div className="flex items-center justify-between gap-4 bg-card px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3 text-sm font-medium text-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-primary">
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
              onClick={handleRemove}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-error/60 hover:text-error"
              aria-label="Remove selected media"
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

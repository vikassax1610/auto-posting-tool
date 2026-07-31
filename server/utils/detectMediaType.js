/**
 * Detect media type from MIME type.
 *
 * @param {string} mimetype - The MIME type of the file (e.g., 'image/jpeg', 'video/mp4')
 * @returns {'image' | 'video'}
 */
const detectMediaType = (mimetype) => {
  if (mimetype.startsWith('video/')) {
    return 'video';
  }
  return 'image';
};

export default detectMediaType;

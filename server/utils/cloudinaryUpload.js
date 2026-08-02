import cloudinary from '../config/cloudinary.js';

/**
 * Upload a file buffer to Cloudinary.
 * Automatically detects resource_type from mediaType.
 *
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} mediaType - 'image' or 'video'
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const cloudinaryUpload = async (fileBuffer, mediaType) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      'Instagram image hosting is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.'
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: mediaType === 'video' ? 'video' : 'image',
        folder: 'social-media-publisher',
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinaryUpload;

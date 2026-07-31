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

import axios from 'axios';

/**
 * Publish content to Instagram (via Facebook Graph API).
 * Currently a placeholder — returns simulated success.
 * Replace with real Instagram Content Publishing API when OAuth is integrated.
 *
 * @param {string} caption - Post caption
 * @param {Buffer} fileBuffer - Raw file buffer from multer
 * @param {string} mediaType - 'image' or 'video'
 * @param {string} accessToken - Facebook/Instagram access token
 * @param {string} igAccountId - Instagram Business Account ID
 * @returns {Promise<{ status: string, postId?: string, error?: string }>}
 */
export const publishToInstagram = async (caption, fileBuffer, mediaType, accessToken, igAccountId) => {
  try {
    // TODO: Replace with real Instagram Content Publishing API
    // Step 1: Create media container
    //   POST /{ig-account-id}/media
    //   { image_url | video_url, caption, media_type }
    //
    // Step 2: Publish the container
    //   POST /{ig-account-id}/media_publish
    //   { creation_id }
    //
    // const containerRes = await axios.post(
    //   `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    //   {
    //     [mediaType === 'video' ? 'video_url' : 'image_url']: mediaUrl,
    //     caption,
    //     media_type: mediaType === 'video' ? 'VIDEO' : 'IMAGE',
    //     access_token: accessToken,
    //   }
    // );
    // const creationId = containerRes.data.id;
    //
    // const publishRes = await axios.post(
    //   `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
    //   { creation_id: creationId, access_token: accessToken }
    // );

    // Placeholder: simulate successful publish
    return {
      status: 'success',
      postId: `ig_${Date.now()}`,
    };
  } catch (error) {
    return {
      status: 'failed',
      error: error.response?.data?.error?.message || error.message,
    };
  }
};

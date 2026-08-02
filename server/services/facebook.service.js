import axios from 'axios';
import FormData from 'form-data';

const API_VERSION = 'v26.0';

const getFacebookErrorMessage = (error) =>
  error.response?.data?.error?.message || error.message || 'Facebook API request failed';

/**
 * Resolve a Page access token for the selected Facebook Page.
 * Facebook Page publishing must use the Page token, rather than the User token
 * that is used to list the Pages a person manages.
 */
export const getFacebookPage = async (accessToken, pageId) => {
  if (!accessToken || !pageId) {
    throw new Error('Facebook Page credentials are missing.');
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/me/accounts`,
      {
        params: { fields: 'id,name,access_token', access_token: accessToken },
        timeout: 15_000,
      }
    );

    const page = response.data?.data?.find(({ id }) => id === pageId);

    if (page?.access_token) {
      return {
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
      };
    }

    // Allow a Page token to be configured directly as well. Its /me identity
    // is the Page, while a User token has the person's identity instead.
    const meResponse = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/me`,
      {
        params: { fields: 'id,name', access_token: accessToken },
        timeout: 15_000,
      }
    );

    if (meResponse.data?.id === pageId) {
      return {
        id: meResponse.data.id,
        name: meResponse.data.name,
        accessToken,
      };
    }

    throw new Error(
      'The token cannot provide a Page access token for the configured Page. Re-authorize it with pages_show_list, pages_read_engagement, and pages_manage_posts.'
    );
  } catch (error) {
    throw new Error(getFacebookErrorMessage(error));
  }
};

/**
 * Publish content (text, image, or video buffer) to Facebook Page via Meta Graph API.
 *
 * @param {string} caption - Post caption / message / description
 * @param {Buffer} fileBuffer - Raw file buffer from multer (optional for text-only)
 * @param {string} mediaType - 'image', 'video', or 'text'
 * @param {string} accessToken - Facebook Page access token
 * @param {string} pageId - Facebook Page ID
 * @returns {Promise<{ status: string, postId?: string, error?: string }>}
 */
export const publishToFacebook = async (caption, fileBuffer, mediaType, accessToken, pageId) => {
  if (!accessToken || !pageId) {
    return {
      status: 'failed',
      error: 'Facebook Page credentials are missing. Reconnect the Facebook Page and try again.',
    };
  }

  try {
    let url = `https://graph.facebook.com/${API_VERSION}/${pageId}`;
    let data;
    let headers = {};

    // 1. Text-Only Post
    if (!fileBuffer || mediaType === 'text') {
      url += '/feed';
      data = {
        message: caption,
        access_token: accessToken,
      };
    }
    // 2. Image Upload (photos endpoint)
    else if (mediaType === 'image') {
      url += '/photos';
      const form = new FormData();
      form.append('access_token', accessToken);
      form.append('caption', caption || '');
      form.append('source', fileBuffer, { filename: 'upload.jpg' });

      data = form;
      headers = form.getHeaders();
    }
    // 3. Video Upload (videos endpoint)
    else if (mediaType === 'video') {
      url += '/videos';
      const form = new FormData();
      form.append('access_token', accessToken);
      form.append('description', caption || '');
      form.append('source', fileBuffer, { filename: 'upload.mp4' });

      data = form;
      headers = form.getHeaders();
    } else {
      throw new Error(`Unsupported mediaType: ${mediaType}`);
    }

    // Execute API Request
    const response = await axios.post(url, data, {
      headers,
      timeout: 30_000,
    });

    // Meta returns { id: "POST_ID" } for feed/videos or { id: "PHOTO_ID", post_id: "POST_ID" } for photos
    const postId = response.data.post_id || response.data.id;

    return {
      status: 'success',
      postId,
    };
  } catch (error) {
    const errorMessage = getFacebookErrorMessage(error);

    return {
      status: 'failed',
      error: errorMessage,
    };
  }
};

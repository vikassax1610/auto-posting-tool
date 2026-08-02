import axios from 'axios';

const API_VERSION = 'v26.0';
const CONTAINER_POLL_INTERVAL_MS = 2_000;
const CONTAINER_POLL_ATTEMPTS = 15;

const getInstagramErrorMessage = (error) =>
  error.response?.data?.error?.message || error.message || 'Instagram API request failed';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get the Instagram Professional account linked to a Facebook Page.
 */
export const getInstagramBusinessAccount = async (accessToken, pageId) => {
  if (!accessToken || !pageId) {
    throw new Error('Facebook Page credentials are missing.');
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/${pageId}`,
      {
        params: {
          fields: 'instagram_business_account{id,username}',
          access_token: accessToken,
        },
        timeout: 15_000,
      }
    );

    const account = response.data?.instagram_business_account;
    if (!account?.id) {
      throw new Error(
        'No Instagram Professional account is linked to this Facebook Page. Link the Business or Creator account to the Page, then reconnect it.'
      );
    }

    return account;
  } catch (error) {
    throw new Error(getInstagramErrorMessage(error));
  }
};

const waitForContainer = async (containerId, accessToken) => {
  for (let attempt = 0; attempt < CONTAINER_POLL_ATTEMPTS; attempt += 1) {
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/${containerId}`,
      {
        params: {
          fields: 'status_code,status',
          access_token: accessToken,
        },
        timeout: 15_000,
      }
    );

    const { status_code: statusCode, status } = response.data;
    if (statusCode === 'FINISHED') return;

    if (statusCode === 'ERROR' || statusCode === 'EXPIRED') {
      throw new Error(status || `Instagram media container ${statusCode.toLowerCase()}.`);
    }

    await delay(CONTAINER_POLL_INTERVAL_MS);
  }

  throw new Error('Instagram is still processing the image. Please try again shortly.');
};

/**
 * Publish an image to an Instagram Professional account through the Meta
 * Content Publishing API.
 */
export const publishToInstagram = async (
  caption,
  imageUrl,
  mediaType,
  accessToken,
  igAccountId
) => {
  if (!accessToken || !igAccountId) {
    return {
      status: 'failed',
      error: 'Instagram account credentials are missing. Reconnect the Instagram account and try again.',
    };
  }

  if (mediaType !== 'image') {
    return {
      status: 'failed',
      error: 'Instagram video publishing is not available yet. Upload an image instead.',
    };
  }

  if (!imageUrl) {
    return {
      status: 'failed',
      error: 'Instagram requires a publicly accessible image URL.',
    };
  }

  try {
    const containerResponse = await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${igAccountId}/media`,
      {
        image_url: imageUrl,
        caption: caption || '',
        access_token: accessToken,
      },
      { timeout: 30_000 }
    );

    const containerId = containerResponse.data?.id;
    if (!containerId) {
      throw new Error('Instagram did not return a media container ID.');
    }

    await waitForContainer(containerId, accessToken);

    const publishResponse = await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${igAccountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      },
      { timeout: 30_000 }
    );

    return {
      status: 'success',
      postId: publishResponse.data?.id,
    };
  } catch (error) {
    return {
      status: 'failed',
      error: getInstagramErrorMessage(error),
    };
  }
};

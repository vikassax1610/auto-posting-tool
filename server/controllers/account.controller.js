import User from '../models/User.js';
import { getFacebookPage } from '../services/facebook.service.js';
import { getInstagramBusinessAccount } from '../services/instagram.service.js';

const VALID_PLATFORMS = ['linkedin', 'facebook', 'instagram', 'pinterest'];

const toPublicAccount = (account = {}) => ({
  connected: Boolean(account.connected),
  accountId: account.accountId || '',
  accountName: account.accountName || '',
});

const getFacebookPageCredentials = () => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN?.trim();
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!accessToken || !pageId) {
    throw new Error(
      'Facebook is not configured. Set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in server/.env before connecting a Page.'
    );
  }

  return { accessToken, pageId };
};

// @desc    Get all connected account statuses
// @route   GET /api/accounts
export const getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const connectedAccounts = Object.fromEntries(
      VALID_PLATFORMS.map((platform) => [
        platform,
        toPublicAccount(user.connectedAccounts?.[platform]),
      ])
    );

    // Never send access tokens to the browser.
    res.json({ connectedAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Connect a platform account (placeholder)
// @route   POST /api/accounts/:platform/connect
export const connectAccount = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ message: `Invalid platform: ${platform}` });
    }

    const user = await User.findById(req.user._id);

    if (platform === 'facebook') {
      let accessToken;
      let pageId;
      let page;

      try {
        ({ accessToken, pageId } = getFacebookPageCredentials());
        page = await getFacebookPage(accessToken, pageId);
      } catch (error) {
        return res.status(400).json({
          message: `Facebook Page could not be verified. FACEBOOK_PAGE_ID must identify a Page authorized by FACEBOOK_ACCESS_TOKEN. Meta reported: ${error.message}`,
        });
      }

      user.connectedAccounts.facebook = {
        connected: true,
        accessToken: page.accessToken,
        accountId: page.id,
        accountName: page.name || 'Facebook Page',
      };
      await user.save();

      return res.json({
        message: 'Facebook Page connected successfully',
        account: toPublicAccount(user.connectedAccounts.facebook),
      });
    }

    if (platform === 'instagram') {
      try {
        const { accessToken, pageId } = getFacebookPageCredentials();
        const page = await getFacebookPage(accessToken, pageId);
        const instagramAccount = await getInstagramBusinessAccount(page.accessToken, page.id);

        user.connectedAccounts.instagram = {
          connected: true,
          accessToken: page.accessToken,
          accountId: instagramAccount.id,
          accountName: instagramAccount.username || 'Instagram Professional Account',
        };
        await user.save();

        return res.json({
          message: 'Instagram Professional account connected successfully',
          account: toPublicAccount(user.connectedAccounts.instagram),
        });
      } catch (error) {
        return res.status(400).json({
          message: `Instagram account could not be verified: ${error.message}`,
        });
      }
    }

    // The remaining integrations still use their existing placeholder flow.
    user.connectedAccounts[platform] = {
      connected: true,
      accessToken: 'placeholder_token',
      accountId: `${platform}_account_${Date.now()}`,
      accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
    };
    await user.save();

    res.json({
      message: `${platform} account connected successfully`,
      account: toPublicAccount(user.connectedAccounts[platform]),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Disconnect a platform account
// @route   POST /api/accounts/:platform/disconnect
export const disconnectAccount = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ message: `Invalid platform: ${platform}` });
    }

    const user = await User.findById(req.user._id);
    user.connectedAccounts[platform] = {
      connected: false,
      accessToken: '',
      refreshToken: '',
      accountId: '',
      accountName: '',
    };
    await user.save();

    res.json({ message: `${platform} account disconnected successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

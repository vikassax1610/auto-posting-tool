import User from '../models/User.js';

const VALID_PLATFORMS = ['linkedin', 'facebook', 'instagram', 'pinterest'];

// @desc    Get all connected account statuses
// @route   GET /api/accounts
export const getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ connectedAccounts: user.connectedAccounts });
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

    // TODO: Replace with real OAuth flow
    // For now, just mark the account as connected
    const user = await User.findById(req.user._id);
    user.connectedAccounts[platform] = {
      connected: true,
      accessToken: 'placeholder_token',
      accountId: `${platform}_account_${Date.now()}`,
      accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
    };
    await user.save();

    res.json({
      message: `${platform} account connected successfully`,
      account: user.connectedAccounts[platform],
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

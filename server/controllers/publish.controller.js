import PublishLog from '../models/PublishLog.js';
import detectMediaType from '../utils/detectMediaType.js';
import { publishToLinkedIn } from '../services/linkedin.service.js';
import { publishToFacebook } from '../services/facebook.service.js';
import { publishToInstagram } from '../services/instagram.service.js';
import { publishToPinterest } from '../services/pinterest.service.js';

// Publisher registry — maps platform name to its publish function
const publishers = {
  linkedin: publishToLinkedIn,
  facebook: publishToFacebook,
  instagram: publishToInstagram,
  pinterest: publishToPinterest,
};

// @desc    Publish media to selected platforms
// @route   POST /api/publish
export const publish = async (req, res) => {
  try {
    const { caption } = req.body;
    let { platforms } = req.body;

    // Parse platforms if it came as a JSON string (multipart/form-data)
    if (typeof platforms === 'string') {
      platforms = JSON.parse(platforms);
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ message: 'At least one platform must be selected' });
    }

    // Validate platform names
    const validPlatforms = Object.keys(publishers);
    const invalidPlatforms = platforms.filter((p) => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return res.status(400).json({
        message: `Invalid platforms: ${invalidPlatforms.join(', ')}`,
      });
    }

    // Detect media type from MIME
    const mediaType = detectMediaType(req.file.mimetype);

    // Fan out to selected publishers using Promise.allSettled
    // Each service receives the raw file buffer — no intermediate storage
    const tasks = platforms.map((platform) =>
      publishers[platform](caption, req.file.buffer, mediaType, '', '')
    );

    const settled = await Promise.allSettled(tasks);

    // Build results object
    const results = {};
    platforms.forEach((platform, index) => {
      const result = settled[index];
      if (result.status === 'fulfilled') {
        results[platform] = result.value;
      } else {
        results[platform] = {
          status: 'failed',
          error: result.reason?.message || 'Unknown error',
        };
      }
    });

    // Save publish log to database (only status, no media content)
    await PublishLog.create({
      userId: req.user._id,
      mediaType,
      platforms: results,
      publishedAt: new Date(),
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Publishing failed', error: error.message });
  }
};

// @desc    Get publish history
// @route   GET /api/publish/history
export const getHistory = async (req, res) => {
  try {
    const logs = await PublishLog.find({ userId: req.user._id })
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

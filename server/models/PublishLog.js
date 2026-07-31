import mongoose from 'mongoose';

const platformResultSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['success', 'failed', 'skipped'],
      required: true,
    },
    postId: { type: String, default: '' },
    error: { type: String, default: '' },
  },
  { _id: false }
);

const publishLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  platforms: {
    linkedin: { type: platformResultSchema },
    facebook: { type: platformResultSchema },
    instagram: { type: platformResultSchema },
    pinterest: { type: platformResultSchema },
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
});

const PublishLog = mongoose.model('PublishLog', publishLogSchema);

export default PublishLog;

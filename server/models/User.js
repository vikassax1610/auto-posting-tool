import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const accountSchema = new mongoose.Schema(
  {
    connected: { type: Boolean, default: false },
    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    accountId: { type: String, default: '' },
    accountName: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    connectedAccounts: {
      linkedin: { type: accountSchema, default: () => ({}) },
      facebook: { type: accountSchema, default: () => ({}) },
      instagram: { type: accountSchema, default: () => ({}) },
      pinterest: { type: accountSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

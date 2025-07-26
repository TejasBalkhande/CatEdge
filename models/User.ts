// models/User.ts
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  section: { type: String, required: true }, // VARC, DILR, QA
  topic: { type: String, required: true },
  attempted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['free', 'premium'], default: 'free' },
  progress: [progressSchema], // Array of progress objects
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
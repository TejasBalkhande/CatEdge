import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Define interface for Progress
export interface IProgress {
  section: string;  // VARC, DILR, QA
  topic: string;
  attempted: number;
  correct: number;
}

// Define interface for User document
export interface IUser extends Document {
  _id: Types.ObjectId; // Explicitly define _id
  fullName: string;
  email: string;
  password: string;
  role: 'free' | 'premium';
  progress: IProgress[];
  createdAt: Date;
}

// Progress Schema
const progressSchema = new Schema<IProgress>({
  section: { type: String, required: true },
  topic: { type: String, required: true },
  attempted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
});

// User Schema
const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['free', 'premium'], 
    default: 'free' 
  },
  progress: [progressSchema],
  createdAt: { type: Date, default: Date.now }
});

// Create the model
const UserModel: Model<IUser> = 
  mongoose.models.User as Model<IUser> || 
  mongoose.model<IUser>('User', userSchema);

export default UserModel;
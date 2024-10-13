import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  fullname: string; 
  contactNo: string; 
  city: string; 
  role: string; 
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  fullname: { type: String, required: true }, 
  contactNo: { type: String, required: true }, 
  city: { type: String, required: true }, 
  role: { type: String, required: true, default: 'user'} 
});

export default mongoose.model<IUser>('User', UserSchema);
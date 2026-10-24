import mongoose from 'mongoose';
import { USER_ROLES } from '../constants.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: USER_ROLES, default: 'attendee', required: true }
}, { timestamps: true, versionKey: false });

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);



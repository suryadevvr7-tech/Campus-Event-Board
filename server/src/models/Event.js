import mongoose from 'mongoose';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../constants.js';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 20, maxlength: 2000 },
  category: { type: String, required: true, enum: EVENT_CATEGORIES },
  venue: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: EVENT_STATUSES, default: 'published', required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, versionKey: false });

eventSchema.index({ status: 1, startsAt: 1, category: 1 });
eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

export const Event = mongoose.model('Event', eventSchema);


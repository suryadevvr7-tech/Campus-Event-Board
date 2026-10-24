import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { SavedEvent } from '../models/SavedEvent.js';
import { HttpError } from '../utils/httpError.js';

const populateOrganizer = { path: 'organizer', select: 'name role' };
const serializeEvent = (event, saved = false) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  category: event.category,
  venue: event.venue,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  status: event.status,
  organizer: event.organizer ? { id: event.organizer.id, name: event.organizer.name } : null,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
  saved
});

async function pageEvents(filter, { page, limit }, userId) {
  const [events, total] = await Promise.all([
    Event.find(filter).sort({ startsAt: 1, _id: 1 }).skip((page - 1) * limit).limit(limit).populate(populateOrganizer),
    Event.countDocuments(filter)
  ]);
  const savedIds = userId && events.length
    ? new Set((await SavedEvent.find({ user: userId, event: { $in: events.map((event) => event._id) } }).select('event')).map((item) => item.event.toString()))
    : new Set();
  return { items: events.map((event) => serializeEvent(event, savedIds.has(event.id))), pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function listEvents(req, res) {
  const { q, category, page, limit } = req.validated.query;
  const filter = { status: 'published', startsAt: { $gte: new Date() } };
  if (category) filter.category = category;
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = ['title', 'description', 'venue'].map((field) => ({ [field]: { $regex: escaped, $options: 'i' } }));
  }
  res.json(await pageEvents(filter, { page, limit }, req.user?.id));
}

export async function listMyEvents(req, res) {
  const { page, limit } = req.validated.query;
  res.json(await pageEvents({ organizer: req.user.id }, { page, limit }, req.user.id));
}

export async function listSavedEvents(req, res) {
  const { page, limit } = req.validated.query;
  const filter = { user: req.user.id };
  const [saved, total] = await Promise.all([
    SavedEvent.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate({ path: 'event', populate: populateOrganizer }),
    SavedEvent.countDocuments(filter)
  ]);
  const items = saved.filter((row) => row.event).map((row) => serializeEvent(row.event, true));
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getEvent(req, res) {
  const event = await Event.findById(req.params.id).populate(populateOrganizer);
  if (!event) throw new HttpError(404, 'EVENT_NOT_FOUND', 'This event could not be found.');
  const saved = req.user ? await SavedEvent.exists({ user: req.user.id, event: event.id }) : false;
  res.json({ item: serializeEvent(event, Boolean(saved)) });
}

export async function createEvent(req, res) {
  const event = await Event.create({ ...req.body, organizer: req.user.id });
  await event.populate(populateOrganizer);
  res.status(201).json({ item: serializeEvent(event) });
}

export async function updateEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) throw new HttpError(404, 'EVENT_NOT_FOUND', 'This event could not be found.');
  if (event.organizer.toString() !== req.user.id) throw new HttpError(403, 'FORBIDDEN', 'Only the event organizer can change this event.');
  Object.assign(event, req.body);
  if (event.endsAt <= event.startsAt) throw new HttpError(400, 'VALIDATION_ERROR', 'End time must be after start time.');
  await event.save();
  await event.populate(populateOrganizer);
  const saved = await SavedEvent.exists({ user: req.user.id, event: event.id });
  res.json({ item: serializeEvent(event, Boolean(saved)) });
}

export async function deleteEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) throw new HttpError(404, 'EVENT_NOT_FOUND', 'This event could not be found.');
  if (event.organizer.toString() !== req.user.id) throw new HttpError(403, 'FORBIDDEN', 'Only the event organizer can delete this event.');
  await Promise.all([event.deleteOne(), SavedEvent.deleteMany({ event: event.id })]);
  res.status(204).end();
}

export async function saveEvent(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(400, 'INVALID_ID', 'The supplied event ID is invalid.');
  const event = await Event.findOne({ _id: req.params.id, status: 'published' });
  if (!event) throw new HttpError(404, 'EVENT_NOT_FOUND', 'This event could not be found.');
  await SavedEvent.updateOne({ user: req.user.id, event: event.id }, { $setOnInsert: { user: req.user.id, event: event.id } }, { upsert: true });
  res.status(201).json({ saved: true });
}

export async function unsaveEvent(req, res) {
  await SavedEvent.deleteOne({ user: req.user.id, event: req.params.id });
  res.status(204).end();
}


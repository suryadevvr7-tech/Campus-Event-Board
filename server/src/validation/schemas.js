import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_STATUSES, USER_ROLES } from '../constants.js';

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).max(72).regex(/[A-Za-z]/, 'Must include a letter').regex(/[0-9]/, 'Must include a number');

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email,
  password,
  role: z.enum(USER_ROLES).default('attendee')
}).strict();

export const loginSchema = z.object({ email, password: z.string().min(1).max(72) }).strict();

const eventFields = {
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(20).max(2000),
  category: z.enum(EVENT_CATEGORIES),
  venue: z.string().trim().min(2).max(120),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date()
};

export const createEventSchema = z.object(eventFields).strict().refine((event) => event.endsAt > event.startsAt, {
  message: 'End time must be after start time', path: ['endsAt']
});

export const updateEventSchema = z.object({
  ...Object.fromEntries(Object.entries(eventFields).map(([key, value]) => [key, value.optional()])),
  status: z.enum(EVENT_STATUSES).optional()
}).strict().refine((event) => Object.keys(event).length > 0, { message: 'Provide at least one field to update.' })
  .refine((event) => !event.startsAt || !event.endsAt || event.endsAt > event.startsAt, {
    message: 'End time must be after start time', path: ['endsAt']
  });

export const listEventsSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(EVENT_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(10)
}).strict();

export const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });


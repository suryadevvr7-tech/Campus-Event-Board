import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, listMyEvents, listSavedEvents, saveEvent, unsaveEvent, updateEvent } from '../controllers/eventController.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEventSchema, listEventsSchema, updateEventSchema, idSchema } from '../validation/schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', validate(listEventsSchema, 'query'), optionalAuth, asyncHandler(listEvents));
router.get('/mine', requireAuth, requireRole('organizer'), validate(listEventsSchema.pick({ page: true, limit: true }), 'query'), asyncHandler(listMyEvents));
router.get('/saved', requireAuth, validate(listEventsSchema.pick({ page: true, limit: true }), 'query'), asyncHandler(listSavedEvents));
router.post('/', requireAuth, requireRole('organizer'), validate(createEventSchema), asyncHandler(createEvent));
router.get('/:id', validate(idSchema, 'params'), optionalAuth, asyncHandler(getEvent));
router.patch('/:id', requireAuth, requireRole('organizer'), validate(idSchema, 'params'), validate(updateEventSchema), asyncHandler(updateEvent));
router.delete('/:id', requireAuth, requireRole('organizer'), validate(idSchema, 'params'), asyncHandler(deleteEvent));
router.post('/:id/save', requireAuth, validate(idSchema, 'params'), asyncHandler(saveEvent));
router.delete('/:id/save', requireAuth, validate(idSchema, 'params'), asyncHandler(unsaveEvent));

export default router;



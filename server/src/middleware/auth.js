import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const COOKIE_NAME = 'campus_session';

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  };
}

export function signSession(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new HttpError(401, 'UNAUTHENTICATED', 'Please sign in to continue.');
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'Your account could not be found. Please sign in again.');
  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(payload.sub) || undefined;
  } catch {
    // Public browsing remains available when a stale session cookie is present.
  }
  return next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpError(403, 'FORBIDDEN', 'You do not have permission to do that.'));
  }
  return next();
};


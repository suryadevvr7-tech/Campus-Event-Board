import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
export function originGuard(req, _res, next) {
  if (safeMethods.has(req.method)) return next();
  const allowed = new Set([env.CLIENT_ORIGIN, env.FRONTEND_URL, `${req.protocol}://${req.get('host')}`]);
  const origin = req.get('origin');
  if (origin && !allowed.has(origin)) return next(new HttpError(403, 'ORIGIN_NOT_ALLOWED', 'This request origin is not allowed.'));
  return next();
}

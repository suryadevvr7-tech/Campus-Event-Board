import { HttpError } from '../utils/httpError.js';

export function notFoundHandler(_req, _res, next) {
  next(new HttpError(404, 'NOT_FOUND', 'The requested resource was not found.'));
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 11000) {
    return res.status(409).json({ error: { code: 'DUPLICATE_VALUE', message: 'An account with that email already exists.' } });
  }
  const status = error instanceof HttpError ? error.status : (error.name === 'CastError' ? 400 : 500);
  const code = error instanceof HttpError ? error.code : (error.name === 'CastError' ? 'INVALID_ID' : 'INTERNAL_ERROR');
  const message = error instanceof HttpError ? error.message : (status === 400 ? 'The supplied ID is invalid.' : 'Something went wrong. Please try again.');
  if (status >= 500) console.error(error);
  const body = { error: { code, message } };
  if (error instanceof HttpError && error.details) body.error.details = error.details;
  return res.status(status).json(body);
}


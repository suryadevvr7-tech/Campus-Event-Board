import { HttpError } from '../utils/httpError.js';
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(new HttpError(400, 'VALIDATION_ERROR', 'Please check the submitted information.', result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))));
    req.validated ??= {};
    req.validated[source] = result.data;
    if (source !== 'query') req[source] = result.data;
    return next();
  };
}

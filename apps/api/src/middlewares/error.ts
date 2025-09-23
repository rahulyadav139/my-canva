import { ZodError } from 'zod';

import { AppError, ErrorCode } from '@repo/shared/errors';

import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (err, _, res) => {
  let status = 500;
  let code: string = ErrorCode.INTERNAL_ERROR;
  let message = 'Internal Server Error';
  let details: unknown;

  if (err instanceof ZodError) {
    status = 422;
    code = ErrorCode.VALIDATION_FAILED;
    message = 'Validation failed';
    details = formatZodError(err);
  } else if (err instanceof AppError) {
    ({ status, code, message } = err);
    details = err.context;
  } else if (
    err &&
    typeof err === 'object' &&
    'status' in err &&
    typeof err.status === 'number'
  ) {
    status = err.status;
    code =
      'code' in err && typeof err.code === 'string'
        ? err.code
        : ErrorCode.INTERNAL_ERROR;
    message =
      'message' in err && typeof err.message === 'string'
        ? err.message
        : message;
  } else if (typeof err === 'string') {
    message = err;
  } else if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof err.message === 'string'
  ) {
    message = err.message;
  }

  const errorInfo = {
    code,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  };

  return res.status(status).json(errorInfo);
};

export function formatZodError(err: ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of err.issues) {
    const path = issue.path.join('.') || 'root';
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path]?.push(issue.message);
  }

  return fieldErrors;
}

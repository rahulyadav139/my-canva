import { ErrorCode } from './error-code';

interface IAppError {
  code: string;
  status: number;
  message: string;
  context?: Record<string, unknown>;
}

export class AppError extends Error implements IAppError {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    status: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.isOperational = isOperational;
    this.context = context;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  static validation(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorCode.BAD_REQUEST, 422, true, context);
  }

  static badRequest(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorCode.BAD_REQUEST, 400, true, context);
  }

  static unauthorized(
    message: string = 'Unauthorized',
    context?: Record<string, unknown>,
  ) {
    return new AppError(message, ErrorCode.UNAUTHORIZED, 401, true, context);
  }

  static conflict(
    message: string = 'Conflict',
    context?: Record<string, unknown>,
  ) {
    return new AppError(
      message,
      ErrorCode.RESOURCE_CONFLICT,
      409,
      true,
      context,
    );
  }

  static forbidden(
    message: string = 'Forbidden',
    context?: Record<string, unknown>,
  ) {
    return new AppError(
      message,
      ErrorCode.PERMISSION_DENIED,
      403,
      true,
      context,
    );
  }

  static notFound(
    message: string = 'Not found',
    context?: Record<string, unknown>,
  ) {
    return new AppError(message, ErrorCode.NOT_FOUND, 404, true, context);
  }

  static internal(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorCode.INTERNAL_ERROR, 500, false, context);
  }

  static database(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorCode.DATABASE_ERROR, 500, false, context);
  }

  static network(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorCode.NETWORK_FAILURE, 503, true, context);
  }

  static externalService(message: string, context?: Record<string, unknown>) {
    return new AppError(
      message,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      503,
      false,
      context,
    );
  }
}

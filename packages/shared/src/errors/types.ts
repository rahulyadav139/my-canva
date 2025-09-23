export interface ErrorContext {
  userId?: string;
  correlationId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  status?: number;
  responseData?: unknown;
  requestData?: unknown;
  timestamp: string;
}

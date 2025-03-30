export interface ApiRequestLog {
  path: string;
  method: string;
  userId: string;
  requestBody: string;
  timestamp: Date;
  ip?: string;
}

export interface ApiResponseLog {
  path: string;
  statusCode: number;
  responseBody: string;
  timestamp: Date;
}

export interface ApiErrorLog {
  path: string;
  statusCode: number;
  errorMessage: string;
  timestamp: Date;
  stack?: string;
} 
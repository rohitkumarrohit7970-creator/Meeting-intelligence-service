import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export interface ExtendedRequest extends Request {
  traceId?: string;
}

export const requestTraceMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // Prefer a request-supplied trace ID, otherwise generate one safely.
  let traceId = req.headers['x-trace-id'] as string;

  if (!traceId) {
    const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
    traceId = randomUUID ? randomUUID() : `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);
  next();
};

export const loggingMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      timestamp: new Date().toISOString(),
      traceId: req.traceId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
};

export const unifiedResponseMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode >= 400) {
      return originalJson.call(this, {
        traceId: req.traceId,
        success: false,
        error: data.error || {
          code: data.code || 'INTERNAL_SERVER_ERROR',
          message: data.message || 'An unexpected error occurred',
        },
      });
    }
    return originalJson.call(this, {
      traceId: req.traceId,
      success: true,
      data: data,
    });
  };
  next();
};

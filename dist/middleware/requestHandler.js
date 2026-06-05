import * as crypto from 'node:crypto';
import logger from '../utils/logger.js';
export const requestTraceMiddleware = (req, res, next) => {
    // Use crypto.randomUUID if available, otherwise fallback to a timestamp-based ID
    let traceId = req.headers['x-trace-id'];
    if (!traceId) {
        try {
            traceId = crypto.randomUUID();
        }
        catch (e) {
            traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }
    }
    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);
    next();
};
export const loggingMiddleware = (req, res, next) => {
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
export const unifiedResponseMiddleware = (req, res, next) => {
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

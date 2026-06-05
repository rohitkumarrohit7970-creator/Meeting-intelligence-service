import logger from '../utils/logger.js';
export class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
    }
}
export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Internal Server Error';
    logger.error({
        traceId: req.traceId,
        method: req.method,
        path: req.path,
        status: statusCode,
        error: {
            code,
            message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
    });
    res.status(statusCode).json({
        error: {
            code,
            message,
        },
    });
};

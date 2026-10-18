import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function notFoundHandler(_req: Request, res: Response): void {
    res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
    // Handle multer specific errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ error: 'File size exceeds 5MB limit' });
            return;
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            res.status(400).json({ error: 'Too many files. Maximum allowed is 5' });
            return;
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({ error: `Unexpected upload field: ${err.field ?? 'unknown'}` });
            return;
        }
        res.status(400).json({ error: err.message });
        return;
    }
    // Handle generic multer fileFilter errors
    if (err.message === 'Only image files are allowed') {
        res.status(400).json({ error: err.message });
        return;
    }
    // Handle body parser syntax errors (e.g. malformed JSON)
    if ('status' in err && err.status === 400 && 'body' in err) {
        res.status(400).json({ error: 'Invalid JSON payload' });
        return;
    }
    const statusCode = ('statusCode' in err && typeof err.statusCode === 'number')
        ? err.statusCode
        : ('status' in err && typeof err.status === 'number')
            ? err.status
            : 500;
    // Log error details server-side for debugging
    console.error('[ServerError]', {
        name: err.name,
        message: err.message,
        status: statusCode,
    });
    const clientMessage = statusCode >= 500 ? 'Internal server error' : err.message;
    res.status(statusCode).json({ error: clientMessage });
}

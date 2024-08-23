export class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
    }
}

export const customErro = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err.message);
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message,
    });
}

export const asyncHandler = (func) => (req, res, next) => { Promise.resolve(func(req, res, next)).catch(next) }
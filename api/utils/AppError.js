class AppError extends Error {
    constructor(message, statusCode, redirectTo = null) {
        super(message);
        this.statusCode = statusCode;

        this.redirectTo = redirectTo;
        this.isOperational = true;

        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    }
}

module.exports = AppError;

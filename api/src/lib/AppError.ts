export type ErrorType = {
    message: string;
    statusCode: number;
    isOperational: boolean;
    status: string;
} & Error;

class AppError extends Error implements ErrorType {
    message: string;
    statusCode: number;

    isOperational: boolean;
    status: string;
    redirectTo?: string;

    constructor(message: string, statusCode: number, redirectTo?: string) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = this.statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.redirectTo = redirectTo;
    }
}

export default AppError;

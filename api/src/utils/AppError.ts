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

    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = this.statusCode.toString().startsWith('4') ? 'fail' : 'error';
    }
}

export default AppError;

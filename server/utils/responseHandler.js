class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.stack = stack;
        this.data = null;

        if(stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class ApiResponse {
    static sendSuccess(res, data, message = "Request successful", statusCode = 200) {
        res.status(statusCode).json({
            status: "success",
            message,
            data
        });
    }

    static sendError(res, error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        const errors = error.errors || [];

        res.status(statusCode).json({
            status: "error",
            message,
            errors,
            // Development/Debugging ke liye stack, production mein ise hatayein
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export { ApiResponse, ApiError };

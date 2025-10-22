import { ApiResponse } from "../utils/responseHandler.js"

const globalErrorHandler = (err, req, res, next) => {
    ApiResponse.sendError(res, err);
}

export default globalErrorHandler;
const {
    getInvalidRequestResponse,
    getNotFoundResponse,
    getUnAuthorizeResponse,
    getInternalServerErrorResponse,
} = require("./Response");

const ResponseManager = require("./ResponseManager");

const {
    InvalidRequestException,
    NotFoundException,
    UnAuthorizeException,
    BaseError,
} = require("./Exception");

module.exports = (err, req, res, next) => {
    console.error("ERROR:", err);

    // Validation / Bad Request
    if (err instanceof InvalidRequestException) {
        return ResponseManager.send(
            res,
            getInvalidRequestResponse(err.message),
            null,
        );
    }

    // Not Found
    if (err instanceof NotFoundException) {
        return ResponseManager.send(
            res,
            getNotFoundResponse(err.message),
            null,
        );
    }

    // Unauthorized
    if (err instanceof UnAuthorizeException) {
        return ResponseManager.send(
            res,
            getUnAuthorizeResponse(err.message),
            null,
        );
    }

    // Fallback Internal Error
    return ResponseManager.send(res, getInternalServerErrorResponse(), null);
};

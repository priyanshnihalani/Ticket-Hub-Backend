const { StatusCodes } = require("http-status-codes");

class BaseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = "Error";
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidRequestException extends BaseError {
    constructor(message = "Invalid request") {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

class NotFoundException extends BaseError {
    constructor(message = "Not found") {
        super(message, StatusCodes.NOT_FOUND);
    }
}

class UnAuthorizeException extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

class InternalServerException extends BaseError {
    constructor(message = "Internal server error") {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    BaseError,
    InvalidRequestException,
    NotFoundException,
    UnAuthorizeException,
    InternalServerException
};

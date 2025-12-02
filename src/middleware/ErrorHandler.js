const MessageConstant = require("../constant/MessageConstant");
const MessageConstants = require("../constant/MessageConstant");
const {
    InvalidRequestException,
    NotFoundException,
} = require("../utils/Exception");
const {
    getInternalServerErrorResponse,
    getInvalidRequestResponse,
    getNotFoundException,
} = require("../utils/Response");
const { StatusCodes } = require("http-status-codes");

function errorHandler(err, req, res, next) {
    let errorMessage = err.message
        ? stripAnsiCodes(err.message)
        : MessageConstants.INTERNAL_SERVER_ERROR;
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(StatusCodes.OK).json({
        data: null,
        status: new Response({
            code: statusCode,
            status: MessageConstant.ERROR,
            description: errorMessage,
        }),
    });
}

function stripAnsiCodes(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*[JKmsu]/g, "");
}

module.exports = errorHandler;

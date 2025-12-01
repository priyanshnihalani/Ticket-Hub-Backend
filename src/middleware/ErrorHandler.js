const MessageConstants = require('../constant/MessageConstant');
const { InvalidRequestException, NotFoundException } = require('../utils/Exception');
const { getInternalServerErrorResponse, getInvalidRequestResponse, getNotFoundException } = require('../utils/Response');
const { StatusCodes } = require('http-status-codes');

function errorHandler(err, req, res, next) {
    let errorMessage = err.message ? stripAnsiCodes(err.message) : '';
    if (err instanceof InvalidRequestException) {
        res.status(StatusCodes.OK).json({ data: null, status: getInvalidRequestResponse(errorMessage || MessageConstants.INVALID_REQUEST_DESCRIPTION) });
    } else if (err instanceof NotFoundException) {
        res.status(StatusCodes.OK).json({ data: null, status: getNotFoundException(errorMessage || MessageConstants.NO_DATA_FOUND) });
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: null, status: getInternalServerErrorResponse() });
    }
}

function stripAnsiCodes(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');
}

module.exports = errorHandler;

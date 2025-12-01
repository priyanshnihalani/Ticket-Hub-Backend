const TicketService = require('../service/TicketService');
const ResponseManager = require('../utils/ResponseManager');
const MessageConstant = require('../constant/MessageConstant');
const { getOkResponse, getInvalidRequestResponse } = require('../utils/Response');
const { NotFoundException } = require('../utils/Exception');

class TicketController {

    addTicket = async (req, res, next) => {
        try {
            const result = await TicketService.addTicket(req?.body);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.TICKET_ADDED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log('Error in addTicket:', error);
            next(error);
        }
    }

    getTicketById = async (req, res, next) => {
        try {
            const result = await TicketService.getTicketById(req?.params?.id);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.SUCCESS)
            );

        } catch (error) {
            console.log('Error in getTicketById:', error);
            next(error);
        }
    }

    updateTicketById = async (req, res, next) => {
        try {
            const result = await TicketService.updateTicketById(req?.params?.id, req?.body);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.TICKET_UPDATED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log('Error in updateTicketById:', error);
            next(error);
        }
    }

    deleteTicketById = async (req, res, next) => {
        try {
            const result = await TicketService.deleteTicketById(req?.params?.id);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.TICKET_DELETED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log('Error in deleteTicketById:', error);
            next(error);
        }
    }

    getAllTicket = async (req, res, next) => {
        try {
            const result = await TicketService.getAllTicket();

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.TICKETS_FOUND_SUCCESSFULLY)
            );

        } catch (error) {
            console.log('Error in getAllTicket:', error);
            next(error);
        }
    }

    getTicketListByFilterSort = async (req, res, next) => {
        try {
            const result = await TicketService.getTicketListByFilterSort(req?.body);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.SUCCESS)
            );

        } catch (error) {
            console.log('Error in getTicketListByFilterSort:', error);
            next(error);
        }
    }

    exportExcelTickets = async (req, res, next) => {
        try {
            const buffer = await TicketService.exportExcelTickets(req?.body);
            if (!buffer) throw new NotFoundException(MessageConstant.NO_DATA_FOUND);

            res.status(200);
            res.setHeader("Content-Disposition", 'attachment; filename="Tickets.xlsx"');
            res.setHeader("Content-Type", "application/vnd.ms-excel");
            return res.end(buffer, "binary");

        } catch (error) {
            console.log("Error in exportExcelTickets:", error);
            next(error);
        }
    }
}

module.exports = new TicketController();

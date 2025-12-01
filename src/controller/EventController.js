const EventService = require('../service/EventService');
const ResponseManager = require('../utils/ResponseManager');
const MessageConstant = require('../constant/MessageConstant');
const { getOkResponse, getInvalidRequestResponse } = require('../utils/Response');

class EventController {

    addEvent = async (req, res, next) => {
        try {
            const userId = req?.user?.data?.id;
            const result = await EventService.addEvent(req?.body, userId);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.EVENT_ADDED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log("Error in addEvent:", error);
            next(error);
        }
    }

    getEventById = async (req, res, next) => {
        try {
            const result = await EventService.getEventById(req?.params?.id);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.SUCCESS)
            );

        } catch (error) {
            console.log("Error in getEventById:", error);
            next(error);
        }
    }

    updateEventById = async (req, res, next) => {
        try {
            const result = await EventService.updateEventById(
                req?.params?.id, req?.body
            );

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.EVENT_UPDATED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log("Error in updateEventById:", error);
            next(error);
        }
    }

    deleteEventById = async (req, res, next) => {
        try {
            const result = await EventService.deleteEventById(req?.params?.id);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.EVENT_DELETED_SUCCESSFULLY)
            );

        } catch (error) {
            console.log("Error in deleteEventById:", error);
            next(error);
        }
    }

    getAllEvent = async (req, res, next) => {
        try {
            const result = await EventService.getAllEvent();

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.EVENTS_FOUND_SUCCESSFULLY)
            );

        } catch (error) {
            console.log("Error in getAllEvent:", error);
            next(error);
        }
    }

    getEventListByFilterSort = async (req, res, next) => {
        try {
            const result = await EventService.getEventListByFilterSort(req?.body);

            if (!result?.success) {
                return ResponseManager.GeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return ResponseManager.GeneralResponse(
                res, result.body, getOkResponse(MessageConstant.SUCCESS)
            );

        } catch (error) {
            console.log("Error in getEventListByFilterSort:", error);
            next(error);
        }
    }
}

module.exports = new EventController();

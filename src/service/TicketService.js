const MessageConstant = require("../constant/MessageConstant");
const TicketRepository = require("../repository/TicketRepository");
const {
    InvalidRequestException,
    NotFoundException,
} = require("../utils/Exception");
const ExcelJS = require("exceljs");

class TicketService {
    async addTicket(data) {
        try {
            if (!data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.addTicket(data);
            return { success: true, body: result.dataValues };
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            if (!id)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.getTicketById(id);
            if (!result)
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async updateTicketById(id, data) {
        try {
            if (!id || !data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const [, updatedResult] = await TicketRepository.updateTicketById(
                id,
                data,
            );
            return { success: true, body: updatedResult?.[0] || null };
        } catch (error) {
            throw error;
        }
    }

    async deleteTicketById(id) {
        try {
            if (!id)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.deleteTicketById(id);
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getAllTicket() {
        try {
            const result = await TicketRepository.getAllTicket();
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getTicketListByFilterSort(req) {
        try {
            if (!req || !req?.filter)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.getTicketListByFilterSort(
                req?.filter,
                req?.sort,
                req?.page,
            );
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async exportExcelTickets(req) {
        try {
            // Get all ticket data
            const result = await TicketRepository.getTicketListByFilterSort(
                { filter: req?.filter, isSkipPagination: true },
                req?.sort,
            );
            if (!result?.length)
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            // Create workbook & sheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Tickets");
            // Define Excel columns
            worksheet.columns = [
                { header: "Sr No.", width: 5 },
                { header: "Event Name", width: 25 },
                {
                    header: "Event Date",
                    width: 15,
                    style: { numFmt: "dd-mm-yyyy" },
                },
                { header: "Event Time", width: 12 },
                { header: "No. of Tickets", width: 15 },
                { header: "Price", width: 15, style: { numFmt: "0.00" } },
            ];
            // Add rows
            const formatTime = (timeString) => {
                if (!timeString) return "N/A";
                const [hours, minutes] = timeString.split(":");
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(minutes);
                return date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
            };
            const formatDate = (isoDate) => {
                if (!isoDate) return "N/A";
                return new Date(isoDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            };

            result.forEach((t, idx) => {
                const plainData = t.get({ plain: true });

                const eventDate = formatDate(plainData?.event?.date);
                const eventTime = formatTime(plainData?.event?.time);

                worksheet.addRow([
                    idx + 1,
                    plainData?.event?.title || "N/A",
                    eventDate,
                    eventTime,
                    plainData?.seats,
                    plainData?.price,
                ]);
            });
            // Set header bold
            worksheet.getRow(1).font = { bold: true };
            const buffer = await workbook.xlsx.writeBuffer();
            if (!buffer)
                throw new InvalidRequestException(
                    MessageConstant.NO_DATA_FOUND,
                );
            return buffer;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TicketService();

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

    async exportExcelTickets(ticketData) {
        const tickets = Array.isArray(ticketData)
            ? ticketData
            : [ticketData];

        if (!tickets.length) {
            throw new NotFoundException("No ticket data received");
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tickets");

        worksheet.columns = [
            { header: "Sr No.", width: 8 },
            { header: "User Name", width: 12 },
            { header: "Event Name", width: 25 },
            { header: "Event Date", width: 18 },
            { header: "Event Time", width: 15 },
            { header: "Tickets", width: 20 },
            { header: "Status", width: 15 },
        ];

        tickets.forEach((ticket, index) => {
            worksheet.addRow([
                index + 1,
                ticket.user || "N/A",
                ticket.eventName || ticket.event || "N/A",
                ticket.date || "N/A",
                ticket.time || "N/A",
                ticket.tickets || "N/A",
                ticket.status || "N/A",
            ]);
        });

        worksheet.getRow(1).font = { bold: true };

        return workbook.xlsx.writeBuffer();
    }

}

module.exports = new TicketService();

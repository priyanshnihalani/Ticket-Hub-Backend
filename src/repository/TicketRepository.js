const { Sequelize } = require('sequelize');
const Ticket = require('../model/Ticket');
const Event = require('../model/Event');
const User = require('../model/User');
const { getPaginationResponse } = require('../utils/Response');

class TicketRepository {

    addTicket = async (data) => {
        return await Ticket.create(data);
    }

    getTicketById = async (id) => {
        return await Ticket.findAll({
            where: { userId: id, softDelete: false },
            include: [
                { model: Event, as: 'event', attributes: ["id", "title", "date", "time"] },
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ]
        });
    };

    updateTicketById = async (id, data) => {
        return await Ticket.update(data, {
            where: { id },
            raw: true,
            returning: true
        })
    }

    getAllTicket = async () => {
        return await Ticket.findAll({
            where: { softDelete: false },
            include: [
                { model: Event, as: 'event' },
                { model: User, as: 'user' }
            ]
        });
    };

    deleteTicketById = async (id) => {
        return await Ticket.update({ softDelete: true }, {
            where: { id }
        });
    };

    getTicketListByFilterSort = async (filter, sort, page) => {
        const whereClause = this.getWhereClause(filter);
        const { sortBy = 'id', orderBy = 'ASC' } = sort || {}
        const { pageNumber = 0, pageLimit = 10 } = page || {}
        const isSkipPagination = filter?.isSkipPagination || false

        const tickets = await Ticket.findAndCountAll({
            where: whereClause,
            include: [
                { model: Event, as: 'event' },
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ],
            order: [[Sequelize.col(sortBy), orderBy]],
            ...(!isSkipPagination && {
                offset: pageNumber * pageLimit,
                limit: pageLimit
            })
        });

        if (isSkipPagination) return tickets?.rows || []
        return getPaginationResponse(tickets, page);
    }

    getWhereClause = (criteria) => {
        const whereClause = {};
        const { ids, softDelete, eventIds, userIds } = criteria;

        whereClause.softDelete = (softDelete != null) ? softDelete : false;

        if (ids) whereClause.id = ids;
        if (eventIds) whereClause.eventId = eventIds;
        if (userIds) whereClause.userId = userIds;

        return whereClause;
    }
}

module.exports = new TicketRepository();

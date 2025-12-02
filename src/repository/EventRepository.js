const { Op, Sequelize } = require("sequelize");
const Event = require("../model/Event");
const User = require("../model/User");
const Ticket = require("../model/Ticket");
const { getPaginationResponse } = require("../utils/Response");

class EventRepository {
    addEvent = async (data) => {
        return await Event.create(data);
    };

    getEventById = async (id) => {
        return await Event.findOne({
            where: { id, softDelete: false },
            include: [
                {
                    model: Ticket,
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
            ],
        });
    };

    updateEventById = async (id, data) => {
        return await Event.update(data, {
            where: { id },
            raw: true,
            returning: true,
        });
    };

    getAllEvent = async (isAdminEvent) => {
        const today = new Date()

        const totalBookings = await Ticket.count({
            where: { softDelete: false },
        });

        const totalRevenue = await Ticket.sum("price", {
            where: { softDelete: false },
        });

        const events = await Event.findAll({
            where: {
                softDelete: false, ...(isAdminEvent ? {} : { active: true }),
                ...(isAdminEvent ? {} : {date: {[Sequelize.Op.gt]: today}})
            },

            attributes: {
                include: [
                    // Total seats booked (SAFE SUBQUERY)
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(json_array_length(t."seats")), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id 
                            AND t."softDelete" = true
                        )
                    `),
                        "cancelledCount"
                    ],
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(json_array_length(t."seats")), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id 
                            AND t."softDelete" = false
                        )
                    `),
                        "bookingCount",
                    ],

                    // Total revenue (SAFE SUBQUERY)
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(t."price"), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id
                            AND t."softDelete" = false
                        )
                    `),
                        "bookingPrice",
                    ],

                    // Seats array from Ticket (SAFE SUBQUERY)
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(JSON_AGG(t."seats"), '[]')
                            FROM tickets t
                            WHERE t."eventId" = events.id
                            AND t."softDelete" = false
                        )
                    `),
                        "allSeats",
                    ],
                ],
            },

            order: [["id", "ASC"]],
        });

        return {
            totalBookings,
            totalRevenue,
            events,
        };
    };

    deleteEventById = async (id) => {
        return await Event.update(
            { softDelete: true },
            {
                where: { id },
            },
        );
    };

    getEventListByFilterSort = async (filter, sort, page) => {
        const whereClause = this.getWhereClause(filter);
        const { sortBy = "id", orderBy = "ASC" } = sort || {};
        const { pageNumber = 0, pageLimit = 10 } = page || {};
        const isSkipPagination = filter?.isSkipPagination || false;

        const events = await Event.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [[Sequelize.col(sortBy), orderBy]],
            ...(!isSkipPagination && {
                offset: pageNumber * pageLimit,
                limit: pageLimit,
            }),
        });

        if (isSkipPagination) return events?.rows || [];
        return getPaginationResponse(events, page);
    };

    getWhereClause = (criteria) => {
        const whereClause = {};
        const {
            ids,
            softDelete,
            statuses,
            inActive,
            startDate,
            endDate,
            month,
            year,
            search,
            userIds,
        } = criteria;

        whereClause.softDelete = softDelete != null ? softDelete : false;

        if (ids) whereClause.id = ids;
        if (userIds) whereClause.userId = userIds;
        if (statuses) whereClause.status = statuses;
        if (inActive != null) whereClause.inActive = inActive;

        whereClause[Op.and] = [];

        if (month)
            whereClause[Op.and].push(
                Sequelize.literal(
                    `EXTRACT(MONTH FROM "events"."date") = ${month}`,
                ),
            );
        if (year)
            whereClause[Op.and].push(
                Sequelize.literal(
                    `EXTRACT(YEAR FROM "events"."date") = ${year}`,
                ),
            );

        if (startDate && endDate)
            whereClause[Op.and].push({
                date: { [Op.between]: [startDate, endDate] },
            });
        else if (startDate)
            whereClause[Op.and].push({ date: { [Op.gte]: startDate } });
        else if (endDate)
            whereClause[Op.and].push({ date: { [Op.lte]: endDate } });

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        return whereClause;
    };
}

module.exports = new EventRepository();

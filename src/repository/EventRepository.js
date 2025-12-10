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

    getAllEvent = async (isAdminEvent, isEventPage) => {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const whereCondition = {
            softDelete: false,
            ...(isAdminEvent ? {} : { active: true }),
        };

        if (!isAdminEvent) {
            whereCondition.date = { [Sequelize.Op.gt]: now };
        }

        const apply24HoursFilter = isAdminEvent && !isEventPage;

        const timeCondition = apply24HoursFilter
            ? `AND t."createdAt" >= '${last24Hours.toISOString()}'`
            : "";

        const totalBookings = await Ticket.findOne({
            attributes: [
                [
                    Sequelize.literal(
                        `COALESCE(SUM(json_array_length("seats")), 0)`,
                    ),
                    "totalSeatsBooked",
                ],
            ],
            where: {
                softDelete: false,
                ...(apply24HoursFilter && {
                    createdAt: { [Sequelize.Op.gte]: last24Hours },
                }),
            },
            raw: true,
        });

        const totalRevenue = await Ticket.findOne({
            attributes: [
                [
                    Sequelize.literal(`COALESCE(SUM("price"), 0)`),
                    "totalRevenue",
                ],
            ],
            where: {
                softDelete: false,
                ...(apply24HoursFilter && {
                    createdAt: { [Sequelize.Op.gte]: last24Hours },
                }),
            },
            raw: true,
        });

        const events = await Event.findAll({
            where: whereCondition,
            attributes: {
                include: [
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
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(json_array_length(t."seats")), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id
                            AND t."softDelete" = false
                            ${timeCondition}
                        )
                    `),
                        "bookingCount",
                    ],
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(json_array_length(t."seats")), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id
                            AND t."softDelete" = true
                            ${timeCondition}
                        )
                    `),
                        "cancelledCount",
                    ],
                    [
                        Sequelize.literal(`
                        (
                            SELECT COALESCE(SUM(t."price"), 0)
                            FROM tickets t
                            WHERE t."eventId" = events.id
                            AND t."softDelete" = false
                            ${timeCondition}
                        )
                    `),
                        "bookingRevenue",
                    ],
                ],
            },
            order: [["id", "ASC"]],
        });

        return {
            totalBookings: Number(totalBookings.totalSeatsBooked),
            totalRevenue: Number(totalRevenue.totalRevenue),
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
        if (inActive != null) whereClause.active = inActive;

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

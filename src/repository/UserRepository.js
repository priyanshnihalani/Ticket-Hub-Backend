const { Op, Sequelize } = require("sequelize");
const User = require("../model/User");
const Ticket = require("../model/Ticket");
const Event = require("../model/Event");
const getInitials = require("../helper/getIntials");
const { InvalidRequestException } = require("../utils/Exception");
const { getPaginationResponse } = require("../utils/Response");

class UserRepository {
    // Create User (with duplicate check)
    async addUser(data) {
        const existingUser = await User.findOne({
            where: { email: data.email, softDelete: false },
        });

        if (existingUser) {
            throw new InvalidRequestException(
                "User already exists with this email",
            );
        }

        return await User.create(data);
    }

    // Get user for login by email
    async loginUser(email) {
        return await User.findOne({
            where: { email, softDelete: false },
        });
    }

    // Get user by ID including tickets & event details
    async getUserById(id) {
        const user = await User.findOne({
            where: { id },
            include: [
                {
                    model: Ticket,
                    as: "tickets",
                    required: false,
                    include: [
                        {
                            model: Event,
                            as: "event",
                            attributes: [
                                "id",
                                "title",
                                "date",
                                "time",
                                "price",
                            ],
                        },
                    ],
                },
            ],
        });

        if (!user) return null;

        const tickets = user.tickets || [];

        return {
            ...user.dataValues,
            initials: getInitials(user.name),
            totalBookings: tickets.filter((t) => !t.softDelete).length,
            cancelledBookings: tickets.filter((t) => t.softDelete).length,
        };
    }

    // Fetch user only by email (reusable for validation)
    async getUserByEmail(email) {
        return await User.findOne({
            where: { email, softDelete: false },
        });
    }

    // Update User
    async updateUserById(id, data) {
        return await User.update(data, {
            where: { id },
            returning: true,
        });
    }

    // Soft Delete
    async deleteUserById(id) {
        return await User.update({ softDelete: true }, { where: { id } });
    }

    // Get all users
    async getAllUsers() {
        return await User.findAll({
            where: { softDelete: false },
        });
    }

    // Filter / Sort / Pagination
    async getUserListByFilterSort(filter = {}, sort = {}, page = {}) {
        const whereClause = this.buildWhereClause(filter);

        const { sortBy = "id", orderBy = "ASC" } = sort || {};

        const { pageNumber = 0, pageLimit = 10 } = page || {};

        const skipPagination = filter?.isSkipPagination || false;

        const result = await User.findAndCountAll({
            where: whereClause,
            order: [[Sequelize.col(sortBy), orderBy]],
            ...(!skipPagination && {
                offset: pageNumber * pageLimit,
                limit: pageLimit,
            }),
        });

        return skipPagination
            ? result.rows
            : getPaginationResponse(result, page);
    }

    // Build dynamic where clause for filtering
    buildWhereClause(criteria = {}) {
        const where = {};
        const { ids, softDelete, roles, search } = criteria;

        where.softDelete = softDelete ?? false;

        if (ids?.length) {
            where.id = ids;
        }

        if (roles?.length) {
            where.role = roles;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }

        return where;
    }
}

module.exports = new UserRepository();

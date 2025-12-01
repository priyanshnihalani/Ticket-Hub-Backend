const { DataTypes } = require("sequelize");
const db = require("../config/db.config");

const Ticket = db.define("tickets", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    softDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
    { tableName: "tickets" }
);

module.exports = Ticket
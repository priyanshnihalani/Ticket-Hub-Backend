const { DataTypes } = require("sequelize");
const db = require("../config/db.config");

const User = db.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },

    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user"
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    softDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "users"
});

module.exports = User;

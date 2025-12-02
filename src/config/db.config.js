const { Sequelize } = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres", // or mysql, mariadb...
    logging: false,
});

module.exports = db;

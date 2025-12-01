const { Sequelize } = require('sequelize');
const config = require('./db.config.json');

const env = process.env.NODE_ENV || 'development';
const { database } = config[env];

const db = new Sequelize(database.db_name, database.username, database.password, {
    host: database.host,
    dialect: database.dialect,
    logging: database.logging,
});

module.exports = db;
const db = require("../config/db.config");

require("../association/index");

const User = require("./User");
const Event = require("./Event");
const Ticket = require("./Ticket");

db.sync({ alter: true }) // or { force: true }
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = {
  db,
  User,
  Event,
  Ticket,
};

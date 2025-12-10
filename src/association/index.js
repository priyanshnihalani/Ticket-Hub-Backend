const User = require("../model/User");
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");

// USER → TICKET
User.hasMany(Ticket, { foreignKey: "userId", as: "tickets" });
Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });

// EVENT → TICKET
Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });

Event.belongsTo(User, {
    foreignKey: "createdBy",
    as: "user",
});

User.hasMany(Event, {
    foreignKey: "createdBy",
    as: "events",
});

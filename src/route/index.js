const express = require("express");
const router = express.Router();

// All routes file imported here
const eventRoute = require("./EventRoute");
const ticketRoute = require("./TicketRoute");
const userRoute = require("./UserRoute");

// check health
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// All routes file uses here
router.use("/events", eventRoute);
router.use("/tickets", ticketRoute);
router.use("/users", userRoute);
module.exports = router;

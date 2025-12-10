const express = require("express");
const router = express.Router();
const EventController = require("../controller/EventController");

router.post("/", EventController.addEvent);
router.post("/list", EventController.getAllEvent);
router.post("/filter", EventController.getEventListByFilterSort);
router.get("/:id", EventController.getEventById);
router.put("/:id", EventController.updateEventById);
router.delete("/:id", EventController.deleteEventById);

module.exports = router;

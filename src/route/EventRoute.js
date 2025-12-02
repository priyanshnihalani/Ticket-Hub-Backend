const express = require('express');
const router = express.Router();
const EventController = require('../controller/EventController');

router.post("/", EventController.addEvent);
router.get('/:id', EventController.getEventById);
router.put('/:id', EventController.updateEventById);
router.delete('/:id', EventController.deleteEventById);
router.post('/list', EventController.getAllEvent);
router.post('/filter', EventController.getEventListByFilterSort);

module.exports = router;
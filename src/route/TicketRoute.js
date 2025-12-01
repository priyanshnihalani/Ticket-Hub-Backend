const express = require('express');
const TicketController = require('../controller/TicketController');
const router = express.Router();

router.post("/add", TicketController.addTicket);
router.get('/list/:id', TicketController.getTicketById);
router.put('/update/:id', TicketController.updateTicketById);
router.delete('/delete/:id', TicketController.deleteTicketById);
router.get('/list/', TicketController.getAllTicket);
router.post('/export/excel', TicketController.exportExcelTickets);
router.post('/filter', TicketController.getTicketListByFilterSort);

module.exports = router;
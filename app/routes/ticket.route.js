const router = require("express").Router();
const ticketController = require("../controllers/ticket.controller");

router.get("/read", ticketController.readTicket);
router.post("/create", ticketController.createTicket);
router.patch("/update:id", ticketController.updateTicket);
router.delete("/delete:id", ticketController.deleteTicket);

module.exports = router;

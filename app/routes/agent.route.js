// importer
const router = require("express").Router();
const AgentController = require("../controllers/agent.controller");
const authController = require("../controllers/auth.Controller");

router.get("/agentLogin", authController.agentLogin);

// Agent routes
router.get("/agent", AgentController.agentInfo);
router.patch("/:id/agent", AgentController.updateAgent);
router.get("/:allAgent", AgentController.getAllAgent);

// Ticket routes
router.get("/ticket", AgentController.getAllTicket);
router.get("/:ticket_id", AgentController.getAllTicketById);
router.patch("/:ticket_id", AgentController.updateTicketStatus);

module.exports = router;

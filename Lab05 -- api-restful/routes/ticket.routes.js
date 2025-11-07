const express = require("express");
const router = express.Router(); 
const controller = require("../controllers/TicketController"); 
const notificationController = require("../controllers/NotificationController");
 
router.get("/:id/notifications", notificationController.listByTicket); 
router.post("/", controller.create); 
router.get("/", controller.list); 
router.put("/:id/assign", controller.assign); 
router.put("/:id/status", controller.changeStatus); 
router.delete("/:id", controller.delete); 

module.exports = router;

const NotificationService = require("../services/NotificationService");
const service = new NotificationService();

exports.listByTicket = (req, res) => {
  const { id } = req.params;
  const notifications = service.getByTicketId(id);
  if (!notifications.length) {
    return res.status(404).json({ message: "No hay notificaciones para este ticket" });
  }
  res.status(200).json(notifications);
};


exports.list = (req, res) => {
  res.status(200).json(service.list());
};

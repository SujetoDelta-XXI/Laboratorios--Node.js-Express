const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId,
    };

    if (type === "email") {
      this.emailService.sendEmail({
        to: "correo_receptor@tecsup.edu.pe", // <- Reemplaza con el correo real
        subject: "API RESTful - Alertas del sistema de Tickets",
        htmlBody: `<h1>${message}</h1>`, // Mejor interpolar con template string
      });
    }

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }

  getByTicketId(ticketId) {
  const notifications = this.repo.findAll();
  return notifications.filter(n => n.ticketId === ticketId);
  }

}

module.exports = NotificationService;

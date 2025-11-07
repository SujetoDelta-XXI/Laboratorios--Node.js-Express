const BaseRepository = require("./BaseRepository");

class TicketRepository extends BaseRepository {
  constructor() {
    super("tickets");
  }
}

module.exports = TicketRepository;

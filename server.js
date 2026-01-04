const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

/* -------- Ticket Node -------- */
class Ticket {
  constructor(id, event, expiry) {
    this.id = id;
    this.event = event;
    this.expiry = expiry;
    this.next = null;
  }
}

/* -------- Circular Linked List -------- */
class CircularTicketList {
  constructor() {
    this.current = null;
  }

  addTicket(id, event, expiry) {
    const t = new Ticket(id, event, expiry);

    if (!this.current) {
      this.current = t;
      t.next = t;
    } else {
      t.next = this.current.next;
      this.current.next = t;
    }
  }

  removeExpired() {
    if (!this.current) return;

    let temp = this.current;
    do {
      let next = temp.next;
      if (next.expiry < Date.now()) {
        if (next === this.current) {
          if (this.current.next === this.current) {
            this.current = null;
            return;
          }
          this.current = this.current.next;
        }
        temp.next = next.next;
      } else {
        temp = temp.next;
      }
    } while (temp !== this.current);
  }

  toArray() {
    const arr = [];
    if (!this.current) return arr;

    let temp = this.current;
    do {
      arr.push({
        id: temp.id,
        event: temp.event,
        expiry: temp.expiry
      });
      temp = temp.next;
    } while (temp !== this.current);

    return arr;
  }
}

/* -------- Initialize Tickets -------- */
const tickets = new CircularTicketList();
tickets.addTicket(101, "Live Concert", Date.now() + 600000);
tickets.addTicket(102, "Metro Ride", Date.now() + 300000);
tickets.addTicket(103, "Movie Show", Date.now() + 900000);

/* -------- API -------- */
app.get("/tickets", (req, res) => {
  tickets.removeExpired();
  res.json(tickets.toArray());
});

/* -------- Start Server -------- */
app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});

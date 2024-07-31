const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  datetime: Date,
  amount: Number,
  isBooked: Boolean,
  slot: Date,
});

module.exports = mongoose.model("Slot", slotSchema);

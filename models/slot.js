const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  datetime: Date,
  amount: Number,
  isBooked: Boolean,
});

module.exports = mongoose.model("Slot", slotSchema);

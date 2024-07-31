const Slot = require("../models/slot");

const adminResolvers = {
  Query: {
    getAllSlots: async () => {
      const slots = await Slot.find();
      return slots.map((s) => ({
        datetime: s.datetime.toISOString(),
        amount: s.amount,
        id: s.id,
      }));
    },
  },
};

module.exports = adminResolvers;

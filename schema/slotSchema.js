const { buildSchema } = require("graphql");
const Slot = require("../models/slot");

const schema = buildSchema(`
    type Slot {
        id: ID
        datetime: String!
        amount: Int
        isBooked: Boolean!
    }

    type payload {
       bookedBy: String!
       dateTime: String!
       phoneNo: String!
    }
    
    type Query {
        slots(date: String!): [Slot]
    }

    type Mutation {
        bookSlot(bookedBy: String!, dateTime: String!, phoneNo: String!, amount: Int!): Slot
    }
`);

const root = {
  slots: async ({ date }) => {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const slots = await Slot.find({
      datetime: { $gte: startOfDay, $lte: endOfDay },
    });

    const times = Array.from({ length: 24 }, (_, i) => {
      const datetime = new Date(startOfDay);
      datetime.setUTCHours(i, 0, 0, 0);
      const existingSlot = slots.find(
        (slot) => slot.datetime.getTime() === datetime.getTime()
      );
      return existingSlot || { datetime, amount: 700, isBooked: false };
    });

    return times.map((slot) => ({
      ...slot,
      datetime: slot.datetime.toISOString(),
      isBooked: slot.isBooked,
      id: slot._id || null,
    }));
  },
  bookSlot: async ({ bookedBy, dateTime, phoneNo, amount }) => {
    let slot = await Slot.findOne({ datetime: dateTime });
    if (!slot) {
      slot = new Slot({
        datetime: dateTime,
        amount,
        isBooked: true,
        bookedBy,
        phoneNo,
      });
      await slot.save();
    } else if (!slot.isBooked) {
      slot.isBooked = true;
      await slot.save();
    }
    return { ...slot._doc, datetime: slot.datetime.toISOString() };
  },
};

module.exports = { schema, root };

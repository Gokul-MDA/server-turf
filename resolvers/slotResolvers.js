const { PubSub } = require("graphql-subscriptions");
const Slot = require("../models/slot");

const pubsub = new PubSub();
const SLOT_BOOKED = "SLOT_BOOKED";

const slotResolvers = {
  Query: {
    slots: async (_, { date }) => {
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
  },

  Mutation: {
    bookSlot: async (_, { bookedBy, dateTime, phoneNo, amount }) => {
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
      const slots = await Slot.find();
      pubsub.publish(SLOT_BOOKED, {
        slotBooked: { newSlot: slot, slots },
      });
      return { ...slot._doc, datetime: slot.datetime.toISOString() };
    },
  },
  Subscription: {
    slotBooked: {
      subscribe: () => pubsub.asyncIterator([SLOT_BOOKED]),
    },
  },
};

module.exports = slotResolvers;

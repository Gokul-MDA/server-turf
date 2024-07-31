const { gql } = require("apollo-server-express");

const slotSchema = gql`
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
    bookSlot(
      bookedBy: String!
      dateTime: String!
      phoneNo: String!
      amount: Int!
    ): Slot
  }

  type SlotUpdate {
    newSlot: Slot
    slots: [Slot]
  }

  type Subscription {
    slotBooked: SlotUpdate
  }
`;

module.exports = slotSchema;

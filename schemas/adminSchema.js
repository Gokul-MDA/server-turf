const { gql } = require("apollo-server-express");

const AdminSchema = gql`
  type Slot {
    id: ID
    datetime: String!
    amount: Int
  }

  type Query {
    getAllSlots: [Slot]
  }
`;
module.exports = AdminSchema;

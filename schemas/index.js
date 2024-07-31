const { mergeTypeDefs } = require("@graphql-tools/merge");
const adminSchema = require("./adminSchema");
const slotSchema = require("./slotSchema");

const typeDefs = mergeTypeDefs([adminSchema, slotSchema]);

module.exports = typeDefs;

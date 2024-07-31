const { mergeResolvers } = require("@graphql-tools/merge");
const adminResolvers = require("./adminResolvers");
const slotResolvers = require("./slotResolvers");

const resolvers = mergeResolvers([adminResolvers, slotResolvers]);

module.exports = resolvers;

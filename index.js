const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const { schema, root } = require("./schema/slotSchema");
const cors = require("cors");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://gokul:admin@cluster0.n6pnmbc.mongodb.net/bookings"
);

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000/graphql");
});

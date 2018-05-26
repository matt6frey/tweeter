require('dotenv').config();
"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const {MongoClient} = require("mongodb");
const MDB_URI =  process.env.MONGODB_URI;

var tweets;

MongoClient.connect(MDB_URI, (err, db) => {
  if (err) {
    console.error("Failed to connect to " , MDB_URI);
    throw err;
  }

  db.collection("tweets").drop();

  const seedData = require('./data-files/initial.js')(db);

  // Define routes via factory function.
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // Define routes via factory function.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
  app.use("/tweets/like", tweetsRoutes);


  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });

});
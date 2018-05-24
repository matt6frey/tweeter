"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const {MongoClient} = require("mongodb");
const MDB_URI = "mongodb://localhost:27017/tweeter";

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


  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });




});

// console.log(db);

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// // require it and pass the `db` parameter immediately:
// const DataHelpers = require("./lib/data-helpers.js")(tweets);

// // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// // so it can define routes that use it to interact with the data layer.
// const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// // Mount the tweets routes at the "/tweets" path prefix:
// app.use("/tweets", tweetsRoutes);


// app.listen(PORT, () => {
//   console.log("Example app listening on port " + PORT);
// });
//db.close();
"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection("tweets").insertOne(newTweet);
        callback(null, true);
      });
    },

    // Like a tweet
    toggleLike: function(likeStatus, callback) {
        simulateDelay(() => {
        // Update: increment by 1
        console.log(likeStatus.status);
        if(likeStatus.status === '') {
        db.collection("tweets").update({ "user.name": likeStatus.name, "content.text": likeStatus.text }, { $inc: { "likes": 1 } }, function(err, res) {
            if(err) {
              console.log(err);
            } else {
              db.collection("tweets").find({ "user.name": likeStatus.name }).forEach((x) => {
                console.log(x);
              });
              callback(null, true);
            }
          });
        } else {
          db.collection("tweets").update({ "user.name": likeStatus.name, "content.text": likeStatus.text }, { $inc: { "likes": -1 } }, function(err, res) {
            if(err) {
              console.log(err);
            } else {
              db.collection("tweets").find({ "user.name": likeStatus.name }).forEach((x) => {
                console.log(x);
              });
              callback(null, true);
            }
          });
        }
      });
      },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      simulateDelay(() => {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        var collection = db.collection("tweets").find().sort({ created_at: 1 }).toArray(function(err, res) {
          callback(null, res);
        });
      });
    }


  };
};

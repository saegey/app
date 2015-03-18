/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var sys = require('sys')
var exec = require('child_process').exec;
require('./config/socketio')(io);
require('./config/express')(app);
require('./routes')(app);

var request = require('request');
var GoogleSheetService = require('./services/google_sheet_service');
var TweetService = require("./services/tweet_service");
var HashtagService = require("./services/hashtag_service");

var usernames = [];
var numUsers = 0;
var hashTags = [];
var judge = null;
var tweet = null;
var gameStarted = false;
var hash_tag_by_user= null;
var numHashtags = null;

var TWEET_URL = "https://docs.google.com/spreadsheets/d/1azduyest2um3zrUJFvS5upGa2LO7cReg0hob6VtGCas/export?gid=625026020&format=csv";
var HASHTAG_URL = "https://docs.google.com/spreadsheets/d/1azduyest2um3zrUJFvS5upGa2LO7cReg0hob6VtGCas/export?gid=0&format=csv";

var tweetSvc = new TweetService(TWEET_URL);
var hashTagSvc = new HashtagService(HASHTAG_URL);

Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

io.on('connection', function (socket) {

  function getNewJudge() {
    return usernames[~~(Math.random() * usernames.length)];
  }

  function startGame(socket) {
    console.log(usernames);
    judge = getNewJudge();
    console.log('judge is' + judge);

    tweetSvc.getRandomTweet(function (tweets) {
      var rand = Math.floor((Math.random() * tweets.length) + 1);
      tweet = tweets[Math.floor(Math.random()*tweets.length)];

      console.log(tweet);
      hash_tag_by_user = [];
      numHashtags = usernames.length * 5;
      hashTagSvc.getHashTags(5, function(userHashTags) {
        console.log("retrieving hashtags");
        console.log("users", usernames);
        hash_tag_by_user = {};
        usernames.forEach(function (username, index) {
          var start = (index * 5) + 1;
          console.log(username);
          hash_tag_by_user[username] = userHashTags.slice(start, start + 5);
        });

        console.log("hashtags", hash_tag_by_user);

        socket.broadcast.emit('start round', {
          tweet: tweet,
          hashtags: hash_tag_by_user,
          judge: judge
        });
        // socket.in(socket.user.uuid).emit('new_msg', {msg: 'hello'});
        socket.emit('start round', {
          tweet: tweet,
          hashtags: hash_tag_by_user,
          judge: judge
        });
      });
    });
  }
  var addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('submit hashtag', function (data) {
    // we tell the client to execute 'new message'
    data.judge = judge;
    socket.broadcast.emit('send hashtag to judge', data);

    hashTags.push(data);
    console.log("hashtags " + hashTags.length);
    console.log("num users " + numUsers);

    if (hashTags.length >= numUsers - 1) {
      socket.broadcast.emit('judge is now voting', {
        username: judge,
        hashTags: hashTags
      });
    }
  });

  socket.on('new round', function (data) {
    gameStarted = true;
    startGame(socket);
  });

  socket.on('add user', function (username) {
    socket.username = username;
    console.log('add user ' + username);
    // add the client's username to the global list
    usernames.push(username);
    numUsers++;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      tweet: tweet
    });

    gameStarted = true;

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user list', {users: usernames});
    socket.emit('user list', {users: usernames});
  });

  socket.on('debug', function () {
    console.log('debug');
    socket.emit('receive debug', {
      usernames: usernames,
      gameStarted: gameStarted,
      hashTags: hashTags,
      tweet: tweet,
      user: socket.user
    });
  });

  socket.on('end round', function (data) {
    socket.broadcast.emit('send winner of round', {
      username: data.username
    });
    hashTags = [];
    startGame(socket);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      usernames.remove(socket.username);
      numUsers--;
      if (socket.username === judge) {
        startGame(socket);
      }

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log("Route: %s", config.root);
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  // console.log('The Mongodb url is: ', config.mongo.uri);
  // console.log('Facebook redirect url =: %s', config.facebook.callbackURL);
});

// Expose app
exports = module.exports = app;

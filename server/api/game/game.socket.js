var _ = require('lodash');
var when = require('when');
var Tweet = require('../tweet/tweet.model');
var Hashtag = require('../hashtag/hashtag.model'),
    Game = require('./game');

var usernames = [];
var numUsers = 0;
var hashTags = [];
var judge = null;
var tweet = null;
var gameStarted = false;
var hash_tag_by_user = null;
var numHashtags = null;
var scores = [];
var lastRoundWinner = null;
var currentGame = null;

exports.register = function(socket) {
  function getNewJudge() {
    return usernames[~~(Math.random() * usernames.length)];
  }



  function startRound(socket) {
    judge = getNewJudge();
    console.log('judge:', judge);
    console.log('players in the game: ', usernames);

    tweetSvc.getRandomTweet(function (tweets) {
      tweet = tweets[Math.floor(Math.random() * tweets.length)];

      console.log('tweet retrieved:', tweet);
      hash_tag_by_user = [];
      numHashtags = usernames.length * 5;

      hashTagSvc.getHashTags(5, function (userHashTags) {
        console.log("retrieving hashtags");
        hash_tag_by_user = {};

        usernames.forEach(function (username, index) {
          var start = (index * 5) + 1;
          hash_tag_by_user[username] = userHashTags.slice(
            start,
            start + 5
          );
        });

        socket.broadcast.emit('start round', {
          tweet: tweet,
          hashtags: hash_tag_by_user,
          judge: judge,
          scores: scores,
          lastRoundWinner: lastRoundWinner
        });
        // socket.in(socket.user.uuid).emit('new_msg', {msg: 'hello'});
        socket.emit('start round', {
          tweet: tweet,
          hashtags: hash_tag_by_user,
          judge: judge,
          scores: scores
        });
      });
    });
  }

  function startGame(socket) {
    scores = [];
    lastRoundWinner = null;

    usernames.forEach(function (username) {
      scores.push({username: username, score: 0});
    });

    startRound(socket);
  }

  // when the client emits 'new message', this listens and executes
  socket.on('submit hashtag', function (data) {
    console.log(data);
    // we tell the client to execute 'new message'
    currentGame.currentRound().userSubmitHashtag(data);
    socket.broadcast.emit('send hashtag to judge', currentGame.currentRound());

    socket.broadcast.emit(
      'judge is now voting',
      currentGame.currentRound()
    );

    if (currentGame.currentRound().checkIfAllTagsSubmitted()) {
      socket.broadcast.emit(
        'judge is now voting',
        currentGame.currentRound()
      );
    } else {
      console.log('not all votes in');
    }
  });

  socket.on('new round', function (data) {
    console.log('new round', data);
    startGame(socket);
  });

  socket.on('start game', function () {
    Game.startGame(usernames, function (game) {
      currentGame = game;
      socket.broadcast.emit('start round', game.currentRound());
      socket.emit('start round', game.currentRound());
      // socket.in(socket.user.uuid).emit('new_msg', {msg: 'hello'});
    });
  });

  socket.on('join lobby', function (username) {
    console.log('user joined lobby:', username, socket.username);
    // add the client's username to the global list
    var user = {username: username};
    socket.username = user;
    usernames.push(user);

    socket.emit('user joined', {
      user: user,
      numUsers: usernames.length,
      users: usernames
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user list', {users: usernames});
  });

  socket.on('end round', function (data) {
    console.log('end round', data);
    lastRoundWinner = {
      username: data.username,
      hashtag: data.hashtag
    };
    hashTags = [];

    scores.forEach(function (userScore) {
      if (userScore.username === data.username) {
        userScore.score++;
      }
    });
    console.log("scores: ", scores);
    startRound(socket);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    _.pull(usernames, socket.username);
    numUsers--;

    if (numUsers === 1) {
      socket.broadcast.emit('send to lobby', usernames);
    } else if (socket.username === judge) {
      startRound(socket);
    }

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: 0
    });
  });
};

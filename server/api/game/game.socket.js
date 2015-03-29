var _ = require('lodash');
var when = require('when');
var Tweet = require('../tweet/tweet.model');
var Hashtag = require('../hashtag/hashtag.model')

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
    console.log('new round', data);
    startGame(socket);
  });

  socket.on('join lobby', function (username) {
    socket.username = username;
    console.log('user joined lobby:', username);
    // add the client's username to the global list
    usernames.push(username);
    numUsers++;

    socket.emit('login', {
      username: username,
      numUsers: numUsers,
      users: usernames
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user list', {users: usernames});
  });

  socket.on('debug', function () {
    socket.emit('receive debug', {
      usernames: usernames,
      gameStarted: gameStarted,
      hashTags: hashTags,
      tweet: tweet,
      user: socket.user
    });
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
      numUsers: numUsers
    });
  });
};

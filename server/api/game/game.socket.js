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
  // when the client emits 'new message', this listens and executes
  socket.on('submit hashtag', function (user, hashtag) {
    // we tell the client to execute 'new message'
    currentGame.currentRound().userSubmitHashtag(user, hashtag);
    socket.broadcast.emit(
      'send hashtag to judge',
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

  socket.on('start game', function () {
    console.log(usernames);
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
    var user = username;
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
    currentGame.currentRound().submitJudgeVote(data);
    var lastRound = currentGame.currentRound();
    currentGame.newRound(function(game) {
      currentGame = game;
      console.log(game.rounds[0]);
      socket.emit('start round', game.currentRound(), lastRound);
      socket.broadcast.emit('start round', game.currentRound(), lastRound);
    });
    // console.log('game output', currentGame);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    _.pull(usernames, socket.username);
    // numUsers--;

    // if (numUsers === 1) {
    //   socket.broadcast.emit('send to lobby', usernames);
    // } else if (socket.username === judge) {
    //   startRound(socket);
    // }

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: 0
    });
  });
};

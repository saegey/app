'use strict';

angular.module('rehash-app')
  .controller('GameCtrl', function (
    $scope,
    $stateParams,
    socket,
    $timeout,
    chatService,
    $state,
    $rootScope) {

    console.log('GameCtrl init');

    $scope.gameState = {
      'hasntVoted'  : true,
      'gameStarted' : false,
      'score'       : 0,
      'hashTags'    : [],
      'users'       : [],
      'judge'       : null,
      'voteEnabled' : false,
      'isJudge'     : false,
      'tweet'       : null
    };

    $rootScope.username = $stateParams.username;

    console.log('stateparms', $stateParams);

    console.log('$rootScope.username', $rootScope.username);

    // $scope.toggleChat = function () {
    //   $mdSidenav('right').toggle()
    //     .then(function() {
    //       $rootScope.unreadChats = 0;
    //     });
    // };

    socket.on('connect', function () {
      //Add user
      socket.emit('join lobby', { username: $rootScope.username });
      $scope.nickname = $rootScope.username;
      // On login display welcome message
    });

    socket.on('user joined', function (data) {
      chatService.sendMessage({
         'body'     : data.user.username + ' joined the game :)',
         'isSystem' : true,
         'popToast' : true
      });

      $scope.gameState.users = data.users;
      console.log('login:users-online: ', data.users);
    });

    socket.on('user list', function (data) {
      console.log('users online:', data);
      $scope.gameState.users = data.users;
    });

    socket.on('user left', function (data) {
      console.log('user left', data);
      $scope.gameState.users = $scope.gameState.users.filter(function(user) {
        return user !== data.username;
      });

      chatService.sendMessage({
         'body'     : data.username + ' left the game :(',
         'isSystem' : true,
         'popToast' : true
      });
    });

    socket.on('send hashtag to judge', function (data) {
      if ($rootScope.username === $scope.gameState.judge.username.username) {
        console.log('judge received hashtag', data);
        $scope.gameState.hashTags.push(data);
      }
    });

    // Judge is now able to vote
    socket.on('judge is now voting', function (data) {
      console.log('judge is now voting', data);
      $scope.gameState.voteEnabled = true;
    });

    //socket.on('send to lobby', function (data) {
    //  $scope.gameState.gameStarted = false;
    //  $scope.gameState.isJudge = false;
    //  $scope.gameState.hashTags = [];
    //  $scope.gameState.tweet = false;
    //  console.log('send to lobby: ', data);
    //});

    $scope.gameState.startGame = function () {
      // Start Game
      socket.emit('start game', function () {
        $scope.gameState.gameStarted = true;
        $scope.gameState.voteEnabled = false;
      });
    };

    // sets up round and check for who is the judge
    socket.on('start round', function (data) {
      console.log('data received "start round"', data);
      $scope.gameState.lastRoundWinner = data.lastRoundWinner;

      if ($scope.gameState.lastRoundWinner) {
        var winner = $scope.gameState.lastRoundWinner;

        chatService.sendMessage({
           'body'     : 'Winner: ' + winner.username + ' - Tweet: #' + winner.hashtag.content,
           'isSystem' : true
        });
      }

      $timeout(function () {
        console.log('hide last round winner');
        $scope.gameState.lastRoundWinner = false;
      }, 12000);
      $scope.gameState.voteEnabled = false;
      $scope.gameState.judge = data.judge;
      $scope.gameState.hasntVoted = true;
      $scope.gameState.gameStarted = true;

      if ($rootScope.username === $scope.gameState.judge.username.username) {
        $scope.gameState.hashTags = [];
        $scope.gameState.isJudge = true;
        console.log('your are the judge');
      } else {
        console.log('user tags:', data.users[0].hashtags);
        $scope.gameState.hashTags = data.users[0].hashtags;
        $scope.gameState.isJudge = false;
        console.log('judge is ' + $scope.gameState.judge);
      }
      $scope.gameState.tweet = data.tweet;
    });

    // Player submits hashtag
    $scope.gameState.submitHashtag = function (hashtag) {
      // Makes judge not able to vote yet
      $scope.gameState.voteEnabled = false;
      hashtag.username = $rootScope.username;
      $scope.gameState.hasntVoted = false;

      socket.emit('submit hashtag', hashtag);
      console.log('data sent "submit hashtag"', hashtag);
    };

    $scope.gameState.voteForHashtag = function (hashtag) {
      console.log('vote for hashtag sent', hashtag);
      socket.emit('end round', hashtag);
    };
  });

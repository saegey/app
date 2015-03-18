var chat = app.controller('ChatController', function(
  $scope,
  $stateParams,
  socket,
  $sanitize,
  $ionicScrollDelegate) {

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

    socket.on('connect',function(){
      //Add user
      socket.emit('join lobby', $stateParams.nickname);
      $scope.nickname = $stateParams.nickname;
      // On login display welcome message
      socket.on('login', function (data) {
        $scope.gameState.users = data.users;
        console.log('login:users-online: ', data.users);
      });
    });

    socket.on('user list', function (data) {
      console.log("users online:", data);
      $scope.gameState.users = data.users;
    });

    socket.on('user left', function (data) {
      console.log('user left', data);
    });

    socket.on('send hashtag to judge', function (data) {
      if ($stateParams.nickname === $scope.gameState.judge) {
        console.log('judge received hashtag', data);
        $scope.gameState.hashTags.push(data);
      }
    });

    // Lets us know who the winner is
    socket.on('send winner of round', function (data) {
      $scope.gameState.voteEnabled = false;

      if ($stateParams.nickname === data.username) {
        console.log('you won that round my friend');
        $scope.gameState.score++;
      } else {
        console.log('winner is: ', data.username);
      }
    });

    // Judge is now able to vote
    socket.on('judge is now voting', function (data) {
      console.log('judge is now voting');
      $scope.gameState.voteEnabled = true;
    });

    socket.on('send to lobby', function (data) {
      $scope.gameState.gameStarted = false;
      $scope.gameState.isJudge = false;
      $scope.gameState.hashTags = [];
      $scope.gameState.tweet = false;
      console.log('send to lobby: ', data);
    });

    $scope.gameState.startGame = function() {
      // Start Game
      console.log('start game');
      socket.emit('new round', function () {
        $scope.gameState.gameStarted = true;
      });
    };

    // sets up round and check for who is the judge
    socket.on('start round', function (data) {
      console.log('data received "start round"', data);
      $scope.gameState.voteEnabled = false;
      $scope.gameState.judge = data.judge;
      $scope.gameState.hasntVoted = true;
      $scope.gameState.gameStarted = true;

      if ($stateParams.nickname === $scope.gameState.judge) {
        $scope.gameState.hashTags = [];
        $scope.gameState.isJudge = true;
        console.log('your are the judge');
      } else {
        $scope.gameState.hashTags = data.hashtags[$stateParams.nickname];
        $scope.gameState.isJudge = false;
        console.log('judge is ' + $scope.gameState.judge);
      }
      $scope.gameState.tweet = data.tweet;
    });

    // Player submits hashtag
    $scope.gameState.submitHashtag = function (hashtag) {
      // Makes judge not able to vote yet
      $scope.gameState.voteEnabled = false;
      hashtag.username = $stateParams.nickname;
      socket.emit('submit hashtag', hashtag);
      $scope.gameState.hasntVoted = false;
      console.log('data sent "submit hashtag"', hashtag);
    };

    $scope.gameState.voteForHashtag = function (hashtag) {
      // Can the the judge vote?
      if ($scope.gameState.voteEnabled) {
        socket.emit('end round', {
          username: hashtag.username
        });
      } else {
        console.log('not all votes are in');
      }
    };
});


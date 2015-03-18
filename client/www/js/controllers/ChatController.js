var chat = app.controller('ChatController', function(
  $scope,
  $stateParams,
  socket,
  $sanitize,
  $ionicScrollDelegate) {

    var self = this;
    self.autofocus=true;
    self.messages=[];
    self.hasntVoted = true;
    self.hashTags = [];
    self.gameStarted = false;
    self.users = [];
    self.score = 0;
    self.test = true;

    socket.on('connect',function(){
      //Add user
      socket.emit('join lobby', $stateParams.nickname);
      $scope.nickname = $stateParams.nickname;
      // On login display welcome message
      socket.on('login', function (data) {
        //Set the value of connected flag
        self.connected = true;
        self.users = data.users;
        console.log('login:users-online: ', data.users);
      });
    });

    socket.on('user list', function (data) {
      //Set the value of connected flag
      console.log("users online:", data);
      self.users = data.users;
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
      //addMessageToList(data.username,true,data.message);
    });

    // Whenever as user leaves
    socket.on('user left', function (data) {
      console.log('user left', data);
    });


    socket.on('send hashtag to judge', function (data) {
      if ($stateParams.nickname === self.judge) {
        console.log('judge received hashtag', data);
        self.hashTags.push(data);
      }
    });

    // Lets us know who the winner is
    socket.on('send winner of round', function (data) {
      console.log("received winner data: ", data);
      if ($stateParams.nickname === data.username) {
        console.log('you won that round my friend');
        self.score++;
      } else {
        console.log('winner is: ', data.username);
      }
    });

    // Judge is now able to vote
    socket.on('judge is now voting', function (data) {
      console.log('judge is now voting');
      self.voteEnabled = true;
    });

    // socket.on('send to lobby', function (data) {
    //   self.gameStarted = false;
    //   self.isJudge = false;
    //   self.hashTags = [];
    //   self.tweet = false;
    //   console.log('send to lobby: ', data);
    // });

    self.startGame = function() {
      // Start Game
      console.log('start game');
      socket.emit('new round', function () {
        self.gameStarted = true;
      });
    };

    // sets up round and check for who is the judge
    socket.on('start round', function (data) {
      console.log('data received "start round"', data);
      self.judge = data.judge;
      self.hasntVoted = true;
      self.gameStarted = true;

      if ($stateParams.nickname === self.judge) {
        self.hashTags = [];
        self.isJudge = true;
        console.log('your are the judge');
      } else {
        self.hashTags = data.hashtags[$stateParams.nickname];
        self.isJudge = false;
        console.log('judge is ' + self.judge);
      }
      self.tweet = data.tweet;
    });

    // Player submits hashtag
    self.submitHashtag = function (hashtag) {
      // Makes judge not able to vote yet
      self.voteEnabled = false;
      hashtag.username = $stateParams.nickname;
      socket.emit('submit hashtag', {
        hashtag: hashtag,
        username: $stateParams.nickname
      });
      self.hasntVoted = false;
      console.log('data sent "submit hashtag"', hashtag);
    };

    self.voteForHashtag = function (hashtag) {
      console.log('vote for hashtag sent', hashtag);
      socket.emit('end round', hashtag);
    };
});


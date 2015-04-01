'use strict';

var assert = require("assert"),
    app = require('../../app'),
    GameRound = require('./game_round'),
    Game = require('./game'),
    TweetMock = require('../tweet/tweet.mock'),
    Tweet = require('../tweet/tweet.model'),
    Hashtag = require('../hashtag/hashtag.model'),
    _ = require('lodash');

describe("Game", function () {
  // var round = false;
  var users;

  before(function (done) {
    Hashtag.find({}).remove(function() {
      for(var i=0; i < 500; i++) {
        Hashtag.create({hashtag: i});
        if (i === 499) {
          Tweet.create(TweetMock);
          done();
        }
      }
    });
  });

  beforeEach(function(done) {
    users = [
      {username: 'Bob', uuid: "uuid1"},
      {username: 'john', uuid: "uuid2"},
      {username: 'Sarah', uuid: "uuid3"}
    ];
    done();
  });

  it("it should have 3 users", function (done) {
    Game.startGame(users, function (game) {
      assert.equal(game.users.length, 3);
      done();
    });
  });

  it("it should have one round", function (done) {
    Game.startGame(users, function (game) {
      assert.equal(game.rounds.length, 1);
      done();
    });
  });

  it("it should have the first user as judge for round one", function (done) {
    Game.startGame(users, function (game) {
      assert.equal(game.currentRound().judge.username, 'Bob');
      done();
    });
  });

  it("it should remove user that left game", function (done) {
    Game.startGame(users, function (game) {
      game.removeUser(users[1]);
      assert.equal(game.users.length, 2);
      assert.equal(game.users[0].username, "Bob");
      assert.equal(game.users[1].username, "Sarah");
      done();
    });
  });

  it("it should start a new round when round completes", function (done) {
    Game.startGame(users, function (game) {
      game.currentRound().userSubmitHashtag(users[1], {hashtag: "test tag"});
      game.currentRound().userSubmitHashtag(users[2], {hashtag: "test tag1"});
      game.currentRound().submitJudgeVote({hashtag: "test tag"});
      game.newRound(function (game) {
        assert.equal(game.currentRound().judge.username, 'john');
        assert.equal(game.rounds.length, 2);
        assert.equal(game.currentRound().users.length, 3);
        assert.equal(game.currentRound().users[0].hashtags.length, 5);
        assert.equal(game.currentRound().users[2].hashtags.length, 5);
        done();
      });
    });
  });

  describe("Game Round", function () {
    it("it should have an tweet", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(newRound) {
        assert.equal(newRound.tweet.id, 578282568606445600);
        assert.equal(newRound.tweet.text, "I love the energy of New York City....Its so fast paced. I fucking love it....P.S I almost got hit by a car today but I'm ok lmao");
        assert.equal(newRound.tweet.user.name, "Kevin Hart");
        done();
      });
    });

    it("it should have 5 hashtags for each user", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(newRound) {
        assert.equal(newRound.users[0].hashtags.length, 5);
        assert.equal(newRound.users[1].hashtags.length, 5);
        assert.equal(newRound.users[2].hashtags.length, 5);
        done();
      });
    });

    it("it should have unique hashtags for users", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        var user2_tags = _.map(r.users[1].hashtags, 'hashtag')
        var user1_tags = _.map(r.users[0].hashtags, 'hashtag')
        assert.equal(_.difference(user1_tags, user2_tags).length, 5);
        done();
      });
    });

    it("it should have a judge", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        assert.equal(r.judge.username, 'Bob');
        done();
      });
    });

    it("it should submit hashtag for john", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        var user = r.userSubmitHashtag(users[1], {hashtag: "test tag"});
        assert.equal(r.users[1].submittedHashtag.hashtag, 'test tag');
        done();
      });
    });

    it("it should return false if not all tags have been submitted", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        r.userSubmitHashtag(users[1], {hashtag: "test tag"});
        assert.equal(r.checkIfAllTagsSubmitted(), false);
        done();
      });
    });

    it("it should return true if all tags have been submitted", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        r.userSubmitHashtag(users[1], {hashtag: "test tag"});
        r.userSubmitHashtag(users[2], {hashtag: "test tag1"});
        assert.equal(r.checkIfAllTagsSubmitted(), true);
        done();
      });
    });

    it("it should return true when judge votes", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        r.userSubmitHashtag(users[1], {hashtag: "test tag"});
        r.userSubmitHashtag(users[2], {hashtag: "test tag1"});
        assert.equal(r.submitJudgeVote({hashtag: "test tag"}), true);
        done();
      });
    });

    it("it should return current winnner after judge votes", function (done) {
      GameRound.newRound(users, TweetMock, users[0], function(r) {
        r.userSubmitHashtag(users[1], {hashtag: "test tag"});
        r.userSubmitHashtag(users[2], {hashtag: "test tag1"});
        r.submitJudgeVote({hashtag: "test tag"});
        assert.equal(r.lastRoundWinner.username, 'john');
        done();
      });
    });
  });
});

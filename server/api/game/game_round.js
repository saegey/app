var Tweet = require('../tweet/tweet.model'),
    Hashtag = require('../hashtag/hashtag.model'),
    _ = require('lodash');

function GameRound() {
  this.tweet = null;
  this.judge = null;
  this.users = [];
  this.lastRoundWinner = null;
}

GameRound.newRound = function (users, tweet, judge, callback) {
  var round = new GameRound();
  round.users = users;
  round.tweet = tweet;
  round.judge = judge;
  round.getHashTags(function (round) {
    return callback(round);
  });
}

GameRound.prototype.userSubmitHashtag = function (submitUser, userHashtag) {
  this.users.forEach(function (user, index, users) {
    if (user.username === submitUser.username) {
      this.users[index].submittedHashtag = userHashtag;
    } else {
      console.log('couldnt find user that submitted hashtag')
    }
  }, this);
  // this.users[0].submittedHashtag = "fuck"
  return {user: submitUser, };
}

GameRound.prototype.checkIfAllTagsSubmitted = function () {
  var userTags = _.compact(
    _.map(this.users, 'submittedHashtag')
  );

  if (userTags.length >= (this.users.length - 1)) {
    return true;
  } else {
    return false;
  }
}

GameRound.prototype.submitJudgeVote = function (voteHashtag) {
  var self = this;
  var winnerIndex = _.findIndex(
    self.users,
    {submittedHashtag: voteHashtag}
  );
  self.lastRoundWinner = self.users[winnerIndex];
  return true;
}

GameRound.prototype.getHashTags = function(callback) {
  var self = this;
  var numHashtags = self.users.length * 5;

  Hashtag.findRandom().limit(numHashtags).exec(function (err, tags) {
    self.users.forEach(function (username, index) {
      var start = index * 5;
      self.users[index].hashtags = tags.slice(start, start + 5);
    });
    return callback(self);
  });
}

module.exports = GameRound;

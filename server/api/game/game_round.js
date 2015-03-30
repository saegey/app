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

GameRound.prototype.userSubmitHashtag = function (hashtag) {
  console.log('uers', this.users);
  var index = _.findIndex(this.users, 'username.username', hashtag.username);
  console.log(index);
  this.users[1].submittedHashtag = 'fuck';
  console.log('received hashtag', hashtag);
  return this.users[index];
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
  var winnerIndex = _.findIndex(
    this.users,
    {submittedHashtag: voteHashtag},
    false
  );
  this.lastRoundWinner = this.users[winnerIndex];
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

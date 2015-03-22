var Tweet = require('../api/tweet/tweet.model');

function TweetService() {}

TweetService.prototype.getRandomTweet = function (next) {
  Tweet.find(function (err, tweets) {
    if (err) { console.log("error:", err); }
    return next(tweets);
  });
}

module.exports = TweetService;


'use strict';

var Tweet = require('./tweet.model');

function handleError(res, err) {
  return res.send(500, err);
}

exports.index = function (req, res) {
  res.send("awesome");
};

exports.tweets = function (req, res) {
  Tweet.find(function (err, tweets) {
    if (err) { return handleError(res, err); }
    return res.json(200, tweets);
  });
};

exports.show = function (req, res) {
  Tweet.findOne({id: req.params.id}, function (err, tweet) {
    if (err) { return handleError(res, err); }
    if (!tweet) { return res.send(404); }
    return res.json(200, tweet);
  });
};

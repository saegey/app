'use strict';

var Tweet = require('./tweet.model');

var GoogleSheetService = require('../../services/google_sheet_service');

function handleError(res, err) {
  return res.send(500, err);
}

exports.index = function (req, res) {
  res.send("awesome");
};

exports.hashtags = function (req, res) {
  var sheetService = new GoogleSheetService('https://docs.google.com/spreadsheets/d/1azduyest2um3zrUJFvS5upGa2LO7cReg0hob6VtGCas/export?gid=0&format=csv');
  sheetService.getData(function (result) {
    res.send(result);
  });
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

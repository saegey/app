'use strict';

var GoogleSheetService = require('../../services/google_sheet_service');

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
  var sheetService = new GoogleSheetService('https://docs.google.com/spreadsheets/d/1azduyest2um3zrUJFvS5upGa2LO7cReg0hob6VtGCas/export?gid=625026020&format=csv');
  sheetService.getData(function (result) {
    res.send(result);
  });
};


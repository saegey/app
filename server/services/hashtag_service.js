var GoogleSheetService = require('../services/google_sheet_service');

Array.prototype.shuffle = function() {
    var currentIndex = this.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this[currentIndex];
      this[currentIndex] = this[randomIndex];
      this[randomIndex] = temporaryValue;
    }

    return this;
};

function HashtagService(url) {
  this.url = url;
  this.sheetService = new GoogleSheetService(url);
}

HashtagService.prototype.getHashTags = function (numHashTags, next) {
  var numHashtags = numHashtags;
  this.sheetService.getData(function (result) {
    result.shuffle();
    var hashTags = result.slice(0, numHashtags);
    return next(hashTags);
  });
}

module.exports = HashtagService;

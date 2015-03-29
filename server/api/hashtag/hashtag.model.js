var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    random = require('mongoose-random');

var HashtagSchema = new Schema({
  hashtag: String
});

HashtagSchema.plugin(random, { path: 'r' });
module.exports = mongoose.model('Hashtag', HashtagSchema);

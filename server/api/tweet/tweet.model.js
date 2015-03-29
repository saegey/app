var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    random = require('mongoose-random');

var TweetSchema = new Schema({
  created_at: Date,
  id: { type: Number, unique: true },
  text: String,
  truncated: Boolean,
  user: {
    id: Number,
    name: String,
    screen_name: String,
    location: String,
    description: String,
    url: String,
    followers_count: Number,
    friends_count: Number,
    favourites_count: Number,
    verified: Boolean,
    profile_image_url: String,
    following: Boolean
  },
  retweet_count: Number,
  favorite_count: Number,
  entities: {
    urls: [{
      url: String,
      expanded_url: String,
      indices: Array
    }],
    hashtags: [{
      text: String,
      indices: Array
    }],
    user_mentions: [{
      screen_name: String,
      name: String,
      id: Number,
      indices: Array
    }]
  },
  favorited: Boolean,
  retweeted: Boolean,
  lang: String
});

TweetSchema.plugin(random, { path: 'r' });
module.exports = mongoose.model('Tweet', TweetSchema);

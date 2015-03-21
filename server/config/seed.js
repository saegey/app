/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Tweet = require('../api/tweet/tweet.model');

Tweet.find({}).remove(function() {
  Tweet.create({
    "created_at" : "2015-03-18T19:51:22Z",
    "id" : 578282568606445600,
    "text" : "I love the energy of New York City....Its so fast paced. I fucking love it....P.S I almost got hit by a car today but I'm ok lmao",
    "truncated" : false,
    "retweet_count" : 755,
    "favorite_count" : 2389,
    "favorited" : true,
    "retweeted" : false,
    "lang" : "en",
    "entities" : {
      "urls" : [ ],
      "user_mentions" : [ ],
      "hashtags" : [ ]
    },
    "user" : {
      "following" : true,
      "profile_image_url" : "http://pbs.twimg.com/profile_images/568041122765606912/APfVoUzX_normal.jpeg",
      "verified" : true,
      "favourites_count" : 18,
      "friends_count" : 498,
      "followers_count" : 17748522,
      "entities" : {
        "description" : {},
        "url" : {}
      },
      "url" : "http://t.co/mrofop1VIg",
      "description" : "My name is Kevin Hart and I WORK HARD!!! That pretty much sums me up!!! Everybody Wants To Be Famous But Nobody Wants To Do The Work",
      "location" : "Philly/LA",
      "screen_name" : "KevinHart4real",
      "name" : "Kevin Hart",
      "id" : 23151437
    },
  },
  {
    "created_at" : "2015-03-18T05:07:09Z",
    "id" : 578060047684493300,
    "text" : "I can sit at the table with the most biggest richest mothafuckas and still b confident as I want .... Bcuz I know I earned my way here!",
    "truncated" : false,
    "retweet_count" : 2217,
    "favorite_count" : 2771,
    "favorited" : true,
    "retweeted" : false,
    "lang" : "en",
    "entities" : {
      "urls" : [ ],
      "user_mentions" : [ ],
      "hashtags" : [ ]
    },
    "user" : {
      "following" : true,
      "profile_image_url" : "http://pbs.twimg.com/profile_images/545058500054089729/5l4Gb0Xa_normal.jpeg",
      "verified" : true,
      "favourites_count" : 93,
      "friends_count" : 1526,
      "followers_count" : 4030315,
      "entities" : {
        "description" : {},
        "url" : {}
      },
      "url" : "http://t.co/qmCzPv0KFY",
      "description" : "I just wanna see the sun shine tomorrow #dreamchasers #hustler",
      "location" : "Killadelphia",
      "screen_name" : "MeekMill",
      "name" : "Meek Mill",
      "id" : 20567939
    }
  },
  {
    "created_at" : "2015-03-16T21:06:40Z",
    "id" : 577576741629091800,
    "text" : "I have an obsession with Jessica Simpson. 😍",
    "truncated" : false,
    "retweet_count" : 134,
    "favorite_count" : 766,
    "favorited" : true,
    "retweeted" : false,
    "lang" : "en",
    "entities" : {
      "urls" : [ ],
      "user_mentions" : [ ],
      "hashtags" : [ ]
    },
    "user" : {
      "following" : false,
      "profile_image_url" : "http://pbs.twimg.com/profile_images/568421446184345600/d4ZckmIu_normal.jpeg",
      "verified" : true,
      "favourites_count" : 63,
      "friends_count" : 350,
      "followers_count" : 6997094,
      "entities" : {
        "description" : {},
        "url" : {}
      },
      "url" : "http://t.co/sX5wU8uqGC",
      "description" : "Just a happy wife & proud mom",
      "location" : "My own world",
      "screen_name" : "snooki",
      "name" : "Nicole Polizzi",
      "id" : 28638191
    },
  });
});

// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Test User',
//     email: 'test@test.com',
//     password: 'test'
//   }, {
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin@admin.com',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });

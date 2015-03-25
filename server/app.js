'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var mongoose = require('mongoose');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var sys = require('sys');
var exec = require('child_process').exec;
require('./config/socketio')(io);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log("Route: %s", config.root);
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  console.log('The Mongodb url is: ', config.mongo.uri);
  // console.log('Facebook redirect url =: %s', config.facebook.callbackURL);
});

// Expose app
exports = module.exports = app;

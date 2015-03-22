/* global io */
'use strict';

angular.module('rehash-app')
  .factory('socket', function (socketFactory) {

    var ioSocket = io.connect(null, {});
    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return socket;

  });

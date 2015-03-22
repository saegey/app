'use strict';

angular.module('rehash-app').factory('socket',
  function(socketFactory) {

  var myIoSocket = io.connect('http://localhost:5000');
  var mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});

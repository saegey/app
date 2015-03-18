app.factory('socket', function(socketFactory) {

  var myIoSocket = io.connect('http://localhost:5000');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});

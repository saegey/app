var chat = [];

exports.register = function(socket) {
  socket.on('chat message sent', function (message) {
    chat.push(message);

    socket.emit('chat update', {
      'chat' : chat
    });

    socket.broadcast.emit('chat update', {
      'chat' : chat
    });
  });

  socket.on('initialize chat', function () {
    socket.emit('set chat state', {
      'chat' : chat
    });
  });
};

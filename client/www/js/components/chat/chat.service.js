'use strict';

angular.module('rehash-app').factory('chatService',
  function (
    socket,
    $rootScope,
    $mdSidenav,
    $mdToast
  ) {

    var chatService = {};
    chatService.chat = [];
    $rootScope.unreadChats = 0;

    socket.emit('initialize chat');

    socket.on('set chat state', function(data) {
      chatService.chat = data.chat;
    });

    socket.on('chat update', function (data) {
      chatService.chat = data.chat;

      if ($mdSidenav('right').isOpen()) {
        $rootScope.unreadChats = 0;
      } else {
        var msg = data.chat[data.chat.length - 1];

        if (msg.showCount) {
          $rootScope.unreadChats++;
        }

        if (msg.popToast) {

          var systemContent = msg.message;
          var userContent = msg.user + ': ' + msg.message;
          var msgContent = msg.isSystem ? systemContent : userContent;

          $mdToast.show(
            $mdToast.simple()
              .content(msgContent)
          );
        }
      }
    });

    chatService.sendMessage = function(messageData) {
      socket.emit('chat message sent', {
        'user'      : messageData.name || 'System',
        'message'   : messageData.body,
        'isSystem'  : messageData.isSystem || false,
        'popToast'  : messageData.popToast || false,
        'showCount' : messageData.showCount || false
      });
    };

    return chatService;
  });

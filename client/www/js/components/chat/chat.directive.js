'use strict';

angular.module('rehash-app')
  .directive('chat', function($rootScope, chatService, $sanitize) {
    return {
      'restrict'    : 'E',
      'templateUrl' : 'js/components/chat/chat.html',
      'replace'     : true,
      'link'        : function(scope, elem, attrs) {

        scope.chat = [];

        scope.$watch(function() { return chatService.chat; },
          function (newChat) {
            scope.chat = newChat;
          }
        );

        scope.sendChatMessage = function (text) {
          scope.chatText = '';

          var messageData = {
            'body'      : $sanitize(text),
            'name'      : $rootScope.nickname,
            'popToast'  : true,
            'showCount' : true
          }

          chatService.sendMessage(messageData);
        };
      }
    };
  });

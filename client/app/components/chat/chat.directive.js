'use strict';

angular.module('rehash-app')
  .directive('chat', function($rootScope, chatService, $sanitize) {
    return {
      'restrict'    : 'E',
      'templateUrl' : 'app/components/chat/chat.html',
      'replace'     : true,
      'link'        : function(scope, elem, attrs) {


        scope.chat = {};
        scope.chat.log = [];
        scope.chat.input = '';

        scope.$watch(function() { return chatService.chat; },
          function (newChat) {
            scope.chat.log = newChat;
          }
        );

        scope.sendChatMessage = function (text) {
          scope.chat.input = '';

          var messageData = {
            'body'      : $sanitize(text),
            'name'      : $rootScope.username,
            'popToast'  : true,
            'showCount' : true
          }

          chatService.sendMessage(messageData);
        };
      }
    };
  });

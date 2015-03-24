'use strict';

angular.module('rehash-app')
  .controller('LoginController',
    function ($scope, $state, $sanitize) {

      $scope.user = {};

      $scope.login = function () {
        var nickname = $sanitize($scope.user.username);

        if (nickname) {
          $state.username = nickname;
          $state.go('chat', {nickname : nickname});
        }
      };
    });

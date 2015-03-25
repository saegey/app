'use strict';

angular.module('rehash-app')
  .controller('LoginCtrl', function (
    $scope,
    $state,
    $sanitize,
    $rootScope) {

    console.log('LoginCtrl init');

    $scope.user = {};

    $scope.login = function () {
      var username = $sanitize($scope.user.username);

      if (username) {
        $state.username = username;
        $state.go('game.main', {username: username});
      }
    };
  });

'use strict';

angular.module('rehash-app',
  [ 'ionic',
    'ngSanitize',
    'btford.socket-io',
    'luegg.directives'
  ])

  .run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // @TODO: This is throwing an error on devices
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('game', {
        url: '/game',
        abstract: true,
        templateUrl: 'app/modules/game/game.html'
      })

      .state('game.main', {
        url: '/:username/main',
        views: {
          'menuContent' :{
            templateUrl: 'app/modules/game/game.main.html',
            controller: 'GameCtrl'
          }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/modules/login/login.html',
        controller: 'LoginCtrl'
      });

    $urlRouterProvider.otherwise('/login');
  });

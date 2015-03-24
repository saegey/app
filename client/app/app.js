'use strict';

angular.module('rehash-app',
  [ 'ionic',
    'ngSanitize',
    'btford.socket-io',
    'ngTouch',
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
.config(function($stateProvider, $urlRouterProvider)
{

  $stateProvider
  .state('chat', {
    url: "/chat/:nickname",
    templateUrl: "app/templates/chat.html"
  })
  .state('login', {
    url: "/login",
    templateUrl: "app/templates/login.html"
  });

  $urlRouterProvider.otherwise('/login');
});

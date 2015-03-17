// Ionic Socket IO app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('rehash-app',
  [ 'ionic',
    'ngSanitize',
    'btford.socket-io',
    'ngMaterial'])

.run(function($ionicPlatform) {

    onLoad();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider)
{

  $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('teal')
    .warnPalette('red')
    .backgroundPalette('grey');

  $stateProvider
  .state('chat', {
    url: "/chat/:nickname",
    templateUrl: "templates/chat.html"
  })
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

function matAndroidMeasure() {
  window.plugins.gaidWrapperPlugin.getGoogleAdvertisingId(
    function(res) {
      matSDK.setGoogleAdvertisingId(null, null, res.gaid, res.isLAT);
      matSDK.measureSession(null, null);
    },
    function() {
      matSDK.setAndroidId(null, null, true);
      matSDK.measureSession(null, null);
    } );
}

function matIosMeasure() {
  window.plugins.ifaWrapperPlugin.getAppleAdvertisingIdentifier(
    function(res) {
      matSDK.setAppleAdvertisingIdentifier(null, null, res.ifa, res.trackingEnabled);
      matSDK.measureSession(null, null);
    }, null );
}

function matInitialize() {
  matSDK = window.plugins.matPlugin;
  matSDK.initTracker(null, null, '22248', '72367cefd69e588af853153218ba9dc1');
  matSDK.setDebugMode(null, null, true);
  if ( window.cordova.platformId == 'ios' ) {
    matIosMeasure();
  }
  else if ( window.cordova.platformId == 'android' ) {
    matAndroidMeasure();
  }
}

function onLoad() {
  document.addEventListener("deviceready", onDeviceReady, false);
  document.addEventListener("resume", onResume, false);
  document.addEventListener("pause", onPause, false);
}

function onDeviceReady() {
  Localytics.init("556d5bac5735b916967bb48-414f2ad0-ca47-11e4-2e99-004a77f8b47f");
  Localytics.resume();
  Localytics.upload();
}

function onResume() {
  Localytics.resume();
  Localytics.upload();
}

function onPause() {
  Localytics.close();
  Localytics.upload();
}

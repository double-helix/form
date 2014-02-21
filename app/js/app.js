'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngProgress',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});

  $routeProvider.otherwise({redirectTo: '/home'});
}])
.run(function($rootScope, ngProgress) {
  ngProgress.color('#D7217E');
  $rootScope.$on('$routeChangeStart', function() {
    ngProgress.start();
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    ngProgress.complete();
  });
  // Do the same with $routeChangeError
});;

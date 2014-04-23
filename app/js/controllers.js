'use strict';

/* Controllers */

angular.module('doubleHelixApp.controllers', [
    //'myApp.controllers.dataviewController'
  ]).
  controller('HomeCtrl', ['$scope', function($scope) {
    //angular.element('.pure-g')//.addClass('l-box');
  }])
  .controller('MyCtrl1', [function() {

  }])
  .controller('WheelCtrl', ['$scope', function($scope) {
    $scope.data = [
      {name: "Greg", score: 98},
      {name: "Ari", score: 96},
      {name: 'Q', score: 75},
      {name: "Loser", score: 48}
    ];
  }]);
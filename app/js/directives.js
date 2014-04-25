'use strict';

/* Directives */


angular.module('doubleHelixApp.directives', [])
  .directive('appVersion', [function(version) {
    return {
      template: 'Current version is v1.0'
    };
  }])
  .directive('d3Wheel', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {

    function link(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          console.log(scope);
          var renderTimeout;
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');

          $window.onresize = function() {
            scope.$apply();
          };

          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.$parent.data);
          });

          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true);

          scope.render = function(data) {
            svg.selectAll('*').remove();

            if (!data) return;
            if (renderTimeout) clearTimeout(renderTimeout);

            renderTimeout = $timeout(function() {

            }, 200);
          };
        });
      }


    return {
      restrict: 'E',
      scope: {
        //data: '=',
        label: '@',
        onClick: '&'
      },
      link: link
    };
  }]);
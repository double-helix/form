'use strict';

angular.module('d3', [])
  .factory('d3Service', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
          var d = $q.defer(),
              d3service = {
                  d3: function() {
                      return d.promise;
                  }
              };

          function onScriptLoad() {
              // Load client in the browser
              $rootScope.$apply(function() {
                  d.resolve($window.d3);
              });
          }
          var scriptTag = $document[0].createElement('script');
          scriptTag.type = 'text/javascript';
          scriptTag.async = true;
          scriptTag.src = 'lib/d3/d3.v3.min.js';
          scriptTag.onreadystatechange = function() {
              if (this.readyState == 'complete') onScriptLoad();
          };
          scriptTag.onload = onScriptLoad;

          var s = $document[0].getElementsByTagName('body')[0];
          s.appendChild(scriptTag);

          return d3service;
      }
  ])
  .factory('rawService', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
          var r = $q.defer(),
              rawservice = {
                  raw: function() {
                      return r.promise;
                  }
              };

          function onScriptLoad() {
              // Load client in the browser
              $rootScope.$apply(function() {
                  r.resolve($window.raw);
              });
          }
          var scriptTag = $document[0].createElement('script');
          scriptTag.type = 'text/javascript';
          scriptTag.async = true;
          scriptTag.src = 'lib/raw/raw.js';
          scriptTag.onreadystatechange = function() {
              if (this.readyState == 'complete') onScriptLoad();
          };
          scriptTag.onload = onScriptLoad;

          var s = $document[0].getElementsByTagName('body')[0];
          s.appendChild(scriptTag);

          return rawservice;
      }
  ])
  .factory('dataService', function ($http, $q, $timeout) {

      return {

        loadSample : function(sample){
          var deferred = $q.defer();
          $http.get(sample)
            .then(function(response){
                deferred.resolve(response.data);
            },
            function(){
                deferred.reject("An error occured while getting sample (" + sample.title + ")");
            });

          return deferred.promise;
        },

        debounce : function (func, wait, immediate) {
          var timeout;
          var deferred = $q.defer();
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if(!immediate) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
              }
            };
            var callNow = immediate && !timeout;
            if ( timeout ) {
              $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
              deferred.resolve(func.apply(context,args));
              deferred = $q.defer();
            }
            return deferred.promise;
          };
        }

      }
  })
'use strict';

/* Controllers */

angular.module('doubleHelixApp.controllers', [
    // 'd3Wheel'
  ])
  .controller('HomeCtrl', ['$scope', function($scope) {
    //angular.element('.pure-g')//.addClass('l-box');
  }])
  .controller('MyCtrl1', [function() {

  }])
  .controller('WheelCtrl', ['$scope', function($scope) {
    $scope.data = {
        'children': [{
            'children': [{
                'children': [{
                    'name': 'jquery',
                    'size': 4,
                    'color': '#FAD966'
                }, {
                    'name': 'yui3',
                    'size': 2,
                    'color': '#FCE697'
                }, {
                    'name': 'otherFrameworks',
                    'size': 2,
                    'color': '#FCE697'
                }, {
                    'name': 'jqueryMobile',
                    'size': 0,
                    'color': '#FFCF2B'
                }, {
                    'name': 'backbone',
                    'size': 5,
                    'color': '#E6C247'
                }, {
                    'name': 'jqueryPlugin/WidgetFactory',
                    'size': 2,
                    'color': '#FAEBB9'
                }, {
                    'name': 'yuiWidget',
                    'size': 2,
                    'color': '#FCE697'
                }],
                'name': 'libraries',
                'color': '#FCD249'
            }, {
                'children': [{
                    'name': 'Inheritance, prototypes, constructors',
                    'size': 4,
                    'color': '#FAD966'
                }, {
                    'name': 'Scope, Closure, Hoisting',
                    'size': 2,
                    'color': '#FCE697'
                }, {
                    'name': 'Data Structures',
                    'size': 0,
                    'color': '#FFCF2B'
                }],
                'name': 'oop',
                'color': '#FCD249'
            }, {
                'children': [{
                    'name': 'Encapsulation: Module Pattern, Revealing Module Pattern',
                    'size': 3,
                    'color': '#FAD966'
                }, {
                    'name': 'Creational, Structural and Behavioral',
                    'size': 3,
                    'color': '#FCE697'
                }, {
                    'name': 'MV* Patterns',
                    'size': 5,
                    'color': '#FFCF2B'
                }],
                'name': 'designPatterns',
                'color': '#FCD249'
            }, {
                'children': [{
                    'name': 'DOM Manipulation',
                    'size': 5,
                    'color': '#FAD966'
                }, {
                    'name': 'Browser Events',
                    'size': 5,
                    'color': '#FCE697'
                }, {
                    'name': 'Bubbling',
                    'size': 5,
                    'color': '#FFCF2B'
                }],
                'name': 'vanilla',
                'color': '#FCD249'
            }, {
                'children': [{
                    'name': 'Regular expressions',
                    'size': 1,
                    'color': '#FAD966'
                }],
                'name': 'others',
                'color': '#FCD249'
            }],
            'name': 'js',
            'color': '#FEC606'
        }, {
            'children': [{
                'name': 'methods',
                'size': 5,
                'color': '#BB3658'
            }, {
                'name': 'CORS/JSONP',
                'size': 3,
                'color': '#BB3658'
            }, {
                'name': 'XHR',
                'size': 4,
                'color': '#BB3658'
            }, ],
            'name': 'http',
            'color': '#C40233'
        }, {
            'children': [{
                'name': 'css3',
                'size': 1,
                'color': '#F7D2CB'
            }, {
                'name': 'boxModel',
                'size': 3,
                'color': '#FAB1A2'
            }, {
                'name': 'specificity',
                'size': 4,
                'color': '#FC9B88'
            }, {
                'name': 'typography',
                'size': 1,
                'color': '#F7D2CB'
            }, {
                'name': 'preProcessors',
                'size': 3,
                'color': '#FC9B88'
            }, {
                'name': 'prefixes',
                'size': 2,
                'color': '#F7D2CB'
            }, {
                'name': 'crossBrowsers',
                'size': 5,
                'color': '#FC9B88'
            }, {
                'name': 'RWD',
                'size': 4,
                'color': '#F7D2CB'
            }],
            'name': 'css',
            'color': '#D33257'
        }, {
            'children': [{
                'name': 'documentType',
                'size': 5,
                'color': '#4ABBF7'
            }, {
                'name': 'semantics/accesiblity',
                'size': 4,
                'color': '#70CAFA'
            }, {
                'name': 'iframe',
                'size': 4,
                'color': '#70CAFA'
            }, {
                'name': 'elements/tags',
                'size': 4,
                'color': '#70CAFA'
            }, {
                'name': 'html5Features',
                'size': 4,
                'color': '#70CAFA'
            }, {
                'name': 'templates',
                'size': 4,
                'color': '#70CAFA'
            }],
            'name': 'html',
            'color': '#3D8EB9'
        }, {
            'children': [{
                'name': 'spa',
                'size': 5,
                'color': '#E4F280'
            }, {
                'name': 'retinaSupport',
                'size': 4,
                'color': '#D2E359'
            }, {
                'name': 'touchEvents',
                'size': 4,
                'color': '#E4F280'
            }, {
                'name': 'infiniteScrolling',
                'size': 4,
                'color': '#D2E359'
            }, {
                'name': 'progressiveEnhancement/gracefulDegradation',
                'size': 4,
                'color': '#E4F280'
            }, {
                'name': 'optimization/performance',
                'size': 4,
                'color': '#D2E359'
            }],
            'name': 'techniques',
            'color': '#C9DC3F'
        }, {
            'children': [{
                'children': [{
                    'name': 'thirdParty API',
                    'size': 1,
                    'color': '#78EEFA'
                }, {
                    'name': 'SVG/Canvas',
                    'size': 2,
                    'color': '#ACF5FC'
                }, {
                    'name': 'cookies/cache',
                    'size': 2,
                    'color': '#78EEFA'
                }, {
                    'name': 'attlasianSuite',
                    'size': 4,
                    'color': '#ACF5FC'
                }, {
                    'name': 'validationTools',
                    'size': 1,
                    'color': '#78EEFA'
                }, {
                    'name': 'codeReutilization',
                    'size': 3,
                    'color': '#ACF5FC'
                }],
                'name': 'other',
                'color': '#48CEDB'
            }],
            'name': 'extra',
            'color': '#30C1CF'
        }, {
            'children': [{
                'children': [{
                    'name': 'Java / JSP / .NET / NodeJS',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'languages',
                'color': '#85C767'
            }, {
                'children': [{
                    'name': 'Struts / Spring MVC (2.5, 3) / Tiles',
                    'size': 2,
                    'color': '#AAD996'
                }, {
                    'name': 'Google guice / closure (soy templates)',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'frameworks',
                'color': '#85C767'
            }, {
                'children': [{
                    'name': 'REST / SOAP',
                    'size': 2,
                    'color': '#AAD996'
                }, {
                    'name': 'JSP tags / TLD generation',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'concepts',
                'color': '#85C767'
            }, {
                'children': [{
                    'name': 'Unit testing (TDD, coverage, mocks)',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'testing',
                'color': '#85C767'
            }, {
                'children': [{
                    'name': 'Tomcat 6,7 / Jetty / SSL',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'infrastructure',
                'color': '#85C767'
            }, {
                'children': [{
                    'name': 'SSO (siteminder)',
                    'size': 2,
                    'color': '#AAD996'
                }],
                'name': 'nice to have',
                'color': '#85C767'
            }],
            'name': 'backend',
            'color': '#71BA51'
        }, {
            'children': [{
                'name': 'Maven / Grunt / Ant',
                'size': 5,
                'color': '#E6825E'
            }, {
                'name': 'Source Code Control (svn, git, cvs, ...)',
                'size': 4,
                'color': '#F78C65'
            }, {
                'name': 'IDEs / Text Editors (Eclipse, NotePad++, Sublime)',
                'size': 4,
                'color': '#F78C65'
            }],
            'name': 'infrastructureTools',
            'color': '#E75926'
        }, {
            'children': [{
                'name': 'Leadership',
                'size': 1,
                'color': '#9684A3'
            }, {
                'name': 'Team Work',
                'size': 4,
                'color': '#9684A3'
            }, {
                'name': 'Analytical Ability',
                'size': 3,
                'color': '#9684A3'
            }, {
                'name': 'Coaching',
                'size': 1,
                'color': '#9684A3'
            }, {
                'name': 'Communication',
                'size': 3,
                'color': '#9684A3'
            }, {
                'name': 'Scrum framework (Theory and experience)',
                'size': 1,
                'color': '#9684A3'
            }],
            'name': 'softSkills',
            'color': '#8870FF'
        }, ],
        'name': 'root'
    };
    // {
    //   'children':[],
    //   'name':
    // },

  }]);
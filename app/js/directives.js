'use strict';

/* Directives */


angular.module('doubleHelixApp.directives', [])
  .directive('appVersion', ['version','$rootScope',function(version, $rootScope) {
    $rootScope.version = version;
    return {
      template: 'Current version is v{{ version }}'
    };
  }])

  .directive('d3Wheel', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {

    function link(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

          var renderTimeout;
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%')
            .style('height', '100%');

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

              var colors = {};

              function traverse(obj, func, parent) {
                  for (i in obj) {
                      func.apply(this, [i, obj[i], parent]);
                      if (obj[i] instanceof Object) {
                          traverse(obj[i], func, i);
                      }
                  }
              }

              function getPropertyRecursive(obj, property) {
                  var acc = [];
                  traverse(obj, function(key, value, parent) {
                      if (key === property) {
                          acc.push({
                              key: parent,
                              value: value
                          });
                      }
                  });
                  return acc;
              }

              function getColors(obj) {
                  obj = obj.children;
                  for (var i = obj.length - 1; i >= 0; i--) {
                      var prop = obj[i].name,
                          value = obj[i].color;
                      colors[prop] = value;
                  };
              }
              // Mapping of step names to colors.
              getColors(scope.$parent.data);
              // Dimensions of sunburst.
              var width = 750;
              var height = 600;
              var radius = Math.min(width, height) / 2.5;
              // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
              var b = {
                  w: 75,
                  h: 30,
                  s: 3,
                  t: 10
              };

              // Total size of all segments; we set this later, after loading the data.
              var totalSize = 0;
              var vis = svg
                  .attr("width", width)
                  .attr("height", height)
                  .append("svg:g")
                  .attr("id", "container")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
              var partition = d3.layout.partition()
                  .size([2 * Math.PI, radius * radius])
                  .value(function(d) {
                      return d.size;
                  });
              var arc = d3.svg.arc()
                  .startAngle(function(d) {
                      return d.x;
                  })
                  .endAngle(function(d) {
                      return d.x + d.dx;
                  })
                  .innerRadius(function(d) {
                      return Math.sqrt(d.y);
                  })
                  .outerRadius(function(d) {
                      return Math.sqrt(d.y + d.dy);
                  });
              // Use d3.data
              /*d3.json($data, function(text) {
            console.log(text);
            var csv = d3.csv.parseRows(text);
            var json = buildHierarchy(csv);*/
              createVisualization(scope.$parent.data);
              //});
              // Main function to draw and set up the visualization, once we have the data.

              function createVisualization(json) {
                  // Basic setup of page elements.
                  initializeBreadcrumbTrail();
                  drawLegend();
                  d3.select("#togglelegend").on("click", toggleLegend);
                  // Bounding circle underneath the sunburst, to make it easier to detect
                  // when the mouse leaves the parent g.
                  vis.append("svg:circle")
                      .attr("r", radius)
                      .style("opacity", 0);
                  // For efficiency, filter nodes to keep only those large enough to see.
                  var nodes = partition.nodes(json)
                      .filter(function(d) {
                          return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
                      });
                  var path = vis.data([json]).selectAll("path")
                      .data(nodes)
                      .enter().append("svg:path")
                      .attr("display", function(d) {
                          return d.depth ? null : "none";
                      })
                      .attr("d", arc)
                      .attr("fill-rule", "evenodd")
                      .style("fill", function(d) {
                          return d.color;
                      })
                      .style("opacity", 1)
                      .on("mouseover", mouseover);
                  // Add the mouseleave handler to the bounding circle.
                  d3.select("#container").on("mouseleave", mouseleave);
                  // Get total size of the tree = value of root node from partition.
              // console.log(path);
                  totalSize = path.node().__data__.value;
              };
              // Fade all but the current sequence, and show it in the breadcrumb trail.

              function mouseover(d) {
                  var percentage = (100 * d.value / totalSize).toPrecision(3);
                  var percentageString = percentage + "%";
                  if (percentage < 0.1) {
                      percentageString = "< 0.1%";
                  }
                  d3.select("#percentage")
                      .text(percentageString);
                  d3.select("#label")
                      .text(d.name);
                  d3.select("#explanation")
                      .style("visibility", "");
                  var sequenceArray = getAncestors(d);
                  updateBreadcrumbs(sequenceArray, percentageString);
                  // Fade all the segments.
                  d3.selectAll("path")
                      .style("opacity", 0.3);
                  // Then highlight only those that are an ancestor of the current segment.
                  vis.selectAll("path")
                      .filter(function(node) {
                          return (sequenceArray.indexOf(node) >= 0);
                      })
                      .style("opacity", 1);
              }
              // Restore everything to full opacity when moving off the visualization.

              function mouseleave(d) {
                  // Hide the breadcrumb trail
                  d3.select("#trail")
                      .style("visibility", "hidden");
                  // Deactivate all segments during transition.
                  d3.selectAll("path").on("mouseover", null);
                  // Transition each segment to full opacity and then reactivate it.
                  d3.selectAll("path")
                      .transition()
                      .duration(1000)
                      .style("opacity", 1)
                      .each("end", function() {
                          d3.select(this).on("mouseover", mouseover);
                      });
                  d3.select("#explanation")
                      .transition()
                      .duration(1000)
                      .style("visibility", "hidden");
              }
              // Given a node in a partition layout, return an array of all of its ancestor
              // nodes, highest first, but excluding the root.

              function getAncestors(node) {
                  var path = [];
                  var current = node;
                  while (current.parent) {
                      path.unshift(current);
                      current = current.parent;
                  }
                  return path;
              }

              function initializeBreadcrumbTrail() {
                  // Add the svg area.
                  var trail = d3.select("#sequence").append("svg:svg")
                      .attr("width", width)
                      .attr("height", 50)
                      .attr("id", "trail");
                  // Add the label at the end, for the percentage.
                  trail.append("svg:text")
                      .attr("id", "endlabel")
                      .style("fill", "#000");
              }
              // Generate a string that describes the points of a breadcrumb polygon.

              function breadcrumbPoints(d, i) {
                  var points = [];
                  //1
                  points.push("0,0");
                  //2
                  points.push(b.w + ",0");
                  //3
                  points.push(b.w + b.t + "," + (b.h / 2));
                  //4
                  points.push(b.w + "," + b.h);
                  //5
                  points.push("0," + b.h);
                  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                      points.push(b.t + "," + (b.h / 2));
                  }
                  return points.join(" ");
              }
              // Update the breadcrumb trail to show the current sequence and percentage.

              function updateBreadcrumbs(nodeArray, percentageString) {
                  // Data join; key function combines name and depth (= position in sequence).
                  var g = d3.select("#trail")
                      .selectAll("g")
                      .data(nodeArray, function(d) {
                          return d.name + d.depth;
                      });
                  // Add breadcrumb and label for entering nodes.
                  var entering = g.enter().append("svg:g");
                  //redefined width of breadcrumb depending of the word length
                  //var nameLength = d.name.split('').length;
                  //b.wS = (nameLength <= 9) ? b.w : nameLength * 8.4;
                  //drawing the breadcrum
                  entering.append("svg:polygon")
                      .attr("points", breadcrumbPoints)
                      .style("fill", function(d) {
                          return d.color;
                      });
                  entering.append("svg:text")
                      .attr("x", (b.w + b.t) / 2)
                      .attr("y", b.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(function(d) {
                          return d.name;
                      });
                  // Set position for entering and updating nodes.
                  g.attr("transform", function(d, i) {
                      return "translate(" + i * (b.w + b.s) + ", 0)";
                  });
                  // Remove exiting nodes.
                  g.exit().remove();
                  // Now move and update the percentage at the end.
                  d3.select("#trail").select("#endlabel")
                      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
                      .attr("y", b.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(percentageString);
                  // Make the breadcrumb trail visible, if it's hidden.
                  d3.select("#trail")
                      .style("visibility", "");
              }

              function drawLegend() {
                  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
                  var li = {
                      w: 75,
                      h: 30,
                      s: 3,
                      r: 3
                  };
                  var legend = d3.select("#legend").append("svg:svg")
                      .attr("width", li.w)
                      .attr("height", d3.keys(colors).length * (li.h + li.s));
                  var g = legend.selectAll("g")
                      .data(d3.entries(colors))
                      .enter().append("svg:g")
                      .attr("transform", function(d, i) {
                          return "translate(0," + i * (li.h + li.s) + ")";
                      });
                  g.append("svg:rect")
                      .attr("rx", li.r)
                      .attr("ry", li.r)
                      .attr("width", li.w)
                      .attr("height", li.h)
                      .style("fill", function(d) {
                          return d.value;
                      });
                  g.append("svg:text")
                      .attr("x", li.w / 2)
                      .attr("y", li.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(function(d) {
                          return d.key;
                      });
              }

              function toggleLegend() {
                  var legend = d3.select("#legend");
                  if (legend.style("display") == "none") {
                      legend.style("display", "block");
                  } else {
                      legend.style("display", "none");
                  }
              }
              // Take a 2-column CSV and transform it into a hierarchical structure suitable
              // for a partition layout. The first column is a sequence of step names, from
              // root to leaf, separated by hyphens. The second column is a count of how
              // often that sequence occurred.

              function buildHierarchy(csv) {
                  var root = {
                      "name": "root",
                      "children": []
                  };
                  for (var i = 0; i < csv.length; i++) {
                      var sequence = csv[i][0];
                      var size = +csv[i][1];
                      if (isNaN(size)) { // e.g. if this is a header row
                          continue;
                      }
                      var parts = sequence.split("-");
                      var currentNode = root;
                      for (var j = 0; j < parts.length; j++) {
                          var children = currentNode["children"];
                          var nodeName = parts[j];
                          var childNode;
                          if (j + 1 < parts.length) {
                              // Not yet at the end of the sequence; move down the tree.
                              var foundChild = false;
                              for (var k = 0; k < children.length; k++) {
                                  if (children[k]["name"] == nodeName) {
                                      childNode = children[k];
                                      foundChild = true;
                                      break;
                                  }
                              }
                              // If we don't already have a child node for this branch, create it.
                              if (!foundChild) {
                                  childNode = {
                                      "name": nodeName,
                                      "children": []
                                  };
                                  children.push(childNode);
                              }
                              currentNode = childNode;
                          } else {
                              // Reached the end of the sequence; create a leaf node.
                              childNode = {
                                  "name": nodeName,
                                  "size": size
                              };
                              children.push(childNode);
                          }
                      }
                  }
                  return root;
              };
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
  }])

  .directive('rawTable', ['$q', 'd3Service', 'rawService', 'dataService', function ($q, d3Service, rawService, dataService) {

    function link(scope, ele, attrs){
      $q.all([d3Service,rawService])
        .then(function(result) {

        var d3 = result[0].d3(),
            raw = result[1].raw();

        var sortBy,
            descending = true;

        function update(){
          d3.select(ele[0]).selectAll("*").remove();

          if(!scope.data || !scope.data.length) {
            d3.select(ele[0]).append("span").text("Please, review your data")
            return;
          }

          var table = d3.select(ele[0])
            .append('table')
            .attr("class","table table-striped table-condensed")

          if (!sortBy) sortBy = scope.metadata[0].key;

          var headers = table.append("thead")
            .append("tr")
            .selectAll("th")
            .data(scope.metadata)
            .enter().append("th")
              .text( function(d){ return d.key; } )
              .on('click', function (d){
                descending = sortBy == d.key ? !descending : descending;
                sortBy = d.key;
                update();
              })

          headers.append("i")
            .attr("class", function (d){ return descending ? "fa fa-sort-desc pull-right" : "fa fa-sort-asc pull-right"})
            .style("opacity", function (d){ return d.key == sortBy ? 1 : 0; })

          var rows = table.append("tbody")
            .selectAll("tr")
            .data(scope.data.sort(sort))
            .enter().append("tr");

          var cells = rows.selectAll("td")
            .data(d3.values)
            .enter().append("td");
            cells.text(String);

        }

        function sort(a,b) {
          if (raw.isNumber(a[sortBy]) && raw.isNumber(b[sortBy])) return descending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
          return descending ? a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0 : a[sortBy] < b[sortBy] ? 1 : a[sortBy] > b[sortBy] ? -1 : 0;
        }


        scope.raw = raw;
        scope.data = [];
        scope.metadata = [];
        scope.error = false;

        scope.parse = function(text){

          if (scope.model) scope.model.clear();

          scope.data = [];
          scope.metadata = [];
          scope.error = false;
          scope.$apply();

          try {
            var parser = raw.parser();
            scope.data = parser(text);
            scope.metadata = parser.metadata(text);
            scope.error = false;
          } catch(e){
            scope.data = [];
            scope.metadata = [];
            scope.error = e.name == "ParseError" ? +e.message : false;
          }
          if (!scope.data.length && scope.model) scope.model.clear();
        }

        scope.delayParse = dataService.debounce(scope.parse, 500, false);

        scope.$watch("text", function (text){
          scope.delayParse(text);
        });

        scope.charts = raw.charts.values().sort(function (a,b){ return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0; });
        scope.chart = scope.charts[0];
        scope.model = scope.chart ? scope.chart.model() : null;

        scope.$watch('error', function (error){
          if (!$('.CodeMirror')[0]) return;
          var cm = $('.CodeMirror')[0].CodeMirror;
          if (!error) {
            cm.removeLineClass(scope.lastError,'wrap','line-error');
            return;
          }
          cm.addLineClass(error, 'wrap', 'line-error');
          cm.scrollIntoView(error);
          scope.lastError = error;

        })

        $('body').mousedown(function (e,ui){
          if ($(e.target).hasClass("dimension-info-toggle")) return;
          $('.dimensions-wrapper').each(function (e){
            angular.element(this).scope().open = false;
            angular.element(this).scope().$apply();
          })
        })


        scope.$watch('dataView', function(){
          if (!$('.CodeMirror')[0]) return;
          var cm = $('.CodeMirror')[0].CodeMirror;
        })

        scope.selectChart = function(chart){
          if (chart == scope.chart) return;
          scope.model.clear();
          scope.chart = chart;
          scope.model = scope.chart.model();
        }

        scope.isEmpty = function(){
          return scope.model && !scope.model.dimensions().values().filter(function (d){ return d.value.length } ).length;
        }

        function refreshScroll(){
          $('[data-spy="scroll"]').each(function () {
            $(this).scrollspy('refresh');
          });
        }

        $(window).scroll(function(){

          // check for mobile
          if ($(window).width() < 760 || $('#mapping').height() < 300) return;
          var scrollTop = $(window).scrollTop() + 0,
              mappingTop = $('#mapping').offset().top+10,
              mappingHeight = $('#mapping').height(),
              isBetween = scrollTop > mappingTop+10 && scrollTop <= mappingTop + mappingHeight - $(".sticky").height()-20,
              isOver = scrollTop > mappingTop + mappingHeight - $(".sticky").height()-20,
              mappingWidth = mappingWidth ? mappingWidth : $('.col-lg-9').width();

          if (mappingHeight-$('.dimensions-list').height() > 60) return;
          if (isBetween) {
            $(".sticky")
              .css("position","fixed")
              .css("width", mappingWidth+"px")
              .css("top","20px")
          }

         if(isOver) {
            $(".sticky")
              .css("position","fixed")
              .css("width", mappingWidth+"px")
              .css("top", (mappingHeight - $(".sticky").height() + 0 - scrollTop+mappingTop) + "px");
              return;
          }

          if (isBetween) return;

          $(".sticky")
            .css("position","relative")
            .css("top","")
            .css("width", "");

        })

        $(document).ready(refreshScroll);

        scope.$watch('data', update);
        scope.$watch('metadata', function(){
          sortBy = null;
          update();
        });

      });
    };

    return {
      restrict: 'A',
      link: link
    };
  }])
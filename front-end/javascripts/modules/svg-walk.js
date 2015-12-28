// function dawnSVG() {

// }

// dawnSVG.prototype.initialize = function(argument) {
//   return $('.signature svg').each(function() {
//       var delay, i, len, length, path, paths, previousStrokeLength, results, speed;
//       paths = $('path, circle, rect', this);
//       delay = 0;
//       results = [];
//       for (i = 0, len = paths.length; i < len; i++) {
//         path = paths[i];
//         length = path.getTotalLength();
//         previousStrokeLength = speed || 0;
//         speed = length < 100 ? 20 : Math.floor(length);
//         delay += previousStrokeLength + 100;
//         results.push($(path).css('transition', 'none').attr('data-length', length).attr('data-speed', speed).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length));
//       }
//       return results;
//     });
// };

// dawnSVG.prototype.walk = function(argument) {
//   return $('.signature svg').each(function() {
//       var delay, i, len, length, path, paths, results, speed;
//       paths = $('path, circle, rect', this);
//       results = [];
//       for (i = 0, len = paths.length; i < len; i++) {
//         path = paths[i];
//         length = $(path).attr('data-length');
//         speed = $(path).attr('data-speed');
//         delay = $(path).attr('data-delay');
//         results.push($(path).css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear').attr('stroke-dashoffset', '0'));
//       }
//       return results;
//     });
// };

// usage:
// var p = Object.create(painter);
// p.init(document.getElementById('painter-target'));
// p.start();

'use strict';

// Helpers

var slice = Array.prototype.slice;
var forEach = Array.prototype.forEach;

var extend = function (obj) {
  slice.call(arguments, 1).forEach(function (source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        obj[prop] = source[prop];
      }
    }
  });

  return obj;
};

// SVG painter

var defaults = {
  strategy:  'sequential',
  duration:  10000,
  frequency: 60 / 1000
};

export function dawnSVG() {

}

dawnSVG.prototype = {
  init: function (svg, options) {
    this.initOptions(extend({}, defaults, options));
    this.initSvg(svg);
    this.buildPaths();
  },

  start: function () {
    var that = this;

    (function step() {
      if (that.refresh()) {
        window.requestAnimationFrame(step);
      }
    })();
  },

  initOptions: function (options) {
    this.strategy  = this[options.strategy];
    this.duration  = options.duration;
    this.frequency = options.frequency;
  },

  initSvg: function (svg) {
    this.svg = svg;
  },

  buildPaths: function () {
    this.paths  = [];
    this.length = 0;

    forEach.call(this.svg.querySelectorAll('path'), function (elem) {
      var path = this.buildPath(elem);

      this.paths.push(path);
      this.length += path.length;
    }, this);
  },

  buildPath: function (elem) {
    var length = elem.getTotalLength();

    elem.style.strokeDasharray  = length + ' ' + length;
    elem.style.strokeDashoffset = length;

    return {
      elem:   elem,
      length: length,
      offset: length
    };
  },

  refresh: function () {
    return this.strategy();
  },

  sequential: function () {
    this.inc  = this.inc  || (this.length / this.duration) / this.frequency;
    this.path = this.path || this.paths.shift();

    var path = this.path;
    var elem = path.elem;

    path.offset = Math.max(path.offset - this.inc, 0);
    elem.style.strokeDashoffset = path.offset;

    if (path.offset === 0) {
      elem.style.strokeDasharray  = null;
      elem.style.strokeDashoffset = null;

      this.path = this.paths.shift();
    }

    return this.path != null;
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require("ramda");

var _qPrime = require("@standard-library/q-prime");

var _kefir = require("kefir");

var offsetAbove = function offsetAbove(y, element) {
  return y > offsetTop(element);
};

var bottomAbove = function bottomAbove(y, element) {
  return y < offsetTop(element) + element.offsetHeight;
};

var offsetTop = function offsetTop(element) {
  if (!element.getClientRects().length) {
    return 0;
  }

  var rect = element.getBoundingClientRect();
  var win = element.ownerDocument.defaultView;

  return rect.top + win.pageYOffset;
};

function illume(attribute) {
  var getName = function getName(a) {
    return a.dataset[attribute];
  };
  var areas = (0, _qPrime.query)("[data-" + attribute + "]");
  var names = areas.map(getName);
  var scroll = _kefir.Kefir.fromEvents(window, "scroll");
  var resize = _kefir.Kefir.fromEvents(window, "resize");
  var redraw = _kefir.Kefir.merge([scroll, resize]);

  var scrollY = redraw.map(function () {
    return window.scrollY;
  });
  var windowHeight = redraw.map(function () {
    return window.innerHeight;
  });
  var visibileY = _kefir.Kefir.combine([scrollY, windowHeight], function (y, h) {
    return y + h;
  });
  var viewedAreas = visibileY.map(function (y) {
    return areas.filter(function (a) {
      return offsetAbove(y, a);
    });
  });

  var lastViewedArea = viewedAreas.map(function (as) {
    return as[as.length - 1];
  });
  var activeArea = lastViewedArea.map(function (element) {
    if (element && bottomAbove(window.scrollY, element)) {
      return element;
    }
  }).toProperty().skipDuplicates();

  var active = activeArea.map(getName);
  var inactive = active.map(function (a) {
    return names.filter(function (n) {
      return n !== a;
    });
  }).map(_ramda.uniq).flatten();

  return {
    active: active,
    inactive: inactive
  };
}

exports.default = illume;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var uniq = function uniq(arr, select) {
  var len = arr.length;
  var ret = [];
  var v;

  select = select ? select instanceof Array ? select : [select] : false;

  for (var i = 0; i < len; i++) {
    v = arr[i];
    if (select && !~indexOf(select, v)) {
      ret.push(v);
    } else if (!~indexOf(ret, v)) {
      ret.push(v);
    }
  }
  return ret;
};

var DEFAULT_Y = function DEFAULT_Y() {
  var scroll = _kefir.Kefir.fromEvents(window, "scroll");
  var resize = _kefir.Kefir.fromEvents(window, "resize");
  var redraw = _kefir.Kefir.merge([scroll, resize]);

  return redraw.map(function () {
    return window.scrollY;
  });
};

var DEFAULT_HEIGHT = function DEFAULT_HEIGHT() {
  var scroll = _kefir.Kefir.fromEvents(window, "scroll");
  var resize = _kefir.Kefir.fromEvents(window, "resize");
  var redraw = _kefir.Kefir.merge([scroll, resize]);

  return redraw.map(function () {
    return window.innerHeight;
  });
};

function illume(attribute) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$scrollY = _ref.scrollY,
      scrollY = _ref$scrollY === undefined ? DEFAULT_Y() : _ref$scrollY,
      _ref$windowHeight = _ref.windowHeight,
      windowHeight = _ref$windowHeight === undefined ? DEFAULT_HEIGHT() : _ref$windowHeight;

  var getName = function getName(a) {
    return a.dataset[attribute];
  };
  var areas = (0, _qPrime.query)("[data-" + attribute + "]");
  var names = areas.map(getName);

  var visibleY = _kefir.Kefir.combine([scrollY, windowHeight], function (y, h) {
    return y + h;
  });
  var viewedAreas = visibleY.map(function (y) {
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
  }).map(uniq).flatten();

  return {
    active: active,
    inactive: inactive
  };
}

exports.default = illume;
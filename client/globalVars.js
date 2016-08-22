/**
 * globalVars.js set globals under running mode (browser, node.js) ongoing.
 *
 * Tetsuya Chiba, Aug/16/2016
 */

var globalVars = function () {
  if (typeof window === 'undefined' || window === null) { // running under node.js.
    if (typeof jquery === 'undefined' || jquery === null) {
      var jsdom     = require('node-jsdom').jsdom,
          doc       = jsdom('<div id="calendar"></div>'),
          win       = doc.parentWindow,
          _jQuery   = new require('jquery')(win);
      this.window   = win;
      this.document = doc;
      this.jQuery   = _jQuery;
    } else { // jsdom version of jquery is up running.
      var doc       = jsdom('<div id="calendar"></div>'),
          win       = doc.parentWindow;
      this.window   = win;
      this.document = doc;
      this.jQuery = jquery;
    }
    this.isNode = true;
  } else { // running within browser. assuming jQuery is up running.
    this.window   = window;
    this.document = document;
    this.jQuery   = jQuery;
    this.isNode   = false;
  }
};
globalVars.prototype._global     = (function () {
  if (globalVars.isNode) {
    if (typeof global === 'undefined' || global === null) {
      return {};
    } else {
      return global;
    }
  } else {
    return window;
  }
})();
globalVars.prototype.localStrage = (function () {
  var _localStrage;
  if (typeof localStorage === 'undefined' || localStorage === null) {
    _localStrage = require('node-localstorage').LocalStorage;
    return new _localStrage('./scratch');
  } else {
    return localStorage;
  }
})();
globalVars.prototype.moment      = (function () {
  if (typeof moment === 'undefined' || moment === null) {
    return require('moment');
  } else {
    return moment;
  }
})();
globalVars.prototype.Set         = (function () {
  if (typeof Set === 'undefined' || Set === null) {
    var ___set            = function () {
    }, __set              = function () {
    }, _set               = function () {
    };
    ___set.prototype      = Array.prototype;
    __set.prototype       = new ___set();
    _set.prototype        = new __set(); // avoid global pollution.
    _set.prototype.add    = function (m) {
      this.push(m);
      return this;
    };
    _set.prototype.delete = function (m) {
      var i;
      if (0 <= (i = this.findIndex(function (e) {
          return e === m;
        }))) {
        this.slice(i, 1);
        return true;
      } else {
        return false;
      }
    };
    _set.prototype.has    = function (m) {
      if (this.find(m)) {
        return true;
      } else {
        return false;
      }
    };
    return _set;
  } else {
    return Set;
  }
})();
//module.exports                   = globalVars;
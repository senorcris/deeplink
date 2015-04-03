(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {
    'use strict';
    var exports = {};
    var delay = 1200;
    var isIOS = function() {
      return (new RegExp('ipod|ipad|itouch|iphone', 'igm').test(navigator.userAgent));
    };
    var isAndroid = function() {
      return (new RegExp('android', 'igm').test(navigator.userAgent));
    };

    var userAgent = (function() {
        if (isAndroid()) {
            return {
                name: 'android',
                store: 'https://play.google.com/store/apps/details?id='
            };
        } else if (isIOS()) {
            return {
                name: 'iOS',
                store: 'https://itunes.apple.com/en/app/id'
            };
        }

        return {};
    })();

    // Get current time in ms
    var getTime = function() {
        return new Date().getTime();
    };

    var open = function(url) {
        window.location.href = url;
    };

    var noop = function(){};

    // Parse a single element
    var parseElement = function(el) {
        var _onClick = noop;
        var clicked, timeout,
            OS = userAgent,
            href = el.getAttribute('href'),
            app = el.getAttribute('data-app-' + OS.name) || el.getAttribute('data-app'),
            store = el.getAttribute('data-store-' + OS.name) || el.getAttribute('data-store');

        if(OS && OS.name && app) {
            el.setAttribute('href', app);
            _onClick = function(e) {
                e.preventDefault();

                var win;

                // Store start time
                var start = getTime();
                clicked = true;

                // Timeout to detect if the link worked
                timeout = setTimeout(function() {
                    // Check if any of the values are unset
                    if(!clicked || !timeout) return;

                    // Get current time
                    var now = getTime();

                    // Reset things
                    clicked = false;
                    timeout = null;

                    // Has the user left the screen? ABORT!
                    if(now - start >= delay * 2) return;

                    // Open store or original link
                    if(store) open(OS.store + store);
                    else if(href) open(href);
                }, delay);

                // Go to app
                win = open(app);
            };
        }

        return _onClick;
    };

    exports.parseElement = parseElement;
    exports.isDeeplink = function (parseElementResult) {
        return !(parseElementResult === noop);
    };

    return exports;
});

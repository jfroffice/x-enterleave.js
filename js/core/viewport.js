'use strict';

var am = am || {};
am.viewport = (function () {

    function getTopOffset(elm) {
        var offsetTop = 0;
        do {
            if (!isNaN(elm.offsetTop)) {
                offsetTop += elm.offsetTop;
            }
        } while (elm = elm.offsetParent);

        return offsetTop;
    }

    function getViewportH() {
        var client = window.document.documentElement.clientHeight,
            inner = window.innerHeight;

        return (client < inner) ? inner : client;
    }

    return {
        isInside: function (elm, h) {
            var topV = window.pageYOffset,
                heightV = getViewportH(),
                bottomV = topV + heightV,
                height = elm.offsetHeight,
                top = getTopOffset(elm);

            h = h || 0.5;

            return ((top + height) >= (topV + h * height))
                && (top <= (bottomV - h * height)) ||
                (elm.currentStyle ? elm.currentStyle :
                    window.getComputedStyle(elm, null)).position == 'fixed';
        }
    };

})();

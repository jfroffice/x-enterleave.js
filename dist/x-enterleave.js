/**
 * x-enterleave.js - HTML attribute to add dynamic CSS modifier on classes
 * @version v0.1.4
 * @link https://github.com/jfroffice/x-enterleave.js
 * @license MIT
 */
'use strict';

var am = am || {};
am.viewport = (function () {
    "use strict";

    function getOffset(elm) {
        var offsetTop = 0,
            offsetLeft = 0;

        do {
            if (!isNaN(elm.offsetTop)) {
                offsetTop += elm.offsetTop;
            }
            if (!isNaN(elm.offsetLeft)) {
                offsetLeft += elm.offsetLeft;
            }
        } while (elm = elm.offsetParent);

        return {
            top: offsetTop,
            left: offsetLeft
        };
    }

    function getViewportH() {
        var client = window.document.documentElement.clientHeight,
            inner = window.innerHeight;

        return (client < inner) ? inner : client;
    }

    return {
        isInside: function (elm, h) {
            var scrolled = window.pageYOffset,
                viewed = scrolled + getViewportH(),
                elH = elm.offsetHeight,
                elTop = getOffset(elm).top,
                elBottom = elTop + elH;

            h = h || 0.5;

            return (elTop + elH * h) <= viewed && (elBottom) >= scrolled ||
                (elm.currentStyle ? elm.currentStyle :
                    window.getComputedStyle(elm, null)).position == 'fixed';
        }
    };

})();

'use strict';

var am = am || {};
am.sequencer = (function (viewport, undefined) {

    function update(elm, from, to) {
        elm.classList.remove(from);

        if (!elm.classList.contains(to)) {
            elm.classList.add(to);
        }
    }

    return {
        init: function (options) {
            this.enterleave = options.enterleave;
            this.element = options.element;
            return this;
        },
        updateState: function () {
            var elm = this.element;
            if (viewport.isInside(elm)) {
                update(elm, 'leave', 'enter');
            } else {
                update(elm, 'enter', 'leave');
            }
        }
    };

})(am.viewport);

'use strict';

var am = am || {};
am.start = (function (sequencer, v, undefined) {

    var sequencers = [],
        enterLeave;

    function updateFn() {

        if (enterLeave) {
            clearTimeout(enterLeave);
        }

        enterLeave = setTimeout(function () {
            sequencers.forEach(function (s) {
                if (s.enterleave) {
                    s.updateState();
                }
            });

        }, 10);
    }

    window.addEventListener('load', updateFn);
    window.addEventListener('resize', updateFn);
    window.addEventListener('scroll', updateFn);

    return function () {
        [].forEach.call(document.querySelectorAll('[x-enterleave]'), function (element) {
            sequencers.push(
                Object.create(sequencer).init({
                    element: element,
                    enterleave: true
                }));
        });
    };

})(am.sequencer, am.viewport);

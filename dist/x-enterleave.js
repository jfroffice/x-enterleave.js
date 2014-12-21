/**
 * x-enterleave.js - HTML attribute to add dynamic CSS modifier on classes
 * @version v0.1.9
 * @link https://github.com/jfroffice/x-enterleave.js
 * @license MIT
 */
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

    [].forEach.call(document.querySelectorAll('html'), function(element) {

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {

                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    var elements = document.querySelectorAll('[x-enterleave]');
                    if (elements.length !== sequencers.length) {

                        sequencers = [];
                        [].forEach.call(elements, function (element) {
                            sequencers.push(
                                Object.create(sequencer).init({
                                    element: element,
                                    enterleave: true
                                }));
                        });

                        updateFn();
                    }
                }
            });
        });

        observer.observe(element, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
    });

    window.addEventListener('resize', updateFn);
    window.addEventListener('scroll', updateFn);

})(am.sequencer, am.viewport);

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

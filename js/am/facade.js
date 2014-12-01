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

    window.addEventListener('load', function() {

        [].forEach.call(document.querySelectorAll('body'), function(element) {

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {

                    if (mutation.addedNodes.length || mutation.removedNodes.length) {
                        var elements = document.querySelectorAll('[x-enterleave]');
                        if (elements.length !== sequencers.length) {

                            //console.log('update sequencers list');
                            sequencers = [];
                            [].forEach.call(elements, function (element) {
                                sequencers.push(
                                    Object.create(sequencer).init({
                                        element: element,
                                        enterleave: true
                                    }));
                            });

                            //console.log(sequencers.length);
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
    });

    window.addEventListener('resize', updateFn);
    window.addEventListener('scroll', updateFn);

})(am.sequencer, am.viewport);

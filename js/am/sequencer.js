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

'use strict';

var am = am || {};
am.sequencer = (function(prefix, viewport, events, undefined) {

	function update(elm, from, from2, to, to2) {
		elm.classList.remove(from);
		elm.classList.remove(from2);

		if (!elm.classList.contains(to) &&
			!elm.classList.contains(to2)) {

			elm.classList.add(to);
		}
	}

	return {
		init: function(options) {
			this.enterleave = options.enterleave;
			this.element = options.element;
			return this;
		},
		updateState: function() {
			var elm = this.element;
			if (viewport.isInside(elm)) {
				update(elm, 'leaving', 'leaved', 'entering', 'entered');
			} else {
				update(elm, 'entering', 'entered', 'leaving', 'leaved');
			}
		}
	};

})(am.prefix, am.viewport, events);

'use strict';

var am = am || {};
am.sequencer = (function(prefix, viewport, events, undefined) {

	return {
		init: function(options) {
			this.enterleave = options.enterleave;
			this.element = options.element;
			return this;
		},
		updateState: function() {
			var elm = this.element;
			if (viewport.isInside(elm)) {

				elm.classList.remove('leaving');
				elm.classList.remove('leaved');

				if (!elm.classList.contains('entering') &&
					!elm.classList.contains('entered')) {

					elm.classList.add('entering');
					events.one(elm, prefix.TRANSITION_END_EVENT, function() {

						// force clean
						elm.classList.remove('leaved');

						elm.classList.remove('entering');
						elm.classList.add('entered');
					});
				}

			} else {

				elm.classList.remove('entering');
				elm.classList.remove('entered');

				if (!elm.classList.contains('leaving') &&
					!elm.classList.contains('leaved')) {

					elm.classList.add('leaving');
					events.one(elm, prefix.TRANSITION_END_EVENT, function() {

						// force clean
						elm.classList.remove('entered');

						elm.classList.remove('leaving');
						elm.classList.add('leaved');
					});
				}
			}
		}
	};

})(am.prefix, am.viewport, events);

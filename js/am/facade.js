'use strict';

var am = am || {};
am.start = (function(sequencer, v, events, undefined) {

	var sequencers = [],
		enterLeave;

	events.on(window, 'load resize scroll', function() {
		if (enterLeave) {
			clearTimeout(enterLeave);
		}

		enterLeave = setTimeout(function() {
			sequencers.forEach(function(s) {
				if (s.enterleave) {
					s.updateState();
				}
			});

		}, 10);
	});

	return function() {
		[].forEach.call(document.querySelectorAll('[x-enterleave]'), function(element) {
			sequencers.push(
				Object.create(sequencer).init({
					element: element,
					enterleave: true
				}));
		});
	};

})(am.sequencer, am.viewport, this.events);

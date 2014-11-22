am.sequencer = (function(prefix, viewport, undefined) {
	"use strict";

	function changeState(elm, inputs, outputs) {
		var bFind;

		var toRemove = [];

		[].forEach.call(elm.classList, function(val) {
			if (val.indexOf(inputs[0]) !== -1 ||
				val.indexOf(inputs[1]) !== -1) {
				console.log(toRemove);
				toRemove.push(val);
				elm.classList.remove(val);
			} else if (val.indexOf('--') === -1) {
				var tmp = val + outputs[0];
				if (!elm.classList.contains(tmp) &&
					!elm.classList.contains(val + outputs[1])) {
					elm.classList.add(tmp);
					bFind = true;
				}
			}
		});

		return bFind;
	}

	function onTransitionChangeState(elm, source, target) {
		events.one(elm, prefix.TRANSITION_END_EVENT, function() {
			[].forEach.call(elm.classList, function(val) {
				if (val.indexOf(source) !== -1) {
					elm.classList.remove(val);
				// TODO: seems buggy for another modifer class !!!
				} else if (val.indexOf('--') === -1) {
					var tmp = val + target;
					if (!elm.classList.contains(tmp)) {
						elm.classList.add(tmp);
					}
				}
			});
		});
	}

	return {
		init: function(options) {
			this.enterleave = options.enterleave;
			this.element = options.element;
			return this;
		},
		updateState: function(state, force) {
			var elm = this.element;

			if (viewport.isInside(elm)) {
				if (changeState(elm, ['--leaving', '--leaved'],
									 ['--entering', '--entered'])) {
					// entering -> entered
					onTransitionChangeState(elm, '--entering', '--entered');
				}
			} else {
				if (changeState(elm, ['--entering', '--entered'],
								     ['--leaving', '--leaved'])) {

					onTransitionChangeState(elm, '--leaving', '--leaved');
				}
			}
		}
	};

})(am.prefix, am.viewport);

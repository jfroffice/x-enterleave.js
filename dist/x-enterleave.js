/**
 * x-enterleave.js - HTML attribute to add dynamic CSS modifier on classes
 * @version v0.1.0
 * @link https://github.com/jfroffice/x-enterleave.js
 * @license MIT
 */
// Event helper from jsCore v0.6.1 github.com/Octane/jsCore
var events = (function() {

    function off(eventDetails) {
       eventDetails.eventTypes.forEach(function (eventType) {
           eventDetails.element.removeEventListener(
               eventType,
               eventDetails.callback
               );
       });
    }

    function on(element, selector, eventTypes, callback) {
       var listener;
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       if (selector) {
           selector += ',' + selector + ' *';
           listener = function (event) {
               var target = event.target;
               if (target.matches && target.matches(selector)) {
                   if (callback.handleEvent) {
                       callback.handleEvent(event);
                   } else {
                       callback.call(element, event);
                   }
               }
           };
       } else {
           listener = callback;
       }
       if ('string' == typeof eventTypes) {
           eventTypes = eventTypes.split(/[\s,]+/);
       }
       eventTypes.forEach(function (eventType) {
           element.addEventListener(eventType, listener);
       });
       return {
           element: element,
           eventTypes: eventTypes,
           callback: listener
       };
    }

    function one(element, selector, eventTypes, callback) {
       var details;
       function listener(event) {
           off(details);
           if (callback.handleEvent) {
               callback.handleEvent(event);
           } else {
               callback.call(element, event);
           }
       }
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       details = on(element, selector, eventTypes, listener);
    }

    return {
        one: one,
        on: on,
        off: off
    };

})();

var am = {};
am.prefix = (function() {
	"use strict";

	var ANIMATION_END_EVENTS = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		TRANSITION_END_EVENTS = {
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		};

	function getPrefix(name) {
		var b = document.body || document.documentElement,
			s = b.style,
			v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
			p = name;

		if(typeof s[p] == 'string')
			return name;

		p = p.charAt(0).toUpperCase() + p.substr(1);
		for( var i=0; i<v.length; i++ ) {
			if(typeof s[v[i] + p] == 'string')
				return v[i] + p;
		}
		return false;
	}

	return {
		TRANSITION_END_EVENT: TRANSITION_END_EVENTS[getPrefix('transition')],
		ANIMATION_END_EVENT: ANIMATION_END_EVENTS[getPrefix('animation')]
	};

})();
am.viewport = (function() {
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
		isInside: function(elm, h) {
			var scrolled = window.pageYOffset,
				viewed = scrolled + getViewportH(),
				elH = elm.offsetHeight,
				elTop = getOffset(elm).top,
				elBottom = elTop + elH;

			h = h || 0.5;

			return (elTop + elH * h) <= viewed && (elBottom) >= scrolled || (elm.currentStyle? elm.currentStyle : window.getComputedStyle(elm, null)).position == 'fixed';
		}
	};

})();

am.sequencer = (function(prefix, viewport, undefined) {
	"use strict";

	function changeState(elm, inputs, outputs) {
		var bFind;

		[].forEach.call(elm.classList, function(val) {
			if (val.indexOf(inputs[0]) !== -1 ||
				val.indexOf(inputs[1]) !== -1) {
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

am.start = (function(sequencer, v, undefined) {
	"use strict";

	var sequencers = [],
		enterLeave;

	// add DOMLoaded ?    cf github
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

})(am.sequencer, am.viewport);

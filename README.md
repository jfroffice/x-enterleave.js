x-enterleave.js
===============
[![Build Status](https://travis-ci.org/jfroffice/x-enterleave.js.svg?branch=master)](https://travis-ci.org/jfroffice/x-enterleave.js)

###super fast and simple HTML attribute to add CSS classes .enter .leave to any DOM element

- None Dependency
- Developed for modern browsers
- 1.3KB minified and Gzipped

***

### [→ Demo ←](http://jfroffice.github.io/x-enterleave.js/)

***

How to start ?
-------------- 
Load JS file
```html
<script src="../x-enterleave.min.js"></script>
```

How to use ?
------------
Add x-enterleave in you DOM
```html
<div class="box" x-enterleave></div>
```

```css
.box {
	opacity: 0.2;
	transform: translate3d(-100px, 0, 0) scale3d(1.1, 1.1, 1);
	transition: all 0.7s ease-in-out;
}

.box.enter {
    opacity: 1.0;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    transition: all 0.7s ease-in-out;
}
```

Release History
---------------
- v0.1.6 - bower version
- v0.1.5
    - update viewport element.isInside() computation
    - using MutationObserver to remove start() function
    - add restart when DOM elements are added dynamically
- v0.1.4 - remove onEvent binding
- v0.1.3 - remove transition binding
- v0.1.2 - publish bower version
- v0.1.1 - simplify class state algorithm
- v0.1.0 - initial revision

License
-------
MIT

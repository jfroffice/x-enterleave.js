x-enterleave.js
===============
super fast and simple HTML attribute to add CSS classes .entering .entered .leaving .leaved to any DOM element

- None Dependency
- Developed for modern browsers
- 1.8KB minified and Gzipped

How to start 
------------ 
Add JS dependency
```html
<script src="../x-enterleave.min.js"></script>
```

At the end of DOM
```html
<script> am.start(); </script>
```

How to use 
---------- 
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

.box.entering {
  opacity: 0.8;
  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  transition: all 0.7s ease-in-out;
}

.box.entered {
  opacity: 1.0;
  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  transition: all 0.7s ease-in-out;
}
```

Roadmap
-------
- Add live starting and remove am.start(); call

Release History
---------------
- v0.1.1: simplify class state algorithm
- v0.1.0: initial revision

License
-------
Copyright (c) 2014 John Fischer
Licensed under the MIT license.

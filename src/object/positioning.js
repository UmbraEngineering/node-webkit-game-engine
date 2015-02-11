
var dom = require('../dom');

// 
// Initializes positioning for the object
// 
// @return void
// 
exports._initPositioning = function() {
	var x = 0;
	var y = 0;

	dom.css.set(this.elem, {
		position: 'absolute',
		top: '0px',
		left: '0px'
	});

	// Define the getter/setter for `x`
	Object.defineProperty(this, 'x', {
		get: function() {
			return x;
		},
		set: function(value) {
			if (isNaN(value)) {
				throw new Error('Bad position value for x, not a number');
			}

			x = value;
			return dom.css.set(this.elem, {
				left: value + 'px'
			});
		}
	});

	// Define the getter/setter for `y`
	Object.defineProperty(this, 'y', {
		get: function() {
			return y;
		},
		set: function(value) {
			if (isNaN(value)) {
				throw new Error('Bad position value for y, not a number');
			}

			y = value;
			return dom.css.set(this.elem, {
				top: value + 'px'
			});
		}
	});
};

// -------------------------------------------------------------
	
// 
// Moves the object in the given direction
// 
// @param {x} x distance to move
// @param {y} y distance to move
// @return void
// 
exports.move = function(x, y) {
	if (x) {
		this.x += x;
	}
	if (y) {
		this.y += y;
	}
};

// -------------------------------------------------------------

// 
// Get the current rendered width of the object
// 
// @return number
// 
exports.width = function() {
	return this.elem.offsetWidth;
};

// 
// Get the current rendered height of the object
// 
// @return number
// 
exports.height = function() {
	return this.elem.offsetHeight;
};

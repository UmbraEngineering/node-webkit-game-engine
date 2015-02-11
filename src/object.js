
var core        = require('./index');
var dom         = require('./dom');
var loop        = require('./loop');
var conf        = require('./config');
var GameObject  = require('./game-object');
var merge       = require('merge-recursive');

// 
// Define the custom object element
// 
dom.register(conf.elems.object, null, {
	display: 'block'
});

// 
// Define the "object" type
// 
var Obj = module.exports = GameObject.extend({

	name: 'object',

	// 
	// Default options for new instances
	// 
	defaults: {
		// The scope that the object will be rendered to
		scope: core.canvas
	},

	// 
	// Initialize
	// 
	init: function(options) {
		this._super();

		// Create the options object
		this.options = merge({ }, this.defaults, options || { });

		// The `define` method, if given, is run once, the first time this sprite is ever used. It
		// is useful for bootstrapping code, like image preloading (if not done in css) or defining
		// extra rules
		if (typeof this.define === 'function' && ! Obj.__defined) {
			Object.defineProperty(Obj, '__defined', {
				value: true,
				writeable: false,
				configurable: false,
				enumerable: false
			});
			this.define();
		}

		// Create the element that draws this object
		this.elem = dom.create(conf.elems.object, {
			id: 'ge-' + this.id,
			name: this.name,
			class: this.name
		});

		// Initialize the object's sprite
		if (this.sprite) {
			this.sprite = new this.sprite(this.elem);
		}

		// Initializes positioning getters/setters
		this._initPositioning();

		// Call the initialize method if one is defined
		if (typeof this.initialize === 'function') {
			this.initialize.apply(this, arguments);
		}

		// If there is a step method, start running it on loop steps
		if (typeof this.step === 'function') {
			this.step = this.step.bind(this);
			loop.on('step', this.step);
		}
	},

	// 
	// Initializes positioning for the object
	// 
	// @return void
	// 
	_initPositioning: function() {
		dom.css.set(this.elem, {
			position: 'absolute',
			top: '0px',
			left: '0px'
		});

		// Define the getter/setter for `x`
		Object.defineProperty(this, 'x', {
			get: function() {
				return parseFloat(dom.css.get(this.elem, 'left'));
			},
			set: function(value) {
				return dom.css.set(this.elem, {
					left: value + 'px'
				});
			}
		});

		// Define the getter/setter for `y`
		Object.defineProperty(this, 'y', {
			get: function() {
				return parseFloat(dom.css.get(this.elem, 'top'));
			},
			set: function(value) {
				return dom.css.set(this.elem, {
					top: value + 'px'
				});
			}
		});
	},

// -------------------------------------------------------------

	// 
	// The default draw method, this can be overriden to define a more
	// specific draw routine
	// 
	// @return void
	// 
	draw: function() {
		this.render();
	},
	
	// 
	// Renders the object's DOM element to the scope
	// 
	// @return void
	// 
	render: function() {
		if (this.sprite) {
			this.sprite.draw();
		}
		this.options.scope.appendChild(this.elem);
	},

// -------------------------------------------------------------
	
	// 
	// Moves the object in the given direction
	// 
	// @param {x} x distance to move
	// @param {y} y distance to move
	// @return void
	// 
	move: function(x, y) {
		this.x += x;
		this.y += y;
	},

// -------------------------------------------------------------
	
	// 
	// Destroy the object, removing it from the DOM and preparing the
	// whole thing for garbage collection
	// 
	// @return void
	// 
	destroy: function() {
		var self = this;

		if (typeof this.teardown === 'function') {
			this.teardown();
		}

		if (typeof this.step === 'function') {
			loop.removeListener('step', this.step);
		}

		Object.keys(this._sprites).forEach(function(name) {
			self._sprites[name].destroy();
			self._sprites[name] = null;
		});

		this.elem.innerHTML = '';

		if (this.elem.parentNode) {
			this.elem.parentNode.removeChild(this.elem);
		}

		for (var i in this) {
			this[i] = null;
		}
	}

});

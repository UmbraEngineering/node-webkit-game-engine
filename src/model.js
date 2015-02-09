
var core        = require('./index');
var dom         = require('./dom');
var loop        = require('./loop');
var GameObject  = require('./game-object');
var merge       = require('merge-recursive');

var Model = module.exports = GameObject.extend({

	tagName: 'div',

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

		// Create the element that draws this object
		this.elem = dom.create(this.tagName, {
			id: 'go-' + this.id
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


var core        = require('./index');
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
		this.options = merge({ }, this.defaults, options);

		// Create the element that draws this object
		this.elem = document.createElement(this.tagName);
		this.elem.id = 'go-' + this.id;

		// Create all the needed sprite instances
		this._initSprites();

		// Call the initialize method if one is defined
		if (typeof this.initialize === 'function') {
			this.initialize.apply(this, arguments);
		}
	},

	// 
	// Initialize sprite instances
	// 
	// @return void
	// 
	_initSprites: function() {
		var self = this;

		this._sprites = { };
		this._currentSprite = null;

		if (this.sprites) {
			Object.keys(this.sprites).forEach(function(name) {
				self._sprites[name] = new self.sprites[name](self.elem);
			});
		}
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
		this.scope.appendChild(this.elem);
	},

	// 
	// Renders the given sprite to the element
	// 
	// @param {name} the sprite name
	// @return void
	// 
	setSprite: function(name) {
		if (this._currentSprite !== name) {
			this._currentSprite = name;
			this._sprites[name].render();
		}
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

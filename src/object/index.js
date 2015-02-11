
var core          = require('../index');
var dom           = require('../dom');
var loop          = require('../loop');
var conf          = require('../config');
var GameObject    = require('../game-object');
var merge         = require('merge-recursive');

// 
// Define the custom object element
// 
dom.register(conf.elems.object, null, {
	display: 'block',
	userSelect: 'none'
});

// 
// A list of all currently existing object instances
// 
var instances = [ ];

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

		instances.push(this);

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
	// Initializes a compliant object mixin
	// 
	// @param {name} the mixin to initialize
	// @return void
	// 
	use: function(name) {
		// Convert to a method name (eg. "physics" => "_initPhysics")
		name = '_init' + name[0].toUpperCase() + name.slice(1);

		this[name]();
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

		for (var i = 0, c = instances.length; i < c; i++) {
			if (instances.id === this.id) {
				instances.splice(i--, 1);
				break;
			}
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

		this._super();
	}

});

// -------------------------------------------------------------

// 
// Expose the instance list
// 
Obj.instances = instances;

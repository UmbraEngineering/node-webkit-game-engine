
var dom         = require('./dom');
var conf        = require('./config');
var GameObject  = require('./game-object');
var merge       = require('merge-recursive');

// 
// Define the custom sprite element
// 
dom.register(conf.elems.sprite, null, {
	display: 'block'
});

// 
// The CSS sprite class creates a <div class="sprite" /> element that renders using your own
// CSS, intended for use with CSS keyframes for complex animated sprites.
// 
//   var PlayerSprite = Sprite.extend({
//     name: 'player'
//   });
// 
//   .player.sprite {
//     width: 32px;
//     height: 32px;
//     background: url('...') left center;
//     animation: player-sprite .8s steps(1) infinite;
//   }
// 
//   @keyframes player-sprite {
//     100% { background-position: -64px; }
//   }
// 
var Sprite = module.exports = GameObject.extend({

	name: null,
	state: null,
	states: null,

	init: function(scope) {
		this._super();

		this.scope = scope;
		this.state = merge({ }, this.state || { });

		// The `define` method, if given, is run once, the first time this sprite is ever used. It
		// is useful for bootstrapping code, like image preloading (if not done in css) or defining
		// extra rules
		if (typeof this.define === 'function' && ! Sprite.__defined) {
			Object.defineProperty(Sprite, '__defined', {
				value: true,
				writeable: false,
				configurable: false,
				enumerable: false
			});
			this.define();
		}

		if (typeof this.initialize === 'function') {
			this.initialize();
		}
	},

	draw: function() {
		this.render();
		this.scope.appendChild(this.elem);
	},

	render: function() {
		this.elem = document.createElement(conf.elems.sprite);
		this.elem.classList.add('sprite', this.name);
		
		var elem = this.elem;
		var state = this.state;

		if (state) {
			Object.keys(state).forEach(function(key) {
				elem.setAttribute(key, state[key]);
			});
		}
	},

	setState: function(state, value) {
		if (! this.states[state] || this.states[state].indexOf(value) < 0) {
			throw new Error('<Sprite:' + this.name + '>::setState - Cannot set state ' + state + '="' +
				value + '", state is not defined.');
		}

		this.state[state] = value;

		if (this.elem && this.elem.getAttribute(state) !== value) {
			this.elem.setAttribute(state, value);
		}
	},

	destroy: function() {
		this.elem.innerHTML = '';
		
		for (var i in this) {
			this[i] = null;
		}
	}

});

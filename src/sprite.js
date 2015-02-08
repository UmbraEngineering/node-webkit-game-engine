
var GameObject = require('./game-object');

// 
// The CSS sprite class creates a <div class="sprite" /> element that renders using your own
// CSS, intended for use with CSS keyframes for complex animated sprites.
// 
//   var PlayerSprite = Sprite.CSS.extend({
//     name: 'player'
//   });
// 
//   .player.sprite {
//     width: 32px;
//     height: 32px;
//     background: url('...') left center;
//     animation: player-sprite .8s steps(10) infinite;
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
		this.state = { };
		this.scope = scope;

		if (typeof this.initialize === 'function') {
			this.initialize();
		}
	},

	draw: function() {
		this.render();
		this.scope.appendChild(this.elem);
	},

	render: function() {
		this.elem = document.createElement('div');
		this.elem.classList.add('sprite', this.name);
		
		if (this.state) {
			this.elem.classList.add(this.state);
		}
	},

	setState: function(state, value) {
		if (this.elem) {
			// 
		}
	},

	destroy: function() {
		this.elem.innerHTML = '';
		
		for (var i in this) {
			this[i] = null;
		}
	}

});

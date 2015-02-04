
var GameObject = require('./game-object');

// 
// The basic sprite class simply creates an <img /> element with a given src/width/height
// 
var Sprite = module.exports = GameObject.extend({

	width: 32,
	height: 32,
	src: null,

	init: function(elem) {
		this._super();
	},

	draw: function() {
		this.elem.innerHTML = this.render();
	},
	
	render: function() {
		return '<img src="' + this.src + '" width="' + this.width + '" height="' + this.height + '" />';
	}

});



// -------------------------------------------------------------

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
var CssSprite = Sprite.CSS = Sprite.extend({

	init: function() {
		this._super();
	},

	render: function() {
		return '<div class="sprite ' + this.name + '"></div>';
	}

});

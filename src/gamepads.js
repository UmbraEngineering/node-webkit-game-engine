
var GameObejct     = require('./game-object');
var EventEmitter2  = require('eventemitter2').EventEmitter2;

exports = module.exports = new EventEmitter2({
	delimiter: '::',
	wildcard: true
});

var gamepads = Array(4);

// Button indexes used in GamePad::buttons
var BUTTONS = {
	// Face (main) buttons
	FACE_1: 0,
	FACE_2: 1,
	FACE_3: 2,
	FACE_4: 3,

	// Top shoulder buttons
	LEFT_SHOULDER: 4,
	RIGHT_SHOULDER: 5,

	// Bottom shoulder buttons
	LEFT_SHOULDER_BOTTOM: 6,
	RIGHT_SHOULDER_BOTTOM: 7,

	// Start/select
	SELECT: 8,
	START: 9,

	// Analogue sticks (if depressible)
	LEFT_ANALOGUE_STICK: 10,
	RIGHT_ANALOGUE_STICK: 11,

	// Directional (discrete) pad
	PAD_TOP: 12,
	PAD_BOTTOM: 13,
	PAD_LEFT: 14,
	PAD_RIGHT: 15
};

// Axes indexes used in GamePad::axes
var AXES = {
	LEFT_ANALOGUE_HOR: 0,
	LEFT_ANALOGUE_VERT: 1,
	RIGHT_ANALOGUE_HOR: 2,
	RIGHT_ANALOGUE_VERT: 3
};

// -------------------------------------------------------------

// 
// GamePad wrapper class
// 
var GamePad = exports.GamePad = GameObject.extend({

	// 
	// Initialize
	// 
	init: function(rawGamepad) {
		var self = this;

		this._super();

		this.raw = rawGamepad;
		this.id = this.raw.id;
		this.index = this.raw.index;

		gamepads[this.index] = this;

		// Define a getter to read and return `raw.connected`
		createGetter(this, 'connected', function() {
			return self.raw.connected;
		});

		// Define a getter to read and return `raw.axes`
		createGetter(this, 'axes', function() {
			return self.raw.axes;
		});

		// Define a getter to read and return `raw.buttons`
		createGetter(this, 'buttons', function() {
			return self.raw.buttons;
		});
	},

	// 
	// Get the value of a specific button
	// 
	// @param {index} the button to read
	// @return object
	// 
	button: function(index) {
		if (typeof index === 'string' && typeof BUTTONS[index] ===  'number') {
			index = BUTTONS[index];
		}
		return this.buttons[index];
	},

	// 
	// Check if the given button is above a given value threshold
	// 
	// @param {index} the button to read
	// @param {threshold} the threshold value
	// @return boolean
	// 
	buttonIsAboveThreshold: function(index, threshold) {
		return (this.button(index).value > threshold);
	},

	// 
	// Check if the given button is below a given value threshold
	// 
	// @param {index} the button to read
	// @param {threshold} the threshold value
	// @return boolean
	// 
	buttonIsBelowThreshold: function(index, threshold) {
		return (this.button(index).value < threshold);
	},

	// 
	// Get the value of a specific axis
	// 
	// @param {index} the axis to read
	// @return object
	// 
	axis: function(index) {
		if (typeof index === 'string' && typeof AXES[index] === 'number') {
			index = AXES[index];
		}
		return this.axes[index];
	},

	// 
	// Check if the given axis is above a given value threshold
	// 
	// @param {index} the axis to read
	// @param {threshold} the threshold value
	// @return boolean
	// 
	axisIsAboveThreshold: function(index, threshold) {
		return (this.axis(index) > threshold);
	},

	// 
	// Check if the given axis is below a given value threshold
	// 
	// @param {index} the axis to read
	// @param {threshold} the threshold value
	// @return boolean
	// 
	axisIsBelowThreshold: function(index, threshold) {
		return (this.axis(index) < threshold);
	}

});

// -------------------------------------------------------------

exports.getGamepads = function() {
	return gamepads.slice();
};

exports.getGamepad = function(index) {
	return exports.getGamepads()[index];
};

// -------------------------------------------------------------

exports.AXES = AXES;
exports.BUTTONS = BUTTONS;

// -------------------------------------------------------------

function init() {
	window.addEventListener('gamepadconnected', onConnect, false);
	window.addEventListener('gamepaddisconnected', onDisconnect, false);
}

function onConnect(event) {
	var gamepad = event.gamepad;
	var existing = gamepads[gamepad.index];

	if (existing && gamepad.index === existing.index && gamepad.id === existing.id) {
		if (gamepad !== existing.raw) {
			existing.raw = gamepad;
		}
	}

	else {
		gamepad = new GamePad(gamepad);
	}

	gamepads[gamepad.index] = gamepad;

	exports.emit('connect', gamepad);
}

function onDisconnect(event) {
	var gamepad = gamepads[event.gamepad.index];

	exports.emit('disconnect', gamepad);
}

function createGetter(obj, prop, func) {
	Object.defineProperty(obj, prop, {
		enumerable: true,
		configurable: true,
		writable: false,
		get: func
	});
}

init();

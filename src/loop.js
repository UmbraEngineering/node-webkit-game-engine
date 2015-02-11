
var GameObject = require('./game-object');

exports = module.exports = new GameObject();
exports.frameDelta = 0;

var start;
var lastFrame;
var prevFpsValues = [ ];

// Start looping ..
window.requestAnimationFrame(step);

// -------------------------------------------------------------

// 
// Runs on each animation frame
// 
// @param {timestamp} the timestamp of the frame
// @return void
// 
function step(timestamp) {
	try {
		exports.emit('step', createStepObject(timestamp));
	}

	// Make sure we always queue up the next frame, even in the case of an error
	finally {
		window.requestAnimationFrame(step);
	}
}

// -------------------------------------------------------------

// 
// Returns a "step" object, containing information about the current state
// of the frame loop
// 
// @param {timestamp} the current timestamp
// @return object
// 
function createStepObject(timestamp) {
	// Runs on the first loop
	if (! start) {
		start = timestamp;
		lastFrame = timestamp;
		fps = 0;
	}

	// Calculate approx fps
	exports.frameDelta = (timestamp - lastFrame);
	lastFrame = timestamp;

	var delta = exports.frameDelta / 1000;
	prevFpsValues.push(1 / exports.frameDelta);
	
	if (prevFpsValues.length > 5) {
		prevFpsValues.shift();
	}

	// Return the "step" object
	return {
		timestamp: timestamp,
		running: timestamp - start,
		fps: average(prevFpsValues),
		delta: exports.frameDelta
	};
}

// 
// Averages an array of numbers
// 
// @param {arr} the array to average
// @return number
// 
function average(arr) {
	var sum = arr.reduce(function(a, b) {
		return a + b;
	});
	return sum / arr.length;
}

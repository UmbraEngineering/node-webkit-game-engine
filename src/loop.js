
var GameObject = require('./game-object');

exports = module.exports = new GameObject();

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
	var delta = (timestamp - lastFrame) / 1000;
	lastFrame = timestamp;
	prevFpsValues.push(1 / delta);
	if (prevFpsValues.length > 5) {
		prevFpsValues.shift();
	}

	// Return the "step" object
	return {
		timestamp: timestamp,
		running: timestamp - start,
		fps: average(prevFpsValues)
	};
}

// 
// Averages an array of numbers
// 
// @param {arr} the array to average
// @return number
// 
function average(arr) {
	return arr.reduce(function(memo, value) {
		return memo + value;
	}, 0) / arr.length;
}

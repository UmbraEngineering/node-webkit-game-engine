
var keyboard    = require('../keyboard');
var gamepads    = require('../gamepads');
var GameObject  = require('../game-object');

var inputs = { };

// 
// Creates a new input
// 
// @param {name} the input's name for later reference
// @return object
// 
exports.defineInput = function(name) {
	return inputs[name] = new Input(name);
};

// 
// Test if an input is active
// 
// @param {name} the input's name
// @return boolean
// 
exports.test = function(name) {
	return inputs[name].test();
};

// -------------------------------------------------------------

// 
// Define the multi-source input class
// 
var Input = GameObject.extend({
	
	init: function(name) {
		this.name = name;
		this.tests = [ ];
	},

	addTest: function(test) {
		this.tests.push(test);
	},

	test: function() {
		for (var i = 0, c = this.tests.length; i < c; i++) {
			if (this.tests[i]()) {
				return true;
			}
		}
		return false;
	}

});

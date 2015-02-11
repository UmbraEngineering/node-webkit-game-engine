
var keypress = require('keypress.js');

var state = { };
var listener = new keypress.keypress.Listener();

// 
// Expose the key binding listener
// 
exports._listener = listener;

// 
// Tests if a specific key is pressed
// 
// @param {key} the key to test
// @return boolean
// 
exports.key = function(key) {
	return (exports.keys().indexOf(key) >= 0);
};

// 
// Get a list of currently active keys
// 
// @return array
// 
exports.keys = function() {
	return listener._keys_down.slice();
};

// -------------------------------------------------------------

// 
// Binds a simple combo
// 
// @param {combo} the combo to bind to
// @param {func} the function to bind
// @return void
// 
exports.simpleCombo = function(combo, func) {
	return listener.simple_combo(combo, func);
};

// 
// Binds a counting combo
// 
// @param {combo} the combo to bind to
// @param {func} the function to bind
// @return void
// 
exports.countingCombo = function(combo, func) {
	return listener.counting_combo(combo, func);
};

// 
// Binds a sequence combo
// 
// @param {combo} the combo to bind to
// @param {func} the function to bind
// @return void
// 
exports.sequenceCombo = function(combo, func) {
	return listener.sequence_combo(combo, func);
};

// 
// Unbinds a combo
// 
// @param {combo} the combo to unbind
// @return void
// 
exports.unregisterCombo = function(combo) {
	return listener.unregister_combo(combo);
};


require('keypress.js');

module.exports = window.keypress;

try {
	window.keypress = void(0);
	delete window.keypress;
} catch (e) { /* pass */ }

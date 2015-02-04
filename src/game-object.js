
var Class          = require('./class');
var EventEmitter2  = require('eventemitter2').EventEmitter2;

var GameObject = module.exports = Class.extend(EventEmitter2, {

	init: function() {
		EventEmitter2.call(this, {
			delimiter: '::',
			wildcard: true
		});
	}

});

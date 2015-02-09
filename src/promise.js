
// 
// Default to the built-in promise class if one exists, or load the polyfill
// 
var Promise = module.exports = window.Promise || require('promise-es6').Promise;

// 
// Extend the `Promise` class with some extra functions
// 
require('promise-extensions')
	.init(Promise)
	.install('defer')
	.install('guard')
	.install('ify')
	.install('wait');

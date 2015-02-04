
// 
// Default to the built-in promise class if one exists, or load the polyfill
// 
var Promise = module.exports = window.Promise || require('promise-es6').Promise;

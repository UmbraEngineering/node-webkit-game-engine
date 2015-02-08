
// 
// This file doesn't really do anything except expose the components defined in
// the other files ..
// 

// -------------------------------------------------------------

// 
// The canvas element, this is where the game is drawn
// 
exports.canvas = document.getElementsByTagName('main') || document.body;

// -------------------------------------------------------------

// 
// Expose the Class constructor
// 
exports.Class = require('./class');

// -------------------------------------------------------------

// 
// Expose the base GameObject class
// 
exports.GameObject = require('./game-object');

// -------------------------------------------------------------

// 
// Expose the Promise constructor
// 
exports.Promise = require('./promise');

// -------------------------------------------------------------

// 
// Expose the Model class, used for making in-game objects (like players, enemies, walls, etc.)
// 
exports.Model = require('./model');

// -------------------------------------------------------------

// 
// Expose the Sprite classes, used for rendering individual sprites
// 
exports.Sprite = require('./sprite');
exports.CssSprite = exports.Sprite.CSS;

// -------------------------------------------------------------

// 
// Expose the keypress library for binding to keyboard events
// 
exports.keypress = require('keypress.js');

// -------------------------------------------------------------

// 
// Expose the abstracted GamePads API
// 
exports.gamepads = require('./gamepads');

// -------------------------------------------------------------

// 
// Expose the game loop component
// 
exports.loop = require('./loop');



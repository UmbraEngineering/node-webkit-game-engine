
// 
// This file doesn't really do anything except expose the components defined in
// the other files ..
// 

// -------------------------------------------------------------

// 
// Expose the DOM module
// 
exports.dom = require('./dom');

// -------------------------------------------------------------

// 
// The canvas element, this is where the game is drawn
// 
exports.canvas = exports.dom.findOne('main') || document.body;

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
// Expose the Object class, used for making in-game objects (like players, enemies, walls, etc.)
// 
exports.Object = require('./object');

// -------------------------------------------------------------

// 
// Expose the Sprite classes, used for rendering individual sprites
// 
exports.Sprite = require('./sprite');

// -------------------------------------------------------------

// 
// Expose the room class, used for building game rooms
// 
exports.Room = require('./room');

// -------------------------------------------------------------

// 
// Expose the keyboard module for keybinding and event listening
// 
exports.keyboard = require('./keyboard');

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




var PhysicsEntity = require('./physics-entity');

// 
// Initializes the physics handling for an individual object `this`
// 
// @return void
// 
exports._initPhysics = function() {
	var entity = this.physics = new PhysicsEntity(this, this.physics);

	this.on('destroy', function() {
		entity.destroy();
	});
};

// 
// Accelerate horizontally
// 
// @param {accel} the new acceleration to apply
// @param {maxVelocity} the velocity at which to stop accelerating
// @return void
// 
exports.accelerateX = function(accel) {
	this.physics.ax = accel;
};

// 
// Accelerate vertically
// 
// @param {accel} the new acceleration to apply
// @param {maxVelocity} the velocity at which to stop accelerating
// @return void
// 
exports.accelerateY = function(accel) {
	this.physics.ay = accel;
};

// 
// Define the horizontal gravity influence on this object
// 
// @param {value} x axis gravity
// @return void
// 
exports.setGravityX = function(value) {
	this.physics.gravityX = value;
};

// 
// Define the vertical gravity influence on this object
// 
// @param {value} y axis gravity
// @return void
// 
exports.setGravityY = function(value) {
	this.physics.gravityY = value;
};

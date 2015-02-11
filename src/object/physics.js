
var PhysicsEntity = require('./physics-entity');

// 
// Gravity accelerations
// 
exports.gravityX = 0;
exports.gravityY = 0;

// 
// Initializes the physics handling for an individual object `this`
// 
// @return void
// 
exports._initPhysics = function() {
	var entity = this.physics = new PhysicsEntity(this);

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
	this.physics.ax = accel;
};

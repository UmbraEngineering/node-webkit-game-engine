
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

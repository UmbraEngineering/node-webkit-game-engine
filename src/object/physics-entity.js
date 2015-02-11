
var loop        = require('../loop');
var physics     = require('./physics');
var collision   = require('./collision');
var GameObject  = require('../game-object');
var Obj         = require('./index');

// 
// A list of all currently existing object instances
// 
var instances = [ ];

// 
// Handles all physics calculations for a single given object
// 
// Note: The PhysicsEntity mixin will assume that the Positioning mixin is already active
// 
// options:
//   type: "dynamic" or "kinematic"
//     "dynamic": affected by all physics (gravity, acceleration, etc)
//     "kinematic": not affected by gravity
//   collision: "none", "displace", or "elastic"
//     "displace": moves the object out of the collided space and zeros out velocity in that direction
//     "elastic": moves the object out of the collided space and "bounces" the object back the other way
//   restitusion: the "bouncyness" of an elastic collidee
// 
var PhysicsEntity = module.exports = GameObject.extend({

	maxVX: 1,
	maxVY: 1,

	init: function(object, options) {
		this._super();

		instances.push(this);

		options = options || { };

		// Define the object type as either "dynamic" or "kinematic"
		this.type = options.type || 'dynamic';

		// Define the collision handling as either "displace" or "elastic"
		this.collisionType = options.collision || 'displace';
		Collision[this.collisionType].call(this, options);

		// The Object instance this entity controls
		this.object = object;

		// Position
		this.x = this.object.x;
		this.y = this.object.y;

		// Velocity
		this.vx = 0;
		this.vy = 0;

		// Acceleration
		this.ax = 0;
		this.ay = 0;

		this.updateBounds();
	},

	// 
	// Update the width and height from the Object and recalculate the halfWidth/halfHeight
	// 
	// @return void
	// 
	updateBounds: function() {
		this.x = this.object.x;
		this.y = this.object.y;

		this.width = this.object.width();
		this.height = this.object.height();

		this.halfWidth = this.width * 0.5;
		this.halfHeight = this.height * 0.5;
	},

// -------------------------------------------------------------
	
	// 
	// Runs on each step, performing all physics calculations for this object
	// 
	// @return void
	// 
	step: function() {
		var delta = loop.frameDelta;
		var gx = 0;
		var gy = 0;

		this.updateBounds();

		// Apply gravity if needed
		if (this.type === 'dynamic') {
			gx = this.object.gravityX * delta;
			gy = this.object.gravityY * delta;
		}

		this.vx += this.ax * delta + gx;
		this.vy += this.ay * delta + gy;

		this.enforceMaxVelocity();

		this.x  += this.vx * delta;
		this.y  += this.vy * delta;

		var collisions = this.detectCollisions();
		collisions.forEach(function() {
			collision.resolve();
		});
	},

	// 
	// Make sure the object's velocity does not exceed it's max
	// 
	// @return void
	// 
	enforceMaxVelocity: function() {
		if (this.vx > this.maxVX) {
			this.vx = this.maxVX;
		}

		if (this.vx < -this.maxVX) {
			this.vx = -this.maxVX;
		}

		if (this.vy > this.maxVY) {
			this.vy = this.maxVY;
		}

		if (this.vy < -this.maxVY) {
			this.vy = -this.maxVY;
		}
	},
	
	// 
	// Apply all changes made back to the actual object
	// 
	// @return void
	// 
	apply: function() {
		this.object.x = this.x;
		this.object.y = this.y;
	},

// -------------------------------------------------------------

	// 
	// Determine the horizontal center point of the object
	// 
	// @return number
	// 
	midX: function() {
		return this.x + this.halfWidth;
	},

	// 
	// Determine the vertical center point of the object
	// 
	// @return number
	// 
	midY: function() {
		return this.y + this.halfHeight;
	},

	// 
	// Determine the top bound
	// 
	// @return number
	// 
	getTop: function() {
		return this.y;
	},

	// 
	// Determine the bottom bound
	// 
	// @return number
	// 
	getBottom: function() {
		return this.y + this.height;
	},

	// 
	// Determine the left bound
	// 
	// @return number
	// 
	getLeft: function() {
		return this.x;
	},

	// 
	// Determine the right bound
	// 
	// @return number
	// 
	getRight: function() {
		return this.x + this.width;
	},

// -------------------------------------------------------------

	// 
	// Finds any current collisions with other objects
	// 
	// @return array
	// 
	detectCollisions: function() {
		var self = this;
		var collisions = [ ];

		instances.forEach(function(entity) {
			if (entity === self) {
				return;
			}

			var collision = self.detectCollisionRect(entity);
			if (collision) {
				collisions.push(collision);
			}
		});

		return collisions;
	},
	
	// 
	// Detect if this object is colliding with another
	// 
	// @param {other} the other object to test against
	// @return boolean
	// 
	detectCollisionRect: function(other) {
		return collision.detectRect(this, other);
	},

// -------------------------------------------------------------
	
	// 
	// Destroy the instance
	// 
	// @return void
	// 
	destroy: function() {
		for (var i = 0, c = instances.length; i < c; i++) {
			if (instances.id === this.id) {
				instances.splice(i--, 1);
				break;
			}
		}

		this._super();
	}

});

// -------------------------------------------------------------

// 
// Collision type decorators
// 
var Collision = {
	none: function() {
		// pass
	},
	displace: function() {
		// pass
	},
	elastic: function(options) {
		this.restitution = options.restitution || 0.2;
	}
};

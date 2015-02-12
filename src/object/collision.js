
var Class = require('../class');

// 
// Detect collisions between two simple rectangular objects
// 
// @param {collider} the object that is colliding
// @param {collidee} the object being collided into
// @return boolean
// 
exports.detectRect = function(collider, collidee) {
	// If any of the edges are completely outside the collision area, than
	// we know there is no collision
	if (collider.getBottom() < collidee.getTop() ||
		collider.getTop() > collidee.getBottom() ||
		collider.getRight() < collidee.getLeft() ||
		collider.getLeft() > collidee.getRight()
	) {
		return false;
	}

	// Otherwise, there is a collision somewhere
	return new Collision(collider, collidee);
};

// -------------------------------------------------------------

// 
// Represents a single collision
// 
// @param {collider} the object that is colliding
// @param {collidee} the object being collided into
// 
var Collision = Class.extend({

	cornerThreshold: 0.1,
	stickyThreshold: 0.0004,

	init: function(collider, collidee) {
		this.collider = collider;
		this.collidee = collidee;

		// The collider's center point
		var aMidX = this.colliderMidX = this.collider.midX();
		var aMidY = this.colliderMixY = this.collider.midY();

		// The collidee's center point
		var bMidX = this.collideeMidX = this.collidee.midX();
		var bMidY = this.collideeMidY = this.collidee.midY();

		// The collision distance, used to determine the direction of collision
		this.dx = (bMidX - aMidX) / this.collidee.halfWidth;
		this.dy = (bMidY - aMidY) / this.collidee.halfHeight;

		// The absolute change in x and y
		this.absDx = Math.abs(this.dx);
		this.absDy = Math.abs(this.dy);

		// The difference between the x and y distances, used to determine if
		// colliding at the corner
		this.dxDyDiff = Math.abs(this.absDx - this.absDy);
	},

	// 
	// Call the appropriate resolver to handle the collision
	// 
	// @return void
	// 
	resolve: function() {
		return this[this.collidee.collisionType + 'Resolve']();
	},

	// 
	// Dummy resolver for non-colliding objects
	// 
	// @return void
	// 
	noneResolve: function() {
		// pass
	},

	// 
	// Handle the collision by displacement
	// 
	// @return void
	// 
	displaceResolve: function() {
		// The collider is approaching the collidee from the corner
		if (this.dxDyDiff < this.cornerThreshold) {
			this.verticalDisplace();
			this.horizontalDisplace();

			// Randomly select a direction (x or y) to stop velocity in
			var dir = (Math.random() < 0.5) ? 'vx' : 'vy';

			this.collider[dir] = 0;
		}

		// The collider is approaching the collidee horizontally
		else if (this.absDx > this.absDy) {
			this.horizontalDisplace();

			// Stop the velocity
			this.collider.dx = 0;
		}

		// The collider is approaching the collidee vertically
		else {
			this.verticalDisplace();

			// Stop the velocity
			this.collider.dy = 0;
		}

		// If the collidee has friction, slow down the collider in all directions
		if (this.collidee.friction) {
			var friction = 1 - this.collidee.friction;

			this.collider.ax *= friction;
			this.collider.ay *= friction;
			this.collider.vx *= friction;
			this.collider.vy *= friction;
		}
	},

	// 
	// Handle the collision by elastic reflection
	// 
	// @return void
	// 
	elasticResolve: function() {
		// The collider is approaching the collidee from the corner
		if (this.dxDyDiff < this.cornerThreshold) {
			this.verticalDisplace();
			this.horizontalDisplace();

			// Randomly select a direction (x or y) to reflect velocity in
			this.reflect((Math.random() < 0.5) ? 'vx' : 'vy');
		}

		// The collider is approaching the collidee horizontally
		else if (this.absDx > this.absDy) {
			this.horizontalDisplace();

			// Reduce/reflect the velocity
			this.reflect('dx');
		}

		// The collider is approaching the collidee vertically
		else {
			this.verticalDisplace();

			// Reduce/reflect the velocity
			this.reflect('dy');
		}

		// If the collidee has friction, slow down the collider in all directions
		if (this.collidee.friction) {
			var friction = 1 - this.collidee.friction;

			this.collider.ax *= friction;
			this.collider.ay *= friction;
			this.collider.vx *= friction;
			this.collider.vy *= friction;
		}
	},

// -------------------------------------------------------------
	
	// 
	// Displace the collider to the horizontal edge of the collidee
	// 
	// @return void
	// 
	horizontalDisplace: function() {
		// Collider is approaching from the right, displace right
		if (this.dx < 0) {
			this.collider.x = this.collidee.getRight();
		}
		// Collider is approaching from the left, displace left
		else {
			this.collider.x = this.collidee.getLeft() - this.collider.width;
		}
	},

	// 
	// Displace the collider to the vertical edge of the collidee
	// 
	// @return void
	// 
	verticalDisplace: function() {
		// Collider is approaching from the bottom, displace down
		if (this.dy < 0) {
			this.collider.y = this.collidee.getBottom();
		}
		// Collider is approaching from the top, displace up
		else {
			this.collider.y = this.collidee.getTop() - this.collider.height;
		}
	},

	// 
	// Reduce / reflect velocity in the given direction ("dx" or "dy")
	// 
	// @param {dir} the direction to reflect
	// @return void
	// 
	reflect: function(dir) {
		// Reduce/reflect the velocity
		this.collider[dir] = -this.collider[dir] * this.collidee.restitution;

		// As the velocity approaches 0, set it to 0
		if (Math.abs(this.collider[dir]) < this.stickyThreshold) {
			this.collider[dir] = 0;
		}
	}

});



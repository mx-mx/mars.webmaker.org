/**
 * @author alteredq / http://alteredqualia.com/
 */

var Rover = function ( dae ) {
	
	var scope = this;
	this.mesh = dae;

	// car "feel" parameters

	this.MAX_SPEED = 500;
	this.MAX_REVERSE_SPEED = -250;

	this.MAX_WHEEL_ROTATION = 0.6;

	this.FRONT_ACCELERATION = 150;
	this.BACK_ACCELERATION = 100;

	this.FRONT_DECCELERATION = 0;

	// internal control variables

	this.speed = 0;
	this.acceleration = 0;

	this.wheelOrientation = 0;
	this.carOrientation = 0;

	// internal helper variables

	this.loaded = false;

	this.meshes = [];

	this.dt = createRover();

	this.updateCarModel = function ( delta, controls ) {

		// speed and wheels based on controls

		if ( controls.moveForward ) {

			this.speed = THREE.Math.clamp( this.speed + delta * this.FRONT_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED );
			this.acceleration = THREE.Math.clamp( this.acceleration + delta, -1, 1 );


		}

		if ( controls.moveBackward ) {


			this.speed = THREE.Math.clamp( this.speed - delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED );
			this.acceleration = THREE.Math.clamp( this.acceleration - delta, -1, 1 );

		}

		// speed decay

		if ( ! ( controls.moveForward || controls.moveBackward ) ) {

			if ( this.speed > 0 ) {

				var k = exponentialEaseOut( this.speed / this.MAX_SPEED );

				this.speed = THREE.Math.clamp( this.speed - k * delta * this.FRONT_DECCELERATION, 0, this.MAX_SPEED );
				this.acceleration = THREE.Math.clamp( this.acceleration - k * delta, 0, 1 );

			} else {

				var k = exponentialEaseOut( this.speed / this.MAX_REVERSE_SPEED );

				this.speed = THREE.Math.clamp( this.speed + k * delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, 0 );
				this.acceleration = THREE.Math.clamp( this.acceleration + k * delta, -1, 0 );

			}


		}

		// car update

		var forwardDelta = this.speed * delta * 10000;

		// displacement

		// this.mesh.position.x += forwardDelta;
		this.mesh.position.z += forwardDelta;

		//console.log(Math.sin( this.carOrientation ) * forwardDelta);

	};

	function createRover(){

		var dt = scope.mesh.children[2];

		dt.useQuaternion = false;

		dt.L = dt.children[0];
		dt.R = dt.children[1];

		dt.L.steering = [];
		dt.L.steering.push( dt.L.children[0].children[0] );
		dt.L.steering.push( dt.L.children[1].children[0].children[1] );

		dt.R.steering = [];
		dt.R.steering.push( dt.R.children[0].children[0] );
		dt.R.steering.push( dt.R.children[1].children[0].children[1] );

		dt.L.wheels = [];
		dt.L.wheels.push( dt.L.children[0].children[0].children[0] );
		dt.L.wheels.push( dt.L.children[1].children[0].children[0] );
		dt.L.wheels.push( dt.L.children[1].children[0].children[1].children[0] );

		dt.R.wheels = [];
		dt.R.wheels.push( dt.R.children[0].children[0].children[0] );
		dt.R.wheels.push( dt.R.children[1].children[0].children[0] );
		dt.R.wheels.push( dt.R.children[1].children[0].children[1].children[0] );

		dt.L.steering[0].useQuaternion = false;
		dt.L.steering[1].useQuaternion = false;

		dt.R.steering[0].useQuaternion = false;
		dt.R.steering[1].useQuaternion = false;

		for ( i in dt.L.wheels ){
			dt.L.wheels[i].useQuaternion = false;
			dt.R.wheels[i].useQuaternion = false;
		}

		return dt;
	}

	function quadraticEaseOut( k ) { return - k * ( k - 2 ); }
	function cubicEaseOut( k ) { return --k * k * k + 1; }
	function circularEaseOut( k ) { return Math.sqrt( 1 - --k * k ); }
	function sinusoidalEaseOut( k ) { return Math.sin( k * Math.PI / 2 ); }
	function exponentialEaseOut( k ) { return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1; }

};

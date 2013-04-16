var Rover = function ( dae ) {
	
	var scope = this;
	this.mesh = dae;
	// this.mesh.useQuaternion = true;

	// car "feel" parameters

	this.MAX_SPEED = 5;
	this.MAX_ROTATION_SPEED = 1;

	this.FRONT_ACCELERATION = 4000;
	this.BACK_ACCELERATION = 4000;
	this.LEFT_ACCELERATION = 1000;
	this.RIGHT_ACCELERATION = 1000;

	this.FRONT_DECCELERATION = 5000;
	this.BACK_DECCELERATION = 5000;
	this.LEFT_DECCELERATION = 1000;
	this.RIGHT_DECCELERATION = 1000;

	// internal control variables

	this.speed = 0;
	this.rotationSpeed = 0;

	// internal helper variables

	this.loaded = false;

	this.meshes = [];

	this.dt = rigDrivetrain();
	this.arm = rigArm();
	this.mast = rigMast();

	this.updateCarModel = function ( clock, controls ) {

		var delta = clock.getDelta();
		delta = 0.00002;

		if ( controls.moveForward ) {

			this.speed = THREE.Math.clamp( this.speed + delta * this.FRONT_ACCELERATION, -this.MAX_SPEED, this.MAX_SPEED );

		}

		if ( controls.moveBackward ) {

			this.speed = THREE.Math.clamp( this.speed - delta * this.BACK_ACCELERATION, -this.MAX_SPEED, this.MAX_SPEED );

		}

		if ( ! ( controls.moveForward || controls.moveBackward ) ) {

			if ( this.speed > 0 ) {

				var k = cubicEaseOut( this.speed / this.MAX_SPEED );
				this.speed = THREE.Math.clamp( this.speed - k * delta * this.FRONT_DECCELERATION, 0, this.MAX_SPEED );

			} else {

				var k = cubicEaseOut( this.speed / -this.MAX_SPEED );
				this.speed = THREE.Math.clamp( this.speed + k * delta * this.BACK_DECCELERATION, -this.MAX_SPEED, 0 );

			}

		}

		if ( Math.abs( this.speed ) < 1.5 ){

			if ( controls.moveLeft ){
				this.rotationSpeed = THREE.Math.clamp( this.rotationSpeed + delta * this.LEFT_ACCELERATION, -this.MAX_ROTATION_SPEED, this.MAX_ROTATION_SPEED );

			}

			if ( controls.moveRight ){
				this.rotationSpeed = THREE.Math.clamp( this.rotationSpeed - delta * this.RIGHT_ACCELERATION, -this.MAX_ROTATION_SPEED, this.MAX_ROTATION_SPEED );
			}
		}

		if ( ! ( controls.moveLeft || controls.moveRight ) ) {

			if ( this.rotationSpeed > 0 ) {

				var k = exponentialEaseOut( this.rotationSpeed / this.MAX_ROTATION_SPEED );
				this.rotationSpeed = THREE.Math.clamp( this.rotationSpeed - k * delta * this.LEFT_DECCELERATION, 0, this.MAX_ROTATION_SPEED );

			} 
			if ( this.rotationSpeed < 0 ) {
				var k = exponentialEaseOut( this.rotationSpeed / -this.MAX_ROTATION_SPEED );
				this.rotationSpeed = THREE.Math.clamp( this.rotationSpeed + k * delta * this.RIGHT_DECCELERATION, -this.MAX_ROTATION_SPEED, 0 );
			}
		}

		var absRotationSpeed = Math.abs( this.rotationSpeed );
		var steerStart = 0;
		var steerEnd = .75;

		this.dt.L.steering[0].rotation.y = -THREE.Math.clamp( absRotationSpeed, steerStart, steerEnd );
		this.dt.L.steering[1].rotation.y = THREE.Math.clamp( absRotationSpeed, steerStart, steerEnd );
		this.dt.R.steering[0].rotation.y = THREE.Math.clamp( absRotationSpeed, steerStart, steerEnd );
		this.dt.R.steering[1].rotation.y = -THREE.Math.clamp( absRotationSpeed, steerStart, steerEnd );

		var forwardDelta = this.speed * delta;
		var rotationDelta = this.rotationSpeed * delta;

		for ( i in this.dt.L.wheels ){
			this.dt.L.wheels[i].rotation.x += ( this.speed - this.rotationSpeed * 1.5 ) / 35;
			this.dt.R.wheels[i].rotation.x += ( this.speed + this.rotationSpeed * 1.5 ) / 35;
		}

		this.mesh.position.x += Math.sin( this.mesh.rotation.y ) * forwardDelta * 1000;
		this.mesh.position.z += Math.cos( this.mesh.rotation.y ) * forwardDelta * 1000;

		this.mesh.rotation.y += rotationDelta * 1000;

		// ARM Animation
		//this.arm.shoulder.rotation.x = Math.sin( clock.getElapsedTime());
		//this.arm.hand.rotation.y += clock.getElapsedTime();

	};

	function rigDrivetrain(){

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

	function rigArm(){

		var arm	= scope.mesh.children[1].children[0];
		arm.useQuaternion = false;

		arm.shoulder = arm.children[0];
		arm.shoulder.useQuaternion = false;

		arm.elbow = arm.shoulder.children[0];
		arm.elbow.useQuaternion = false;

		arm.wrist = arm.elbow.children[0];
		arm.wrist.useQuaternion = false;

		arm.hand = arm.wrist.children[0];
		arm.hand.useQuaternion = false;

		return arm;

	}

	function rigMast(){

		var toRadians = Math.PI/180;

		var mast = scope.mesh.children[1].children[1];
		mast.useQuaternion = false;
		//mast.rotation.x = -90 * toRadians;
		mast.rotation.y = 33 * toRadians;

		mast.neck = mast.children[0].children[0];
		mast.neck.useQuaternion = false;
		
		mast.head = mast.neck.children[0];
		mast.head.useQuaternion = false;

		return mast;

	}

	function quadraticEaseOut( k ) { return - k * ( k - 2 ); }
	function cubicEaseOut( k ) { return --k * k * k + 1; }
	function circularEaseOut( k ) { return Math.sqrt( 1 - --k * k ); }
	function sinusoidalEaseOut( k ) { return Math.sin( k * Math.PI / 2 ); }
	function exponentialEaseOut( k ) { return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1; }

};

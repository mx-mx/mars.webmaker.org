var WIDTH = $(window).width(),
    HEIGHT = $(window).height();

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = .25,
	FAR = 100000;

var stats, 
	scene,
	camera,
	renderer,
	controls,
	tween;

var dae,
	rover,
	dt = new Object(); //drivetrain and suspension

var roverLoader = new THREE.ColladaLoader();
var terrainLoader = new THREE.ColladaLoader();

var time = 0;
var toRadians = Math.PI/180;

var clock = new THREE.Clock();
var delta = clock.getDelta();

//for a good OO model, these vars should be refactored into rover.js
var currentEnergyLevel = 100;
var driveDrainRate=0;
var instrumentDrainRate=0;

/********************************
	PAGE LOADING
********************************/

function setLoadMessage( msg ){
	$( '#loadtext' ).html(msg + "...");
}

function init() {

	/********************************
		CREATE SCENE
	********************************/

	$container = $("#contenttarget");

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x6B7DA0, 0, 300 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.set( 0, 1, -7 );

	var ambientLight = new THREE.AmbientLight();
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	// var pointLight = new THREE.PointLight(0xFFFFFF, 1.3);
	// pointLight.position.set( 0, 100, 0 );
	// scene.add(pointLight);

	var directionalLight = new THREE.DirectionalLight( 0x6B7DA0, 1.25 );
	directionalLight.position.set( -175, 20, 0 );
	directionalLight.castShadow = true;
	scene.add( directionalLight );

	// light = new THREE.SpotLight( 0xFFFFFF, 1, 500 );
	// light.position.set( 1, 10, 0 );
	// light.castShadow = true;
	// light.shadowDarkness = 0.5;
	// scene.add( light );


	/********************************
		RENDERER
	********************************/


	setupScene();
	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );
	// renderer.setClearColor( scene.fog.color, 1 );

	$container.append( renderer.domElement );
	// renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, $container[0] );
	controls.addEventListener( 'change', render );
	controls.maxPolarAngle = Math.PI / 2 + ( 3 * toRadians ); 
	controls.minDistance = 2.5;
	controls.maxDistance = 25;


	/********************************
		STATS
	********************************/
	/*
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );
	*/
	/********************************
		EVENTS
	********************************/

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

}
//TODO: clean this up.  make an array.
var ocCalibration;
var oc;
var ocTwo;
var camTarget;

function setupScene(){

	camTarget = new THREE.Mesh( new THREE.PlaneGeometry( 0, 0 ), new THREE.MeshBasicMaterial() );
	camTarget.position.set( 0, 2, 0 );
	camTarget.add( camera );

	rover = new Rover( rover_dae );
	rover.mesh.add( camTarget );

	scene.add( rover.mesh );

	controlsRover = {

		moveForward: false,
		moveBackward: false,
		moveLeft: false,
		moveRight: false

	};

	// rover.arm.rotation.y = -90 * toRadians;
	// rover.arm.shoulder.rotation.x = -10 * toRadians;
	// rover.arm.elbow.rotation.x = -75 * toRadians;

	// rover.mast.rotation.z = -85 * toRadians;
	// rover.mast.head.rotation.y = -55 * toRadians;

	ocCalibration = new Outcrop('./images/moku_u2_calibration_plate.png', 2, false);
	//ocCalibration.setPosition(0, 10); //always call set position first before showing target and arrow
	//ocCalibration.showTarget();
	//ocCalibration.showArrow();
	
	oc = new Outcrop('./images/outcrop_good.jpg', 5, true);
	//oc.setPosition(-20, 35); //always call set position first before showing target and arrow
	//oc.showTarget();
	//oc.showArrow();


	ocTwo = new Outcrop('./images/outcrop_poor.jpg', 5, true);
	//ocTwo.setPosition(5,35);
	//ocTwo.showTarget();
	//ocTwo.showArrow();

	// var grid = CreateGrid( 0, .5, 50 );
	// scene.add( grid );

	scene.add( terrain );
	buildGUI();
	
	//setup a function to drain
	setInterval(function() { 
		//high drain our battery if user is doing both
		var highDrain=0;
		if(driveDrainRate>0 && instrumentDrainRate>0)highDrain=2;
		if(currentEnergyLevel>=0) {
			currentEnergyLevel = currentEnergyLevel-driveDrainRate-instrumentDrainRate-highDrain;
		}
	}, 200);


}
var gui;
function buildGUI(){

	var camTweens = { 
		one: new camPosition( { x:5, y:5, z:5 }, { x:0, y:0, z:0 }, 1 ),
		two: new camPosition( { x:0, y:4, z:-10 }, { x:0, y:0, z:0 }, 1 ),
		three: new camPosition( { x:-.36, y:2.1, z:.65 }, { x:0, y:0, z:10 }, 1 ),
		four: new camPosition( { x:-5, y:3, z:-2 }, { x:0, y:0, z:0 }, 1 )
	};

	gui = new dat.GUI();

	// gui.add( rover.dt.L.steering[0].rotation, 'y', ( -45 * toRadians ), 0 )
	// 	.name('Front Steering')
	// 	.onChange( function(){
	// 		rover.dt.L.steering[1].rotation.y = -rover.dt.L.steering[0].rotation.y;
	// 		rover.dt.R.steering[0].rotation.y = -rover.dt.L.steering[0].rotation.y;
	// 		rover.dt.R.steering[1].rotation.y = -rover.dt.R.steering[0].rotation.y
	// });

	var armFolder = gui.addFolder( 'Arm Controls' );
	armFolder.open();

	armFolder.add( rover.arm.rotation, 'y', ( -90 * toRadians ), 0 )
		.name('Arm');
	armFolder.add( rover.arm.shoulder.rotation, 'x', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Arm.Shoulder');
	armFolder.add( rover.arm.elbow.rotation, 'x', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Arm.Elbow');
	armFolder.add( rover.arm.wrist.rotation, 'x', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Arm.Wrist');
	armFolder.add( rover.arm.hand.rotation, 'y', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Arm.Hand');

	var mastFolder = gui.addFolder( 'Mast Controls' );
	mastFolder.open();

	mastFolder.add( rover.mast.rotation, 'z', ( -90 * toRadians ), 0 )
		.name('Mast');
	mastFolder.add( rover.mast.neck.rotation, 'y', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Mast.Neck');
	mastFolder.add( rover.mast.head.rotation, 'x', ( -90 * toRadians ), ( 90 * toRadians ) )
		.name('Mast.Head');

	var camFolder = gui.addFolder( 'Camera Positions' );
	camFolder.open();
	camFolder.add( camTweens.one, 'tween' ).name( 'Camera One' );
	camFolder.add( camTweens.two, 'tween' ).name( 'Camera Two' );
	camFolder.add( camTweens.three, 'tween' ).name( 'Camera Three' );
	camFolder.add( camTweens.four, 'tween' ).name( 'Camera Four' );
}

var powerPenalty = false;

function setPowerPenalty() {
	powerPenalty = true;
	setTimeout(function() {powerPenalty=false;}, 4000);
}

function onKeyDown ( event ) {

	if(powerPenalty)return;
	// if(currentEnergyLevel < 2 ) {
	// 	controlsRover.moveForward = false;
	// 	controlsRover.moveBackward = false;
	// 	controlsRover.moveLeft = false;
	// 	controlsRover.moveRight = false;
	// 	setPowerPenalty();
	// 	return;
	// }

	switch( event.keyCode ) {

		case 37: 
			/*left*/ controlsRover.moveLeft = true; 
			driveDrainRate=3;
			break;
		case 38:
			/*up*/ controlsRover.moveForward = true; 
			driveDrainRate=3;
			break;
		case 39: 
			/*right*/ controlsRover.moveRight = true; 
			driveDrainRate=3;
			break;
		case 40: 
			/*down*/ controlsRover.moveBackward = true; 
			driveDrainRate=3;
			break;
	}
};

function onKeyUp ( event ) {

	switch( event.keyCode ) {
		case 38: /*up*/ controlsRover.moveForward = false; driveDrainRate=0; break;
		case 40: /*down*/ controlsRover.moveBackward = false; driveDrainRate=0; break;
		case 37: /*left*/ controlsRover.moveLeft = false; driveDrainRate=0; break;
		case 39: /*right*/ controlsRover.moveRight = false; driveDrainRate=0; break;
	}
	for( var i = 0; i < OUTCROPS.length; i++ ){
		if( OUTCROPS[i].touchdown( rover.mesh, .75 ) ) console.log( OUTCROPS[i].name + " got a touchdown" );
		if( OUTCROPS[i].touchdown( rover.arm.hand, .5 ) ) console.log( "The Rover eye saw " + OUTCROPS[i].name );
	}
};

function onWindowResize() {

	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	camera.aspect = $(window).width() / $(window).height();
	camera.updateProjectionMatrix();

	renderer.setSize( $(window).width(), $(window).height() );

}

var boundaryStatus = 0; //return a simple number for status
// Check to see if Rover is out of Bounds. If out of bounds it resets the rover to the center of the screen.
function outOfBounds(){
	boundaryStatus = 0; //return a simple number for status
	var boundary = 60; 
	var almostBoundary = boundary - boundary * .3; //30% of the boundary
	var posFromMatrix = new THREE.Vector3();
	posFromMatrix.getPositionFromMatrix( rover.mesh.matrixWorld );
	var roverPosFromCenter = posFromMatrix.distanceTo( scene.position );

	// Check to see if the rover is almost reaching the boundary and send out a console message,
	// If the rover reaches the boundary it resets the position of the rover back to center.
	if (roverPosFromCenter > almostBoundary && roverPosFromCenter < boundary){
		console.log("Almost out of bounds! Turn Around!");
		boundaryStatus=1;
	} else if(roverPosFromCenter > boundary){
		boundaryStatus=2;
		console.log("Out of bounds, reseting position back to center");

		var resetPos = new TWEEN.Tween( rover.mesh.position )
			.to( scene.position , 1000 )
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onStart( function() {
				controlsRover.moveForward = false;
				controlsRover.moveBackward = false;
				controlsRover.moveLeft = false;
				controlsRover.moveRight = false;
			} );

		var widenCam = new TWEEN.Tween( camera.position )
			.to( { x:0, y:8, z:-20 }, 500 )
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onStart( function(){
				resetPos.start();
			});

		widenCam.start();
	}
	
}

function animate() {

	requestAnimationFrame( animate );

	controls.update();
	//stats.update();

	for( var i = 0; i < OUTCROPS.length; i++ ){
		OUTCROPS[i].updateArrow();
	}

	if(currentEnergyLevel < 2 ) {
		controlsRover.moveForward = false;
		controlsRover.moveBackward = false;
		controlsRover.moveLeft = false;
		controlsRover.moveRight = false;
		setPowerPenalty();
	}

	outOfBounds();
	rover.updateCarModel( clock, controlsRover );

	time += .01;
	
	render();
	TWEEN.update(window.performance.now() + clock.getDelta());

}

function render() {
	// renderer.clear();
	renderer.render( scene, camera );

}
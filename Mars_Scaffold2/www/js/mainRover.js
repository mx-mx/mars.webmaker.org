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

	var directionalLight = new THREE.DirectionalLight( 0x6B7DA0, 1 );
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
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, $container[0] );
	controls.addEventListener( 'change', render );
	controls.maxPolarAngle = Math.PI / 2 + ( 3 * toRadians ); 
	controls.minDistance = 2.5;
	controls.maxDistance = 25;


	/********************************
		STATS
	********************************/

	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '0px';
	//$container.append( stats.domElement );

	/********************************
		EVENTS
	********************************/

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function setupScene(){

	var camTarget = new THREE.Mesh( new THREE.PlaneGeometry( 0, 0 ), new THREE.MeshBasicMaterial() );
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

	// var grid = CreateGrid( 0, .5, 50 );
	// scene.add( grid );

	scene.add( terrain );
	buildGUI();

}
var gui;
function buildGUI(){

	var camTweens = { 
		one: new CAMTWEEN( { x:5, y:5, z:5 }, { x:0, y:0, z:0 }, 1 ),
		two: new CAMTWEEN( { x:0, y:4, z:-10 }, { x:0, y:0, z:0 }, 1 ),
		three: new CAMTWEEN( { x:-.36, y:2.1, z:.65 }, { x:0, y:0, z:10 }, 1 ),
		four: new CAMTWEEN( { x:-5, y:3, z:-2 }, { x:0, y:0, z:0 }, 1 )
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

function onKeyDown ( event ) {

	switch( event.keyCode ) {

		case 38: /*up*/ controlsRover.moveForward = true; break;
		case 40: /*up*/ controlsRover.moveBackward = true; break;
		case 37: /*left*/ controlsRover.moveLeft = true; break;
		case 39: /*right*/ controlsRover.moveRight = true; break;
	}
};

function onKeyUp ( event ) {

	switch( event.keyCode ) {
		case 38: /*up*/ controlsRover.moveForward = false; break;
		case 40: /*up*/ controlsRover.moveBackward = false; break;
		case 37: /*left*/ controlsRover.moveLeft = false; break;
		case 39: /*right*/ controlsRover.moveRight = false; break;
	}
};

function onWindowResize() {

	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	camera.aspect = $(window).width() / $(window).height();
	camera.updateProjectionMatrix();

	renderer.setSize( $(window).width(), $(window).height() );

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();

	controls.update();
	//stats.update();
	TWEEN.update();

	rover.updateCarModel( clock, controlsRover );

	time += .01;
	render();

}

function render() {

	renderer.clear();
	renderer.render( scene, camera );

}
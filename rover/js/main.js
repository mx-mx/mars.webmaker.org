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

var loader = new THREE.ColladaLoader();

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

$(document).ready( function() {

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	$( '#loadtext' ).show();
	setLoadMessage("Loading Curiosity");

	loader.options.convertUpAxis = true;
	loader.load( './models/rover_c4d_001.dae', function ( collada ) {

		dae = collada.scene;
		daeAnimation = collada.animations;

		dae.scale.set( 1, 1, 1 );

		dae.updateMatrix();
		postColladaLoaded();

	} );

	var postColladaLoaded = function () {
	        init();
	        animate();
			$("#loadtext").hide();
    };
});

function init() {

	/********************************
		CREATE SCENE
	********************************/

	$container = $("#container");

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.000055 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.set( 5, 5, 5 );

	camTarget = scene.position;
	
	var ambientLight = new THREE.AmbientLight();
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF, 1.3);
	pointLight.position.set( 0, 100, 0 );
	scene.add(pointLight);


	/********************************
		RENDERER
	********************************/

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$container.append( renderer.domElement );
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, $container[0] );
	controls.addEventListener( 'change', render );

	setupScene();

	/********************************
		STATS
	********************************/

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );

	/********************************
		EVENTS
	********************************/

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function setupScene(){

	// Grid
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
	var geometry = new THREE.Geometry();
	var floor = 0, step = .5, size = 50;

	for ( var i = 0; i <= size / step * 2; i ++ ) {

		geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );

	}

	var grid = new THREE.Line( geometry, material, THREE.LinePieces );
	scene.add( grid );

	rover = new Rover( dae );
	rover.mesh.add(camera);
	scene.add( rover.mesh );

	controlsRover = {

		moveForward: false,
		moveBackward: false,
		moveLeft: false,
		moveRight: false

	};

	buildGUI();

}

function buildGUI(){

	var camTweens = { 
		one: new CAMTWEEN( { x:5, y:5, z:5 }, { x:0, y:0, z:0 }, 1 ),
		two: new CAMTWEEN( { x:0, y:4, z:-10 }, { x:0, y:0, z:0 }, 1 ),
		three: new CAMTWEEN( { x:-.36, y:2.1, z:.65 }, { x:0, y:0, z:10 }, 1 ),
		four: new CAMTWEEN( { x:-5, y:3, z:-2 }, { x:0, y:0, z:0 }, 1 )
	};

	var gui = new dat.GUI();

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
	camera.lookAt( camTarget );

	controls.update();
	stats.update();
	TWEEN.update();

	rover.updateCarModel( clock, controlsRover );

	// dt.L.steering[0].rotation.setY( Math.sin( -time * 2 * Math.PI ) * .5 );
	// dt.L.steering[1].rotation.setY( Math.sin( time * 2 * Math.PI ) * .5 );
	// dt.R.steering[0].rotation.setY( Math.sin( time * 2 * Math.PI ) * .5 );
	// dt.R.steering[1].rotation.setY( Math.sin( -time * 2 * Math.PI ) * .5 );

	time += .01;

	camera.lookAt( camTarget );
	render();

}

function render() {

	renderer.clear();
	renderer.render( scene, camera );

}
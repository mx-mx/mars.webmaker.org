var WIDTH = $(window).width(),
    HEIGHT = $(window).height();

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 1,
	FAR = 100000;

var stats, 
	scene,
	camera,
	renderer,
	controls,
	tween;

var dae;
var loader = new THREE.ColladaLoader();


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
	loader.load( './models/rover.dae', function ( collada ) {

		dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 60000;
		dae.updateMatrix();
		postColladaLoaded();

	} );

	var postColladaLoaded = function () {
	        init();
	        animate();
			$("#loadtext").hide();
    };
} );

function init() {

	/********************************
		SCENE SETUP
	********************************/
	$container = $("#container");

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.000055 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.y = 200;
	camera.position.z = 500;

	camTarget = new THREE.Vector3();
	camTarget = scene.position;

	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * HEIGHT;
	
	var ambientLight = new THREE.AmbientLight( 0x404040 );
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF, 1.3);

	pointLight.position.x = 0;
	pointLight.position.y = 1000;
	pointLight.position.z = 0;

	scene.add(pointLight);

	/********************************
		RENDERER
	********************************/

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$container.append( renderer.domElement );
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	setupScene();

	/********************************
		STATS
	********************************/

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function setupScene(){

	scene.add( dae );
}

function onDocumentMouseMove( event ) {

	event.preventDefault();

}

function onWindowResize() {

	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

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

	camera.lookAt( camTarget );
	render();
}

function render() {

	renderer.clear();
	renderer.render( scene, camera );

}
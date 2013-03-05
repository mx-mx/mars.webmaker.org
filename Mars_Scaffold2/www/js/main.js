var WIDTH = $(window).width(),
    HEIGHT = $(window).height();

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 1,
	FAR = 100000;

var stats, scene, camera, camTarget, camNextPosition, camNextRotation, camNextTarget, 
	renderer, composer, controls, tween;

var vertexShader, fragmentShader, uniforms;

var planetName = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ];
var planetSize = [ 2439.7, 6051.8, 6371.00, 3389.5, 69911, 58232, 25362, 24622 ];
var semiMajor = [ 57909227, 108209475, 149598262, 227943824, 778340821, 1426666422, 2870658186, 4498396441 ];
var eccentricity = [ 0.20563593, 0.00677672, 0.01671123, 0.0933941,	0.04838624,	0.05386179,	0.04725744,	0.00859048 ];
var aphelion = [ 69817445, 108942780, 152098233, 249232432, 816001807, 1503509229, 3006318143, 4537039826 ];
var orbitTime = [ 88.0, 224.7, 365.2, 687, 4332, 10760, 30700, 60200 ];

var axisRez = 50;
var sunScale = .00001, planetScale = .001, ssScale = .000001;				
var planetSegW = 15, planetSegH = 15;

var solarSystem, 
	planet = [], 
	sun;	

var trajectory;

var timer = 1, timerMultiplier = 0;
var clock = new THREE.Clock();

//CSS3D vars:
var screenWhalf, screenHhalf;
var CSSWorld, CSSCamera;
var divCube;
var fovValue;

/********************************
	PAGE LOADING
********************************/

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	window.requestAnimationsFrame = ( function() {
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

function setLoadMessage( msg ){
	$( '#loadtext' ).html(msg + "...");
}

$(document).ready( function() {

	$( '#loadtext' ).show();
	setLoadMessage("Loading the Solar System");

	$.ajax({
		url: "./shaders/lavaShader.xml",
		dataType: 'xml',
		success: function ( xml ) {
			//xmlDoc = $.parseXML( $xml );

			vertexShader = $(xml).find( "vertex" ).text();
			fragmentShader = $(xml).find( "fragment" ).text();
			setLoadMessage("shaders loaded");
		},
		error: function( text ) {
			alert( "vertex not loaded" );
		},
		complete: function(){

		}
	});
});

$(window).load(function() {

	//CSSWorld = document.getElementById('css-world');
	//CSSCamera = document.getElementById('css-camera');

	//init();
	//initCSS3D( CSSWorld, CSSCamera );
	//animate();
	//$("#loadtext").hide();
});


function init() {

	/********************************
		SCENE SETUP
	********************************/
	$container = $("#contenttarget");

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.000025 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.y = 200;
	camera.position.z = 1000;

	camTarget = new THREE.Vector3();
	camTarget = scene.position;
	
	var ambientLight = new THREE.AmbientLight();
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	scene.add(pointLight);

	solarSystem = new THREE.Object3D();
	
	/********************************
		CONTROLS
	********************************/

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	/********************************
		SUN & PLANETS
	********************************/

	trajectory = new Trajectory ( 2 );

	uniforms = {

		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },

		fogDensity: { type: "f", value: 0 },
		fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },

		texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "./textures/lava/cloud.png" ) },
		texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "./textures/lava/lavatile.jpg" ) },

		uvScale: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) }

	};

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader

	} );

	sun = new Planet( planetSegW, planetSegH, material, material );
	sun.mesh.scale = { x: 1392684 * sunScale, y: 1392684 * sunScale, z: 1392684 * sunScale };
	sun.drawPlanet( solarSystem );

	// var compass = createCompassOrWhatever();
	// var compass_gyro = new THREE.Gyroscope();
	// compass_gyro.add( compass );
	// character.add( compass_gyro );

	attachMarker( "Sun", sun.mesh, 1, CSSCamera );

	var planetTexture = [
		'./models/solarsystem/mercurymap.jpg',
		'./models/solarsystem/venusmap.jpg',
		'./models/solarsystem/earthmap.jpg',
		'./models/solarsystem/marsmap.jpg',
		'./models/solarsystem/jupitermap.jpg',
		'./models/solarsystem/saturnmap.jpg',
		'./models/solarsystem/uranusmap.jpg',
		'./models/solarsystem/neptunemap.jpg',
	];

	for ( var i = 0; i < 8; i ++ ) {

		var planetMaterial = new THREE.MeshLambertMaterial( { 
				map: THREE.ImageUtils.loadTexture( planetTexture[i]), 
				overdraw: true 
		});

		var axisMaterial = new THREE.LineBasicMaterial( { 
			color: 0xF22E2E, 
			opacity: 0.25, 
			linewidth: 1 
		});
		var scale = planetSize[i] * planetScale;

		planet.push( new Planet( planetSegW, planetSegH, planetMaterial, axisMaterial ) );
		planet[i].mesh.scale = { x: scale, y: scale, z: scale };
		planet[i].setOrbit( semiMajor[i], aphelion[i], eccentricity[i], ssScale );
		planet[i].drawPlanet( solarSystem );
		planet[i].drawOrbit( axisRez, solarSystem );
		attachMarker( planetName[i], planet[i].mesh, 1, CSSCamera );

	}

	/********************************
		STARS
	********************************/

	starField = new Stars( 100000, 100 );
	solarSystem.add( starField );

	/********************************
		LENS FLARE
	********************************/

	// var flare = addLensFlare( 0, 0, 0, 5, sunTexture );
	// scene.add( flare );

	/********************************
		RENDERER
	********************************/

	scene.add( solarSystem );

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$container.append( renderer.domElement );
	renderer.autoClear = false;


	/********************************
		POST-PROCESSING
	********************************/

	var renderModel = new THREE.RenderPass( scene, camera );
	var effectBloom = new THREE.BloomPass( 1.25 );
	var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

	effectFilm.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderModel );
	composer.addPass( effectBloom );
	composer.addPass( effectFilm );

	/********************************
		STATS
	********************************/

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}



function addLensFlare( x, y, z, size, overrideImage ){

	var flareColor = new THREE.Color( 0xffffff );

	var lensFlare = new THREE.LensFlare( overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare0.png" );
	var textureFlare2 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare2.png" );
	var textureFlare3 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare3.png" );

	lensFlare.add( textureFlare0, 200, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;

	lensFlare.position = new THREE.Vector3(x,y,z);
	lensFlare.size = size ? size : 16000 ;
	return lensFlare;

}

function lensFlareUpdateCallback( object ) {

	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;


	for( f = 0; f < fl; f++ ) {

	   flare = object.lensFlares[ f ];

	   flare.x = object.positionScreen.x + vecX * flare.distance;
	   flare.y = object.positionScreen.y + vecY * flare.distance;

	   flare.rotation = 0;

	}

	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}

function camTweener( newCamPosition, newTarget, time ) {

	var update	= function() {

		camera.position.x = camCurrentPosition.x;
		camera.position.y = camCurrentPosition.y;
		camera.position.z = camCurrentPosition.z;

		camera.rotation.x = camCurrentRotation.x;
		camera.rotation.y = camCurrentRotation.y;
		camera.rotation.z = camCurrentRotation.z;

		camTarget = camCurrentTarget;

	}

	var camCurrentPosition	= {
		x: camera.position.x, 
		y: camera.position.y, 
		z: camera.position.z 
	};

	var camCurrentRotation	= {
		x: camera.rotation.x, 
		y: camera.rotation.y, 
		z: camera.rotation.z 
	};

	var camCurrentTarget = camTarget;

	tweenPosition = new TWEEN.Tween( camCurrentPosition )
		.to( newCamPosition , time )
		.delay(0)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onStart( function(){ 
			controls.enabled = false; 
			controls.noRotate = true;						
			controls.noPan = true;
			controls.noZoom = true;
			controls.update();
		} )
		.onComplete( function(){ 
			controls.enabled = true; 
			controls.noRotate = false;						
			controls.noPan = false;
			controls.noZoom = false;
			controls.update();

		} )
		.onUpdate( update )

	tweenPOI = new TWEEN.Tween( camCurrentTarget )
		.to( newTarget, time)
		.delay(0)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onUpdate( update );

	tweenPosition.start();
	tweenPOI.start();
}

function onWindowResize() {


	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

	camera.aspect = $(window).width() / $(window).height();
	camera.updateProjectionMatrix();

	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * window.innerHeight;
	setCSSCamera(camera, fovValue);
	updateMarkers();

	renderer.setSize( $(window).width(), $(window).height() );

	//updateMarker();

	composer.reset();

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();
	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * HEIGHT;

	setCSSWorld();
	setCSSCamera(camera, fovValue);

	updateMarkers();
	controls.update();
	stats.update();
	TWEEN.update();

	camera.lookAt( camTarget );

	scene.updateMatrixWorld();
	scene.traverse( function ( object ) {
			if ( object instanceof THREE.LOD ) {
			object.update( camera );
		}
	} );

	var delta = 5 * clock.getDelta();
	uniforms.time.value += 0.2 * delta;

	render();

	for ( var i = 0; i < planet.length; i ++ ) {
		planet[i].orbit( -timer, orbitTime[i] );
	}
	timer++;
	timer = timer + timerMultiplier;
}

function render() {

	// composer.render( 0.01 );

	renderer.clear();
	renderer.render( scene, camera );

}
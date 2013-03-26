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
	projector,
	composer, 
	controls,
	tween,
	gui,
	camTarget,
	solarSystem;

var trajectory;

var time, t;
var clock = new THREE.Clock();

var mouse = { x: -1000, y: 0 }, 
	INTERSECTED;

var dae;
var loader = new THREE.ColladaLoader();


/********************************
	PAGE LOADING
********************************/

function setLoadMessage( msg ){
	$( '#loadtext' ).html(msg + "...");
}



function init() {

	/********************************
		SCENE SETUP
	********************************/
	//$contenttarget = $("#container");

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
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	scene.add(pointLight);

	/********************************
		RENDERER
	********************************/
	projector = new THREE.Projector();

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$contenttarget.append( renderer.domElement );
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, $contenttarget[0] );
	controls.addEventListener( 'change', render );

	setupScene();
	
	camOne = new camPosition( { x: 0, y: 50, z: 500 }, { x: 0, y: 0, z: 0 }, 1500 );
	camTwo = new camPosition( { x: 0, y: 12000, z: 500 }, { x: 0, y: 0, z: 0 }, 5000 );
	camThree = new camPosition( { x: -500, y: 250, z: -1000 }, { x: 0, y: 0, z: 0 }, 3000 );
	camEarth = new camPosition( { x: 50, y: 50, z: 250 }, ss[3].position, 1500 );
	camMars = new camPosition( { x: 75, y: 50, z: 300 }, ss[4].position, 1500 );

	t = new timer();

	buildGUI();

	/********************************
		POST-PROCESSING
	********************************/

	// var renderModel = new THREE.RenderPass( scene, camera );
	// // var effectBloom = new THREE.BloomPass( 1.25 );
	// var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

	// effectFilm.renderToScreen = true;

	// composer = new THREE.EffectComposer( renderer );

	// composer.addPass( renderModel );
	// // composer.addPass( effectBloom );
	// composer.addPass( effectFilm );

	/********************************
		STATS
	********************************/

	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '0px';
	//$contenttarget.append( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}
var gui;
function buildGUI(){

	gui = new dat.GUI();
	gui.add( t, 'multiplier', 0, 5).name( 'Orbit Speed' );

	// var labelFolder = gui.addFolder( 'Label Visibility' );
	// labelFolder.open();
	// for ( var i in labels ){
	// 	labelFolder.add( labels[i], 'visible' ).name( labels[i].name + ' label'  );
	// }

	gui.add(ssScale, 's', .000001, .00001)
		.name('SS Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'sunScale', .00001, .0001)
		.name('Sun Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'planetScale', .001, .01)
		.name('Planet Scale')
		.onChange( function(){
			scaling = true;
		});

	var camFolder = gui.addFolder( 'Camera Positions' );
	camFolder.open();
	camFolder.add( camOne, 'tween' ).name( 'Camera Home' );
	camFolder.add( camTwo, 'tween' ).name( 'Camera Two' );
	camFolder.add( camThree, 'tween' ).name( 'Camera Three' );
	camFolder.add( camEarth, 'tween' ).name( 'Camera Earth' );
	camFolder.add( camMars, 'tween' ).name( 'Camera Mars' );

}

function removeGui(parent) {
  if(!parent) {
    parent = DAT.GUI.autoPlaceContainer;
  }
  
  console.log(gui.domElement);
  parent.removeChild(gui.domElement);
}

function addGui(gui, parent) {
  if(!parent) {
    parent = DAT.GUI.autoPlaceContainer;
  }
  parent.appendChild(gui);
}


function setupScene(){

	trajectory = new Trajectory ( 2 );
	solarSystem = makeSolarSystem();
	starField = new stars( 40000, 100 );
	solarSystem.add( starField );

	lensFlares = new THREE.Object3D();
	var override = THREE.ImageUtils.loadTexture( "./images/lensflare/hexangle.png" );
	var sunFlare = addLensFlare( 0, 0, 10, 5, override );
	lensFlares.add( sunFlare );

	scene.add( dae );
	scene.add( solarSystem );
	scene.add( lensFlares );
}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {


	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

	camera.aspect = $(window).width() / $(window).height();
	camera.updateProjectionMatrix();

	updateLabels();

	renderer.setSize( $(window).width(), $(window).height() );

	//composer.reset();

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();
	camera.lookAt( camTarget );

	updateRulers();
    updateLabels( ss );
	controls.update();
	//stats.update();
	TWEEN.update();
	setSolarSystemScale();
	planetsOrbit( t.count );

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( solarSystem.children );

	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.label.show();
			setLoadMessage('Awesome information about ' + INTERSECTED.name + ' could go here!');
			$( '#loadtext' ).fadeIn('fast');
		}
	} else {
		// showLabels( ss, false );
		if ( INTERSECTED != null){
			// INTERSECTED.label.hide();
			showLabels( ss, false );
		}
		INTERSECTED = null;
		$( '#loadtext' ).fadeOut('fast');

	}	

	scene.updateMatrixWorld();
	scene.traverse( function ( object ) {
			if ( object instanceof THREE.LOD ) {
			object.update( camera );
		}
	});

	var delta = clock.getDelta();
	var time = clock.getElapsedTime();

	uniforms.time.value = time + delta;
	t.count = t.count + 1 * t.multiplier;

	camera.lookAt( camTarget );
	render();
}

function render() {

	renderer.clear();
	// composer.render( 0.01 );
	renderer.render( scene, camera );

}
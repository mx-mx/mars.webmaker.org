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
	camTarget,
	solarSystem,
	trajectory,
	ruler,
	rulerMidpoint,
	distance,
	debugGrid,
	debugAxis;

var timer;
var showDistance = false,
	miles = true;

var clock = new THREE.Clock();

//actual Curiosity launch and land dates
var departure_time = new Time( { Yr:2011, Mon:11, D:26, Hr:1, Mn:1, S:1 } ); //November 26, 2011
var arrival_time = new Time( { Yr:2012, Mon:8, D:6, Hr:1, Mn:1, S:1 } ); // August 6, 2012
//var departure_time = new Time( { Yr:2013, Mon:5, D:1, Hr:1, Mn:1, S:1 } );
//var arrival_time = new Time( { Yr:2013, Mon:10, D:1, Hr:1, Mn:1, S:1 } );

var mouse = { x: -1000, y: 0 }, 
	INTERSECTED,
	CLICKED,
	clickMove = true;

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
	//$contenttarget = $("#contenttarget");

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.00005 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	//camera.position.set( 100, 500, 1000 );
	//camera.position.set( 10, 10, -70 );
	camera.position.set( 10, 30, 90 );


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
	controls.minDistance = 100;
	controls.maxDistance = 10000;

	setupScene();
	
	camOne = new camPosition( { x: 0, y: 100, z: 500 }, { x: 0, y: 0, z: 0 }, 1500 );
	camTwo = new camPosition( { x: 0, y: 750, z: 50 }, { x: 0, y: 0, z: 0 }, 2000 );
	camThree = new camPosition( { x: -500, y: 250, z: -1000 }, { x: 0, y: 0, z: 0 }, 3000 );
	camEarth = new camPosition( { x: 50, y: 50, z: 250 }, ss[3].position, 1500 );
	camMars = new camPosition( { x: 75, y: 50, z: 300 }, ss[4].position, 1500 );

	timer = new Timer();
	timer.count = 0;
	timer.multiplier = .025;
	//timer.JD = new Date(2010,11,1).Date2Julian(); //dec 1st 2010 //we need a date better than this to demo 34 million mile dif
	//timer.JD = new Date(2003,4,6).Date2Julian(); //feb 24 2003
	timer.JD = new Date(2009,10,1).Date2Julian(); //feb 24 2003
	
	
	buildGUI();

	/********************************
		STATS
	********************************/

	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '0px';
	//$contenttarget.append( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

}

var gui;
function buildGUI(){

	gui = new dat.GUI();
	gui.add( timer, 'multiplier', -5, 5).name( 'Orbit Speed' );
	gui.add(ssScale, 's', .000001, .00001)
		.name('SS Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'sunScale', .000001, .0001)
		.name('Sun Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'planetScale', .000001, .01)
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
	//camFolder.add( camg1g, 'tween' ).name( 'Camera Mars' );
}


function setupScene(){
	// geo = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial( { color: 0xCC0000, opacity:0 } ) );
	// scene.add(geo);

	// debugGrid = new debugGrid(-1, 100, 1000);
	// scene.add(debugGrid);

	// object = new THREE.AxisHelper( 500 );
	// object.position.set( 0, 0, 0 );
	// scene.add( object );

	trajectory = new Trajectory();
	trajectory.init( departure_time, arrival_time, function () {
	    console.log("finished drawing this trajectory");
	});

	solarSystem = makeSolarSystem();
	solarSystem.rotation.x = -2;

	var SUNmat = new THREE.MeshBasicMaterial( { 
			map: THREE.ImageUtils.loadTexture( './images/solarsystem/sunflatmap.png' ), 
			overdraw: true,
			transparent: true 
	});

	// SUNmat.alphaTest = .75;
	SUN = new THREE.Mesh( new THREE.PlaneGeometry( 3700000, 3700000 ), SUNmat );
	scene.add( SUN );

	starField = new stars( 25000, 40000, 100 );
	solarSystem.add( starField );

	var sunFlare = addLensFlare( 5, 0, 0, 5 );
	SUN.add( sunFlare );


	var ringMat = new THREE.MeshBasicMaterial( { 
			map: THREE.ImageUtils.loadTexture( './images/solarsystem/saturnrings.png' ), 
			overdraw: true,
			transparent: true,
			opacity: 0.5 
	});

	saturnRing = new THREE.Mesh( new THREE.PlaneGeometry( 275000, 275000 ), ringMat );
	saturnRing.material.side = THREE.DoubleSide;
	saturnRing.rotation.x = 5 * Math.PI/180;
	saturnRing.rotation.z = 10 * Math.PI/180;
	solarSystem.add(saturnRing);


	ruler = new Ruler( ss[3], ss[4] );
	scene.add( ruler );

	rulerMidpoint = new THREE.Mesh( new THREE.PlaneGeometry( 0, 0 ), new THREE.MeshLambertMaterial( { color: 0xCC0000, opacity:0 } ) );
	scene.add( rulerMidpoint );

	var template = document.getElementById('label_template');
	distance = template.cloneNode(true);
	distance.nameLayer = distance.children[0];
	$contenttarget.append( distance );
	
	scene.add( dae );
	scene.add( solarSystem );

	ss[1].orbit.rotation.set( 2.25, -1.9, .19);
	ss[3].orbit.rotation.set( 2, 0, -.003);
	ss[2].orbit.rotation.set( 2, 0, -.05);
	ss[4].orbit.rotation.set( 1.99, 2.7, .025);
	ss[5].orbit.rotation.set(1.99, -2.1,0);
	ss[6].orbit.rotation.set(2.025, -2, 0.075);
	ss[7].orbit.rotation.set( 1.98, -.25, -.015);
	ss[8].orbit.rotation.set( 2.005, 1.25, -.034);
}

function onDocumentMouseDown( event ) {
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	intersects = raycaster.intersectObjects( solarSystem.children );

	if ( intersects.length > 0 ) {

		// if ( CLICKED != intersects[ 0 ].object ) {

			CLICKED = intersects[ 0 ].object;

			if( clickMove ){
				var posCLICKED = new THREE.Vector3();
				posCLICKED.getPositionFromMatrix( CLICKED.matrixWorld );

				var zScale = 250;
				lookAtCLICKED = { x: posCLICKED.x + 50, y: posCLICKED.y + 50, z: posCLICKED.z + zScale };

				var camCLICKED = new camPosition( lookAtCLICKED, posCLICKED, 1000 );
				camCLICKED.tween();

				console.log( CLICKED.name + " x: " + posCLICKED.x + " y: " + posCLICKED.y + " z: " + posCLICKED.z );
			}
			
		// }
	} 
}

function touchdown( rocket ){
	//console.log("touchdown?");
	var marsPosFromMatrix = new THREE.Vector3();
	marsPosFromMatrix.getPositionFromMatrix( solarSystem.children[8].matrixWorld );

	var marsPos = solarSystem.children[8].position;

	var marsRadius = ssScale.planetScale * ephemeris[4].size;
	var trajLen = rocket.line.geometry.vertices.length - 1;
	var trajFinalPoint = rocket.line.geometry.vertices[ trajLen ];

	if( marsPos.distanceTo( trajFinalPoint ) < marsRadius ){
		return true;
	}else return false;
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

	renderer.setSize( $(window).width(), $(window).height() );

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();
	camera.lookAt( camTarget );

	SUN.scale.x = ssScale.sunScale;
	SUN.scale.y = ssScale.sunScale;
	SUN.scale.z = ssScale.sunScale;
	var sunPos = new THREE.Vector3();
	sunPos.getPositionFromMatrix(camera.matrixWorld);
	SUN.lookAt(sunPos);

	saturnRing.scale.x = ssScale.planetScale;
	saturnRing.scale.y = ssScale.planetScale;
	saturnRing.scale.z = ssScale.planetScale;
	saturnRing.position.set(ss[6].position.x,ss[6].position.y,ss[6].position.z)
	
	updateRulers();


	rulerMidpoint.position = ruler.mid;
	rulerMidpoint.lookAt( camera.position );

	if ( showDistance ){
		var vector = new THREE.Vector3();
		var screenPos = screenXY( vector.getPositionFromMatrix( rulerMidpoint.matrixWorld ) );

		distance.style.opacity=1.0;
	    distance.style.left = screenPos.x + 'px';
	    distance.style.top = screenPos.y + 'px';
    	var milesNumber = Math.round( ( ruler.getDistance() / ssScale.s ) * 0.621371 );
    	var kmNumber = Math.round( ruler.getDistance() / ssScale.s );
		distance.nameLayer.innerHTML =  (milesNumber/1000000).toFixed(0) + " million miles<br>" + (kmNumber/1000000).toFixed(0) + " million km";
	} else {
		distance.nameLayer.innerHTML = "";
		distance.style.opacity=0.0;
	}


    // updateLabels();
	controls.update();
	// stats.update();
	TWEEN.update();
	setSolarSystemScale();

	planetsOrbit( timer.JD );

	// console.log( departure_time.jd_tt() );
	if (trajectory != null ) {
		trajectory.drawTrajectory( timer.JD, ssScale.s );
	}

	uniforms.time.value = timer.JD / 20;

	timer.JD = timer.JD + timer.multiplier;
	camera.lookAt( camTarget );
	render();
}

function render() {

	renderer.clear();
	renderer.render( scene, camera );

}

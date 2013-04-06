var Orbit = function( planetNum, e, scale ){
	
	var axisRez = 40 * planetNum,
		eph = e;

	var axisPoints = [];
	var spline = [];

	var material = new THREE.LineBasicMaterial( { 
		color: 0x202020, 
		opacity: .5, 
		linewidth: 1 
	});

	var particles = new THREE.Geometry(),
	    pMaterial = new THREE.ParticleBasicMaterial({
	        color: 0x505050,
	        size: 1.5,
	        fog: true,
	        transparent: true
	});
	
	for( var i = 0; i < axisRez; i++ ) {
		x = ( eph.A * Math.cos( i / axisRez * Math.PI * 2 ) + ( eph.aphelion - eph.A ) );
		z = ( eph.semiMinor * Math.sin( i / axisRez * Math.PI * 2 ) );
		axisPoints[i] = new THREE.Vector3( x, 0, z );
	}
		
	spline =  new THREE.ClosedSplineCurve3( axisPoints );
	var splineGeo = new THREE.Geometry();
	var splinePoints = spline.getPoints( axisRez );
	
	for(var i = 0; i < splinePoints.length; i++){
		splineGeo.vertices.push(splinePoints[i]);
		particles.vertices.push(splinePoints[i]); 
	}

	var particleSystem = new THREE.ParticleSystem( particles, pMaterial);
	var LOD = new THREE.Line( splineGeo, material );	

 return particleSystem;
};
var orbit = function( e, material ){
	
	var LOD = new THREE.LOD(),
		LODLevel = 3,
		LODDistance = 3000,
		axisRez = 50,
		eph = e;

	for (var i = 0; i < LODLevel; i++) {
		axisRez = axisRez / ( i + 1 );
		var axisPoints = [];
		var spline = [];
		
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
		}
		
		var line = new THREE.Line( splineGeo, material );

		line.updateMatrix();
		line.autoUpdateMatrix = false;
		LOD.addLevel( line, i * LODDistance );	
	}

 return LOD;
};
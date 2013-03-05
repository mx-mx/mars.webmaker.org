
var Planet = function( segW, segH, mat, axisMat ){

	var 
		planetTexture = new THREE.Texture(),
		textureLoader = new THREE.ImageLoader(),
		planetLod = new THREE.LOD(),
		geometry,
		planetMaterial = mat,
		mesh,
		semiMaj,
		semiMin,
		aph,
		eccen,
		line,
		lineLod,
		spline,
		splineGeo,
		axisMaterial = axisMat,
		splinePoints,
		axisPoints,
		lodLevel = 3,
		lodDistance = 3000;

		for (var i = 0; i < lodLevel; i++) {
			geometry = new THREE.SphereGeometry( 1, segW / ( i + 1) , segH / ( i + 1 ) );
			mesh = new THREE.Mesh( geometry, planetMaterial);
			mesh.updateMatrix();
			mesh.autoUpdateMatrix = false;
			planetLod.addLevel( mesh, i * lodDistance);	
		}
		
		planetLod.updateMatrix();


	return {

		mesh: planetLod,

    	drawPlanet: function ( scene ) {
				scene.add( planetLod );
            },

    	removePlanet: function ( scene ) {
				scene.remove( planetLod );
            },

		setOrbit: function( semiMajor, aphelion, eccentricity, ssScale ){

			semiMaj = semiMajor; 
			aph = aphelion; 
			eccen = eccentricity;

			semiMin = semiMajor * Math.sqrt( 1 - eccentricity * eccentricity ); 

			planetLod.position.x = semiMaj * Math.cos( axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
			planetLod.position.z = semiMin * Math.sin( axisRez * Math.PI * 2 ) * ssScale;

		},

		drawOrbit: function( axisRez, scene ){
			lineLod = new THREE.LOD();

			for (var i = 0; i < lodLevel; i++) {

				axisRez = axisRez / ( i + 1 );
				axisPoints = [];
				spline = [];
				
				for( var i = 0; i < axisRez; i++ ) {
					x = semiMaj * Math.cos( i / axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
					z = semiMin * Math.sin( i / axisRez * Math.PI * 2 ) * ssScale;
					axisPoints[i] = new THREE.Vector3( x, 0, z );
				}
					
				spline =  new THREE.ClosedSplineCurve3( axisPoints );
				splineGeo = new THREE.Geometry();
				splinePoints = spline.getPoints( axisRez );
				
				for(var i = 0; i < splinePoints.length; i++){
					splineGeo.vertices.push(splinePoints[i]);  
				}
				
				line = new THREE.Line( splineGeo, axisMaterial );

				line.updateMatrix();
				line.autoUpdateMatrix = false;
				lineLod.addLevel( line, i * lodDistance);	
			}

			scene.add( lineLod );

		},

		removeOrbit: function( scene ){
			scene.remove( line );
		},

		orbit: function( time, days ){

			var orbitTime = time / days;

			planetLod.position.x = semiMaj * Math.cos( axisRez * Math.PI * 2 + orbitTime) * ssScale + ( ( aph - semiMaj ) * ssScale );
			planetLod.position.z = semiMin * Math.sin( axisRez * Math.PI * 2 + orbitTime) * ssScale;

		}
	}
};
	
// var planetTexture, textureLoader;

var Planet = function( radius, segW, segH, texture ){

	var 
		planetTexture,
		textureLoader,
		planetLod,
		geometry,
		material,
		mesh,
		semiMaj,
		semiMin,
		aph,
		eccen,
		line,
		lineLod,
		spline,
		splineGeo,
		splineMat,
		splinePoints,
		axisPoints,
		lodLevel = 3,
		lodDistance = 1000;

	// loadTexture( texture );
	planetTexture = new THREE.Texture();
	textureLoader = new THREE.ImageLoader();

	textureLoader.addEventListener( 'load', function ( event ) {

		planetTexture.image = event.content;
		planetTexture.needsUpdate = true;

		});

	textureLoader.load( texture );

	planetLod = new THREE.LOD();
	material = new THREE.MeshLambertMaterial( { map: planetTexture, overdraw: true } );

	for (var i = 0; i < lodLevel; i++) {
		geometry = new THREE.SphereGeometry( radius, segW / ( i + 1) , segH / ( i + 1 ) );
		mesh = new THREE.Mesh( geometry, material);
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

		drawOrbit: function( axisRez ){

			lineLod = new THREE.LOD();
			splineMat = new THREE.LineBasicMaterial( { color: 0xF22E2E, opacity: 0.25, linewidth: 1 } );
 
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
				
				line = new THREE.Line( splineGeo, splineMat );

				line.updateMatrix();
				line.autoUpdateMatrix = false;
				lineLod.addLevel( line, i * lodDistance);	
			}

			scene.add( lineLod );


			// axisPoints = [];
			// spline = [];

			// splineMat = new THREE.LineBasicMaterial( { color: 0xff00f0, opacity: 0.25, linewidth: 1 } );

			// for( var i = 0; i < axisRez; i++ ) {
			// 	x = semiMaj * Math.cos( i / axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
			// 	z = semiMin * Math.sin( i / axisRez * Math.PI * 2 ) * ssScale;
			// 	axisPoints[i] = new THREE.Vector3( x, 0, z );
			// }
			
			// spline =  new THREE.ClosedSplineCurve3( axisPoints );
			// splineGeo = new THREE.Geometry();
			// splinePoints = spline.getPoints( axisRez );
			
			// for(var i = 0; i < splinePoints.length; i++){
			// 	splineGeo.vertices.push(splinePoints[i]);  
			// }
			
			// line = new THREE.Line( splineGeo, splineMat );
			// scene.add( line );

		},

		removeOrbit: function( scene ){
			scene.remove( line );
		},

		startOrbit: function( time, days ){
			var orbitTime = time / days;
			planetLod.position.x = semiMaj * Math.cos( axisRez * Math.PI * 2 + orbitTime) * ssScale + ( ( aph - semiMaj ) * ssScale );
			planetLod.position.z = semiMin * Math.sin( axisRez * Math.PI * 2 + orbitTime) * ssScale;
			//planetLod.rotation.y = time;

		}
	}
};
	
var Planet = function( radius, segW, segH, texture){

	var 
		planetTexture,
		textureLoader,
		lod,
		geometry,
		material,
		mesh
	;

	planetTexture = new THREE.Texture();
	textureLoader = new THREE.ImageLoader();

	textureLoader.addEventListener( 'load', function ( event ) {

		planetTexture.image = event.content;
		planetTexture.needsUpdate = true;

	} );

	textureLoader.load( texture );
	
	lod = new THREE.LOD();
	//var material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	material = new THREE.MeshBasicMaterial( { map: planetTexture, overdraw: true } );

	for (var i = 0; i < 4; i++) {
			geometry = new THREE.SphereGeometry( radius, segW / ( i + 1) , segH / ( i + 1 ) );
			mesh = new THREE.Mesh( geometry, material);
			mesh.updateMatrix();
			mesh.autoUpdateMatrix = false;
			lod.addLevel( mesh, i * 5000);	
	}
	
	lod.updateMatrix();

	return {

		mesh: lod,

    	addTo: function ( scene ) {
				scene.add( lod );
            },

    	removeFrom: function ( scene ) {
				scene.remove( lod );
            }

	}
};
	
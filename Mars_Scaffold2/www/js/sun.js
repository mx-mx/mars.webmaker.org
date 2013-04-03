var uniforms = {

	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },

	fogDensity: { type: "f", value: 0 },
	fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },

	texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "./images/lava/cloud.png" ) },
	texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "./images/lava/lavatilecopy.jpg" ) },

	uvScale: { type: "v2", value: new THREE.Vector2( 1, 1 ) }

};


var Sun = function(){

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var sunMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: shaderList.lavashader.vertex,
		fragmentShader: shaderList.lavashader.fragment

	} );

	// var sunMaterial = new THREE.MeshLambertMaterial( { 
	// 	map: THREE.ImageUtils.loadTexture( './models/solarsystem/sunmap.jpg' ), 
	// 	overdraw: true 
	// });
	
	// var sun = new Planet( sunMaterial );

	sunGeo = new THREE.SphereGeometry( 1392684, 15, 15 );
	sun = new THREE.Mesh ( sunGeo, sunMaterial );

	sun.name = "The Sun";

	// var gyro = new THREE.Gyroscope();
	// var gyroGeo = new THREE.Mesh( new THREE.PlaneGeometry( 1392684*2, 1392684*2 ), new THREE.MeshLambertMaterial( { color: 0xCC0000, opacity:0 } ) );
	// gyroGeo.position.set(0,0,0);
	// gyro.add( gyroGeo );
	// sun.add( gyro );

	/********************************
	LENS FLARE
	********************************/
	return sun;
}

var Planet = function( material ){

	var LOD,
		LODLevel = 3,
		LODDistance = 3000,
		eph;

	sphereGeo = new THREE.SphereGeometry( 1, 15, 15 );
	LOD = new THREE.Mesh ( sphereGeo, material );
	LOD.startTime = 0;

	LOD.setOrbit = function( e ){
		eph = e;
		this.startTime = Math.random() * eph.A;
		this.orbiting( this.startTime, eph.period, .00001 );
	};

	LOD.orbiting = function( time, scale ){

		time += this.startTime;

		var orbitSpeed = time / eph.period;
		this.rotation.y = time * eph.period / 1000; 
		this.position.x = scale * ( eph.A * Math.cos( Math.PI * 2 - orbitSpeed ) + ( eph.aphelion - eph.A ) );
		this.position.z = scale * ( eph.semiMinor * Math.sin(  Math.PI * 2 - orbitSpeed ) );
	};

	return LOD;
};


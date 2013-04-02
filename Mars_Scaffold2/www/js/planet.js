var Planet = function( size, material, i ){

	var LOD,
		LODLevel = 3,
		LODDistance = 3000;
	var planetID = i;
	var scale = 1;
	var lastDate = 0;

	sphereGeo = new THREE.SphereGeometry( size, 15, 15 );
	LOD = new THREE.Mesh ( sphereGeo, material );
	// LOD.startTime = 0;
	// LOD.position.x = 100000;
	// LOD.position.y = 100000;
	// LOD.position.z = 100000;

	LOD.orbiting = function( JD, s ){

		scale = s;
		var body = null;

		if (planetID == 1) {
	        body = DE405Body.MERCURY;
		} else if (planetID == 2) {
	        body = DE405Body.VENUS;
		} else if (planetID == 3) {
	        body = DE405Body.EARTH;
		} else if (planetID == 4) {
	        body = DE405Body.MARS;
		} else if (planetID == 5) {
	        body = DE405Body.JUPITER;
		} else if (planetID == 6) {
	        body = DE405Body.SATURN;
		} else if (planetID == 7) {
	        body = DE405Body.URANUS;
		} else if (planetID == 8) {
	        body = DE405Body.NEPTUNE;
		} else if (planetID == 9) {
	        body = DE405Body.PLUTO;
		}

		var time = new Time( { mjd_UTC:TimeUtils$JDtoMJD(JD) } );
		marsOdyssey.ephemeris.get_planet_pos(body, time, this);

		var date = JD.Julian2Date();
		if ((planetID == 3) && (date.getMonth() != lastDate)) {
			lastDate = date.getMonth();
		}

	};

	LOD.ephemerisCallback = function(result) {

		this.position.x = result.x[0] * scale;// / 1000000;
		this.position.y = result.x[1] * scale;// / 1000000;
		this.position.z = result.x[2] * scale;// / 1000000;

		if ((this.position.x === 0) && (this.position.y === 0) && (this.position.z === 0)) {
			this.position.x = 1000000;
			this.position.y = 1000000;
			this.position.z = 1000000;
		}

	};

	return LOD;

};


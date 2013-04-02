var ss = [], 
	sun, 
	ssScale;


function findSemiMinor(){
	for( var i = 1; i < ephemeris.length; i++ ){
		ephemeris[i].semiMinor = ephemeris[i].A * Math.sqrt( 1 - ephemeris[i].EC * ephemeris[i].EC );
	}
}

var solarSystemScale = function(){
	this.s = .000001;	
	this.sunScale = .00001;
	this.planetScale = .001;
	return this;
} 				

function planetsOrbit( time ){
	for ( var i = 1; i < ss.length; i ++ ) {
        var planet = ss[i];
		ss[i].orbiting( time, ssScale.s );
	}
}	

function setSolarSystemScale(){

	ss[0].scale.set( ssScale.sunScale, ssScale.sunScale, ssScale.sunScale );

	for ( var i = 1; i < ss.length; i ++ ) {
		ss[i].scale.set( ssScale.planetScale, ssScale.planetScale, ssScale.planetScale );
		ss[i].orbit.scale.set( ssScale.s, ssScale.s, ssScale.s );
    }
}

function makeSolarSystem(){

	ssScale = new solarSystemScale();
	ssScale.s = .000001;
	ssScale.sunScale = .00002;
	ssScale.planetScale = .001;

	var ss3D = new THREE.Object3D();

	ss.push(  new Sun() );
	ss[0].rotation.x = 2;
	ss3D.add( ss[0] );

	ss[0].label = new Label( ss[0], 1, container );

	findSemiMinor();
	for ( var i = 1; i < ephemeris.length; i ++ ) {

		var planetMaterial = new THREE.MeshLambertMaterial( { 
				map: THREE.ImageUtils.loadTexture( ephemeris[i].texture ), 
				overdraw: true 
		});

		ss.push( new Planet( ephemeris[i].size, planetMaterial, i ) );
		ss[i].rotation.x = 2;
		ss[i].name = ephemeris[i].name;


		ss[i].orbit = new Orbit( i, ephemeris[i], ssScale.s );
		// ss[i].orbit.rotation.x = 2;
		ss[i].orbit.name = ss[i].name + " Orbit";
		ss3D.add( ss[i].orbit );

		ss3D.add( ss[i] );
		ss[i].label = new Label( ss[i], 1, container );
	}

	return ss3D;
};

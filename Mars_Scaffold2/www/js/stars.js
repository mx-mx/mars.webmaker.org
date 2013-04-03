var starsCount = 0;
var stars = function( amount, systemSize, particleSize){
    
    var particles, geometry, material, i;
    var systemLimit = systemSize / 50;
    // console.log(systemLimit);
    geometry = new THREE.Geometry();

    for ( i = 0; i < amount; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = getRandom( systemLimit, systemSize );
        vertex.y = getRandom( systemLimit, systemSize );
        vertex.z = getRandom( systemLimit, systemSize );

        geometry.vertices.push( vertex );

    }

    material =   new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: particleSize,
        map: THREE.ImageUtils.loadTexture( "images/star.png" ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    particles = new THREE.ParticleSystem( geometry, material );
    return particles;
}

function getRandom( min, max ){
    var number = Math.floor(Math.random() * max ) - max / 2 ;
    if ( number > min || number < -min ){
        return number; 
    }
    else{
        getRandom( min, max );
    }
}
              
   
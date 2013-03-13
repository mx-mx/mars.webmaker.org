var timer = function(){
	this.count = 1;
	this.multiplier = .25;
	return this;
}

function vec3Mid( vec1, vec2 ){
	var vec = new THREE.Vector3();
	vec.x = (vec1.x + vec2.x) / 2;
	vec.y = (vec1.y + vec2.y) / 2;
	vec.z = (vec1.z + vec2.z) / 2;
	return vec;
}

function screenXY( vec3 ) {
    var projector = new THREE.Projector();
    var vector = projector.projectVector( vec3, camera );
    var result = new Object();

    result.x = Math.round(vector.x * (window.innerWidth / 2)) + window.innerWidth / 2;
    result.y = Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2;
    return result;
}

function keyInObject( obj ){
	for (var key in obj ) {
	   if (obj.hasOwnProperty(key)) {
	      var o = obj[key];
	      for (var prop in o) {
	         if (o.hasOwnProperty(prop)) {
	            console.log(o[prop]);
	         }
	      }
	   }
	}
}
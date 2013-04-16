function Tweener( obj, target, time ){
	var scaler = new TWEEN.Tween( obj )
		.to( target, time )
		.easing( TWEEN.Easing.Sinusoidal.InOut )
		.start();
}

// Grid

function CreateGrid( floor, step, size ){
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
	var geometry = new THREE.Geometry();
	// var floor = 0, step = .5, size = 50;

	for ( var i = 0; i <= size / step * 2; i ++ ) {

		geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );

	}

	var grid = new THREE.Line( geometry, material, THREE.LinePieces );
	return grid;
}
var OUTCROPS = new Array();

var Outcrop = function(imgFile, trgtSize, useLambert){

	this.name = "Outcrop " + ( OUTCROPS.length + 1 );
	this.x = 0;
	this.z = 0;
	this.targetSize = 5;
	if(trgtSize) this.targetSize = trgtSize;
	this.arrowHidden = true;
	this.targetHidden = true;
	
	var targetMaterial;
	if(useLambert) {
		targetMaterial = new THREE.MeshLambertMaterial( { 
			map: THREE.ImageUtils.loadTexture( imgFile ), 
			overdraw: true,
			transparent: true
		});
	} else {
		targetMaterial = new THREE.MeshBasicMaterial( { 
			map: THREE.ImageUtils.loadTexture( imgFile ), 
			overdraw: true,
			transparent: true
		});
	}

	this.target = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), targetMaterial );
	this.target.rotation.x = -90 * toRadians;

	var arrowMaterial = new THREE.MeshBasicMaterial( { 
		map: THREE.ImageUtils.loadTexture( './images/pointer.png' ), 
		overdraw: true,
		transparent: true
	});

	this.arrow = new THREE.Mesh( new THREE.PlaneGeometry( 1, 5 ), arrowMaterial );

	OUTCROPS.push( this );
	return this;
}

Outcrop.prototype.showTarget = function(){
	if ( this.targetHidden ){
		this.targetHidden = false;
		scene.add( this.target );
		this.target.position.set( this.x, .01, this.z);
		this.target.scale.x = .01;
		this.target.scale.y = .01;
		Tweener( this.target.scale, { x:this.targetSize, y:this.targetSize, z:this.targetSize }, 1000 ); 
	}
}

Outcrop.prototype.hideTarget = function(){
	this.targetHidden = true;
	scene.remove( this.target );
}

Outcrop.prototype.showArrow = function(){
	if ( this.arrowHidden ){
		scene.add( this.arrow );
		this.arrow.position.set( this.x, 15, this.z); 
		Tweener( this.arrow.position, {x: this.x, y:3, z:this.z}, 1000 );
		this.arrowHidden = false;
	}
}

Outcrop.prototype.hideArrow = function(){
	this.arrowHidden = true;
	scene.remove( this.arrow );
}

Outcrop.prototype.setPosition = function( x, z ){
	this.x = x;
	this.z = z;
	this.target.position.x = this.x;
	this.target.position.z = this.z;
	this.arrow.position.x = this.x;
	this.arrow.position.z = this.z;
}

Outcrop.prototype.touchdown = function( mesh, sensitivity ){

	var posFromMatrix = new THREE.Vector3();
	posFromMatrix.getPositionFromMatrix( mesh.matrixWorld );

	// var marsPos = mesh.position;

	if( posFromMatrix.distanceTo( this.target.position ) <= this.target.scale.x * sensitivity ){
		return true;
	}else return false;
}

Outcrop.prototype.updateArrow = function(){
	var vector = new THREE.Vector3();
	vector.getPositionFromMatrix( this.arrow.matrixWorld );

	var camVec = new THREE.Vector3();
	camVec.getPositionFromMatrix( camera.matrixWorld );

	vector.sub( camVec );
	this.arrow.rotation.y = Math.atan2( vector.x, vector.z) + 3;	
}

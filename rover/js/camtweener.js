var CAMTWEEN = function( position, target, time ){
	this.tween = function(){
		TWEEN.removeAll();
		camTweener( position, target, time * 1000 );
	};
	return this;
}

function camTweener( newCamPosition, newTarget, time ) {

	var update	= function() {

		camera.position.x = camCurrentPosition.x;
		camera.position.y = camCurrentPosition.y;
		camera.position.z = camCurrentPosition.z;

		camera.rotation.x = camCurrentRotation.x;
		camera.rotation.y = camCurrentRotation.y;
		camera.rotation.z = camCurrentRotation.z;

		camTarget = camCurrentTarget;

	}

	var camCurrentPosition	= {
		x: camera.position.x, 
		y: camera.position.y, 
		z: camera.position.z 
	};

	var camCurrentRotation	= {
		x: camera.rotation.x, 
		y: camera.rotation.y, 
		z: camera.rotation.z 
	};

	var camCurrentTarget = camTarget;

	tweenPosition = new TWEEN.Tween( camCurrentPosition )
		.to( newCamPosition , time )
		.delay(0)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onStart( function(){ 
			controls.enabled = false; 
			controls.noRotate = true;						
			controls.noPan = true;
			controls.noZoom = true;
			controls.update();
		} )
		.onComplete( function(){ 
			controls.enabled = true; 
			controls.noRotate = false;						
			controls.noPan = false;
			controls.noZoom = false;
			controls.update();

		} )
		.onUpdate( update );

	tweenPOI = new TWEEN.Tween( camCurrentTarget )
		.to( newTarget, time)
		.delay(0)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onUpdate( update )
		.onComplete( function(){
			camera.lookAt( newTarget );
		});

	tweenPosition.start();
	tweenPOI.start();
}
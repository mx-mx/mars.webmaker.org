var camPosition = function( position, target, time ){
	this.pos = position;
	this.tar = target;
	this.t = time;
	this.tween = function(){
		TWEEN.removeAll();
		camTweener( this.pos, this.tar, this.t );
	};
	return this;
}

function camTweener( newCamPosition, newTarget, time ) {

	var tweenPosition = new TWEEN.Tween( camera.position )
		.to( newCamPosition , time )
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onStart( function(){ 
			controls.enabled = false; 
			controls.update();
		} )
		.onUpdate( function(){} )
		.onComplete( function(){ 
			controls.enabled = true; 
			controls.update();

		} );

	tweenPosition.start();
	Tweener( camTarget, newTarget, time );	
}

a = new TWEEN.Tween(ssScale).to( {s:.000001}, 2000);



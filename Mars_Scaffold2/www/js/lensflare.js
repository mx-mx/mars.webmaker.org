
// var textureFlare0 = THREE.ImageUtils.loadTexture("./images/lensflare/lensflare0.png");
// var textureFlare1 = THREE.ImageUtils.loadTexture("./images/lensflare/lensflare1.png");
// var textureFlare2 = THREE.ImageUtils.loadTexture("./images/lensflare/lensflare2.png");
// var textureFlare3 = THREE.ImageUtils.loadTexture("./images/lensflare/lensflare3.png");

function addLensFlare( x, y, z, size ){

    var flareColor = new THREE.Color( 0xffffff );
    THREE.ColorUtils.adjustHSV(flareColor, 0.08, 0.5, 0.5);

    var textureFlare0 = THREE.ImageUtils.loadTexture( "./images/lensflare/lensflare0_alpha.png" );
    var textureFlare2 = THREE.ImageUtils.loadTexture( "./images/lensflare/lensflare2.png" );
    var textureFlare3 = THREE.ImageUtils.loadTexture( "./images/lensflare/lensflare3.png" );

    var lensFlare = new THREE.LensFlare( textureFlare0, 500, 0.0, THREE.AdditiveBlending, flareColor );

    // lensFlare.add( textureFlare0, 1000, 0.0, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

    // lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
    // lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

    lensFlare.customUpdateCallback = lensFlareUpdateCallback;

    lensFlare.position = new THREE.Vector3(x,y,z);
    lensFlare.size = size;
    return lensFlare;

}

function lensFlareUpdateCallback( object ) {
    var f, fl = this.lensFlares.length;
    var flare;
    var vecX = -this.positionScreen.x * 2;
    var vecY = -this.positionScreen.y * 2;
    var size = object.size ? object.size : 1000;
    var camDistance = camera.position.length();
    
    for (f = 0; f < fl; f++) {
        flare = this.lensFlares[f];
        flare.x = this.positionScreen.x + vecX * flare.distance;
        flare.y = this.positionScreen.y + vecY * flare.distance;
        flare.scale = size / camDistance;
        flare.rotation = 0;
        flare.opacity = 1.0 - heatVisionValue;
    }
}
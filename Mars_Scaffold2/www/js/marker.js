var markers = [];

function updateMarkers() {
    for (var i in markers) {
        var marker = markers[i];
        marker.update();
    }
}

function attachMarker( text, glObject, size, element ) {

  glObject.updateMatrix();

  var template = document.getElementById('marker_template');
  var marker = template.cloneNode(true);

  marker.$ = $(marker);
  marker.markerWidth = marker.$.outerWidth();
  marker.obj = glObject;

  marker.absPosition = marker.obj.position;
  marker.size = size !== undefined ? size : 1.0;

  var nameLayer = marker.children[0];
  marker.nameLayer = nameLayer;
  marker.nameLayer.innerHTML = text;

  element.appendChild( marker );

  glObject.updateMatrixWorld;
  var transform = CSStransform( 0, 0, marker.obj, size );

  marker.style.WebkitTransformOrigin = "0% 0%";
  marker.style.WebkitTransform = transform;
  marker.style.MozTransformOrigin = "0% 0%";
  marker.style.MozTransform = transform;

  marker.setPosition = function (x, y) {
      x -= this.markerWidth * 0.5;
      this.style.left = x + 'px';
      this.style.top = y + 'px';
  };

  marker.setPosition( glObject.scale.x ,0 );

  marker.update = function () {
    var s = (0.05 + camera.position.z / 2000) * this.size;
    setDivPosition(this, this.obj, .25);
  };

  markers.push(marker);
}


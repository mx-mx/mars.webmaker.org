// Legacy Markers from 100,000 Stars
// http://workshop.chromeexperiments.com/stars/

var legacyMarkers = [];

function updateLegacyMarkers() {
    for (var i in legacyMarkers) {
        var marker = legacyMarkers[i];
        marker.update();
    }
}

function screenXY(vec3) {
    var projector = new THREE.Projector();
    var vector = projector.projectVector(vec3.clone(), camera);
    var result = new Object();
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if (windowWidth < minWidth) {
        windowWidth = minWidth;
    }
    result.x = Math.round(vector.x * (windowWidth / 2)) + windowWidth / 2;
    result.y = Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2;
    return result;
}

function attachLegacyMarker(text, obj, size, visibleRange) {

    var template = document.getElementById('legacy_marker_template');
    var marker = template.cloneNode(true);

    marker.obj = obj;
    marker.absPosition = obj.position;

    marker.size = size !== undefined ? size : 1.0;

    marker.visMin = visibleRange === undefined ? 0 : visibleRange.min;
    marker.visMax = visibleRange === undefined ? 1000 : visibleRange.max;

    marker.$ = $(marker);

    var container = document.getElementById('container');
    container.appendChild( marker );

    marker.setVisible = function (vis) {
        if (vis) {
            this.style.opacity = 1.0;
        } else {
            this.style.opacity = 0.0;
        }
        if (vis) this.style.visibility = 'visible';
        else this.style.visibility = 'hidden';
        return this;
    };

    marker.setSize = function (s) {
        this.style.fontSize = s + 'px';
    };

    marker.setPosition = function (x, y) {
        x -= this.markerWidth * 0.5;
        this.style.left = x + 'px';
        this.style.top = y + 'px';
    };

    var nameLayer = marker.children[0];
    marker.nameLayer = nameLayer;
    nameLayer.innerHTML = text;
    marker.markerWidth = marker.$.outerWidth();
    marker.zero = new THREE.Vector3();

    marker.update = function () {

        var matrix = this.obj.matrixWorld;
        var abspos = matrix.multiplyVector3( this.obj.position.clone() )
            .multiplyScalar(0.5);
        var screenPos = screenXY( abspos );

        var inCamRange = (camera.position.z > this.visMin && camera.position.z < this.visMax);
        var inCamFrame = (screenPos.x > 0 && screenPos.x < screenWidth && screenPos.y > 0 && screenPos.y < screenHeight);

        var isParentVisible = this.obj.visible;

        if (isParentVisible && inCamRange) this.setPosition(screenPos.x, screenPos.y);
        if (inCamRange && inCamFrame && isParentVisible) this.setVisible(true);
        else this.setVisible(false);
    };

    legacyMarkers.push(marker);
}
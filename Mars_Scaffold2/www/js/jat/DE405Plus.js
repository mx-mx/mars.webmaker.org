/* JAT: Java Astrodynamics Toolkit
 * 
  Copyright 2012 Tobias Berthold

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The DE405 Ephemeris data files from JPL are given in the ICRF frame. This
 * class allows to choose the frame for which position and velocity are
 * calculated (See DE405Frame.java)
 * 
 */
//public class DE405Plus extends DE405APL /*implements FirstOrderDifferentialEquations, unitModel*/ {
DE405Plus.prototype = new DE405APL;

function DE405Plus(/*PathUtil*/ path) {
		this.path = path;
		this.DE405_path = path.DE405Path;
//		ephFrame = frame.ICRF;
		this.sb = new SolarSystemBodies();

		this.posUserFrame = new Array(11);//VectorN[11];
		this.velUserFrame = new Array(11);//VectorN[11];
	}

DE405Plus.prototype.getDimension = function() {
		return 6;
};

DE405Plus.prototype.update_posvel_and_frame = function(/*Time*/ t, callback) /*throws IOException*/ {

		var ephemeris = this;
		this.update_planetary_ephemeris(t, function() {

			// Default frame is ICRF
			for (var q in DE405Body) {
				var /*int*/ bodyNumber = DE405Body[q].ordinal;
				ephemeris.posUserFrame[bodyNumber] = ephemeris.posICRF[bodyNumber];
				ephemeris.velUserFrame[bodyNumber] = ephemeris.velICRF[bodyNumber];
				// System.out.println("[DE405Plus bodyNumber]" + bodyNumber);
			}
			callback();
		});

	};

DE405Plus.prototype.get_planet_pos = function(/*body*/ bodyEnum, /*Time*/ t, callback) /*throws IOException*/ {

	var ephemeris = this;
	this.update_posvel_and_frame(t, function() {
		callback.ephemerisCallback(ephemeris.posICRF[bodyEnum.ordinal]);
	});

};

DE405Plus.prototype.get_planet_vel = function(/*body*/ bodyEnum, /*Time*/ t, callback) /*throws IOException*/ {

	var ephemeris = this;
	this.update_posvel_and_frame(t, function() {
		callback.ephemerisCallback(ephemeris.velUserFrame[bodyEnum.ordinal]);
	});

};
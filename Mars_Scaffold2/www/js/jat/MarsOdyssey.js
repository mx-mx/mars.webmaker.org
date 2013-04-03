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
 * @author nancy
 *
 */


function MarsOdyssey() {
	// console.log("MarsOdyssey");
	this.ephemeris = null;
	this.departure_time = null;
	this.arrival_time = null;
	this.r0 = null;
	this.v0 = null;
	this.rf = null;
	this.vf = null;
	this.trajectoryIndex = 0;
	this.trajectory = new Array();
	this.complete = false;
	this.lastTrajectoryPoint;
	this.lastLine;
	this.lastTime;
}
 MarsOdyssey.prototype.ephemerisCallback = function(result) {
	if (this.r0 == null) {
		this.r0 = result;
		this.r0.print("r0");
        this.ephemeris.get_planet_vel(DE405Body.EARTH, this.departure_time, this);
	} else if (this.v0 == null) {
		this.v0 = result;
		this.v0.print("v0");
		// console.log("orbital velocity of earth " + this.v0.mag());
		this.ephemeris.get_planet_pos(DE405Body.MARS, this.arrival_time, this);
	} else if (this.rf == null) {
		this.rf = result;
		this.rf.print("rf");
		this.ephemeris.get_planet_vel(DE405Body.MARS, this.arrival_time, this);
	} else {
		this.vf = result;
		this.vf.print("vf");
		// .log("orbital velocity of Mars " + this.vf.mag());

		var initpos = new TwoBody({r:this.r0, v:this.v0});
		var finalpos = new TwoBody({r:this.rf, v:this.vf});

//			var /*Printable*/ x = new Callback();
		// propagate the orbits for plotting
		initpos.propagate(0., initpos.period(), this, true);
//			x.plotnum++;
		finalpos.propagate(0., finalpos.period(), this, false);
//			x.plotnum++;
		var days = this.arrival_time.jd_tt() - this.departure_time.jd_tt();
        var tof = days * 86400.0;
		var /*double*/ muforthisproblem = Constants$GM_Sun / 1.e9;
		var /*Lambert*/ lambert = new Lambert(muforthisproblem);
		var /*double*/ totaldv;
//			try {
			totaldv = lambert.compute(this.r0, this.v0, this.rf, this.vf, tof);
//			} catch (/*LambertException*/ e) {
//				totaldv = -1;
//				//e.printStackTrace();
			// .log("MarsOdyssey.init LambertException " + e);
//			}
		// apply the first delta-v
		var /*VectorN*/ dv0 = lambert.deltav0;
		this.v0 = this.v0.plus(dv0);
		// .log("tof = " + lambert.tof);
		var /*TwoBody*/ chaser = new TwoBody({mu:muforthisproblem, r:this.r0, v:this.v0});
		chaser.print("chaser orbit");
		chaser.propagate(0.0, tof, this, true);

		this.complete = true;
	}
};

MarsOdyssey.prototype.toString = function() {
	return "MarsOdyssey";
};

MarsOdyssey.prototype.init = function( departure_time, arrival_time) {
	// console.log("MarsOdyssey.init");

    var pathUtil = new PathUtil();
    this.ephemeris = new DE405Plus(pathUtil);
	// Mars Odyssey Mission

    this.departure_time = departure_time;
    this.arrival_time = arrival_time;
    // console.log("departure_time = " + this.departure_time.jd_tt() + ", arrival_time = " + this.arrival_time.jd_tt());
    // console.log("departure_time = " + this.departure_time.jd_tt().Julian2Date().toString() + ", arrival_time = " + this.arrival_time.jd_tt().Julian2Date().toString());

	// create a TwoBody orbit using orbit elements
    this.ephemeris.get_planet_pos(DE405Body.EARTH, this.departure_time, this);
};

//	public static void main(String[] args) {
//		MarsOdyssey marsOdyssey = new MarsOdyssey();
//		marsOdyssey.init();
//	}

//}

//class Callback implements Printable {
//	function Callback() {;}
//	@Override

MarsOdyssey.prototype.print = function(time, data) {

	var julianTime = this.departure_time.plus(time);
	if (time == 0) {
		// console.log("time = " + julianTime.jd_tt() + ": x = " + data[0] + ", y = " + data[1] + ", z = " + data[2]);
	}
	this.onAddPoint(julianTime.jd_tt(), + data[0], + data[1], + data[2]);
};

MarsOdyssey.prototype.onAddPoint = function(time, x, y, z) {
	this.trajectory[ this.trajectoryIndex++ ] = { time:time, point:new THREE.Vector3(x, y, z) };
};

MarsOdyssey.prototype.drawTrajectory = function( time, scale ) {

	var start,
		end,
		axisRez,
		axisPoints = [],
		splineMat,
		line	
	;

	if (!this.complete) {
		return;
	}

	var point = null;

	for (var index = 0; index < this.trajectory.length - 1; index++) {
		if ( ( time >= this.trajectory[index].time ) && ( time <= this.trajectory[index + 1].time ) ) {
			point = this.trajectory[index].point;
			break;
		}
	}

	if (point == null) {
		return;
	}

	var x = point.x * scale;
	var y = point.y * scale;
	var z = point.z * scale;

	if (this.lastTrajectoryPoint == null ) {
		this.lastTrajectoryPoint = new THREE.Vector3(x, y, z);
		return;
	}

	end = new THREE.Vector3(x, y, z);
	this.lastTrajectoryPoint = end;

	splineMat = new THREE.LineBasicMaterial( { color: 0x2BBFBD, opacity: 0.25, linewidth: 1.5 } );
	line = new THREE.Line( new THREE.Geometry(), splineMat );

	if ( this.prevLine != null ){
		line.geometry.vertices = this.prevLine.geometry.vertices;
		solarSystem.remove( this.prevLine );
		// this.prevLine.geometry.dispose();
	}

	line.geometry.vertices.push( end );

	solarSystem.add( line );
	this.prevLine = line;
}

Number.prototype.Julian2Date = function() {
	 
    var X = parseFloat(this)+0.5;
    var Z = Math.floor(X); //Get day without time
    var F = X - Z; //Get time
    var Y = Math.floor((Z-1867216.25)/36524.25);
    var A = Z+1+Y-Math.floor(Y/4);
    var B = A+1524;
    var C = Math.floor((B-122.1)/365.25);
    var D = Math.floor(365.25*C);
    var G = Math.floor((B-D)/30.6001);
    //must get number less than or equal to 12)
    var month = (G<13.5) ? (G-1) : (G-13);
    //if Month is January or February, or the rest of year
    var year = (month<2.5) ? (C-4715) : (C-4716);
    month -= 1; //Handle JavaScript month format
    var UT = B-D-Math.floor(30.6001*G)+F;
    var day = Math.floor(UT);
    //Determine time
    UT -= Math.floor(UT);
    UT *= 24;
    var hour = Math.floor(UT);
    UT -= Math.floor(UT);
    UT *= 60;
    var minute = Math.floor(UT);
    UT -= Math.floor(UT);
    UT *= 60;
    var second = Math.round(UT);

    return new Date(Date.UTC(year, month, day, hour, minute, second));
};

//$(document).ready( function() {
//	var marsOdyssey = new MarsOdyssey();
//	marsOdyssey.init();
//} );

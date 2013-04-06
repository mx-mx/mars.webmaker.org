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

//package jat.core.astronomy;
//
//import jat.core.ephemeris.DE405Body.body;
////import jat.core.units.unitCheck;
////import jat.core.units.unitModel;
////import jat.core.units.unitSet;
////import jat.core.units.unitSet.distanceUnit;
////import jat.core.units.unitSet.massUnit;
////import jat.core.units.unitSet.timeUnit;
//
////import java.awt.Color;

//public class SolarSystemBodies /*implements unitModel*/ {

//	public Body[] Bodies;
//	unitSet uS = new unitSet("SolarSystemBodies", distanceUnit.km, timeUnit.sec, massUnit.kg);

//	public class Body {
//		body body;
//		public double radius; // km
//		public double mass; // kg
//		public double orbitalPeriod; // earth days
//		public double mu; // (km^3 * s^−2)
////		public Color color;

		function Body(/*jat.core.ephemeris.DE405Body.body*/ body, /*double*/ radius, /*double*/ mass, /*double*/ orbitalPeriod) {
			this.body = body;
			this.radius = radius; // km
			this.mass = mass; // kg
			this.orbitalPeriod = orbitalPeriod; // earth days
		}

//	}

	function SolarSystemBodies() {

		this.Bodies = new Array(12);//SolarSystemBodies.Body[12];

		this.Bodies[0] = new Body(DE405Body.SUN, 6.96342e5, 1.9891e30, 0);
		this.Bodies[1] = new Body(DE405Body.MERCURY, 2439.7, 330.2e21, 88);
		this.Bodies[2] = new Body(DE405Body.VENUS, 6051.8, 4868.5e21, 225);
		this.Bodies[3] = new Body(DE405Body.EARTH, 6378.1, 5972.2E21, 365);
		this.Bodies[4] = new Body(DE405Body.MARS, 3396., 641.85e21, 687);
		this.Bodies[5] = new Body(DE405Body.JUPITER, 69911, 1898600.0e21, 4332.59);
		this.Bodies[6] = new Body(DE405Body.SATURN, 54364, 568460.0e21, 10759.22);
		this.Bodies[7] = new Body(DE405Body.NEPTUNE, 24764, 1.0243e26, 60190.03);
		this.Bodies[8] = new Body(DE405Body.URANUS, 25559, 8.6810e25, 30799.095);
		this.Bodies[9] = new Body(DE405Body.PLUTO, 1153, 1.305e22, 89865);
		this.Bodies[10] = new Body(DE405Body.MOON, 1737.1, 7.3477e22, 27.321582);

		this.Bodies[DE405Body.SUN.ordinal].mu = 132712440018.;
		this.Bodies[DE405Body.MERCURY.ordinal].mu = 22032.;
		this.Bodies[DE405Body.VENUS.ordinal].mu = 324859.;
		this.Bodies[DE405Body.EARTH.ordinal].mu = 398600.4418;
		this.Bodies[DE405Body.MARS.ordinal].mu = 42828.;
		this.Bodies[DE405Body.JUPITER.ordinal].mu = 126686534.;
		this.Bodies[DE405Body.SATURN.ordinal].mu = 37931187.;
		this.Bodies[DE405Body.URANUS.ordinal].mu = 5793939.;
		this.Bodies[DE405Body.NEPTUNE.ordinal].mu = 6836529.;
		this.Bodies[DE405Body.PLUTO.ordinal].mu = 871.;
		this.Bodies[DE405Body.MOON.ordinal].mu = 4902.7779;

//		Bodies[body.SUN.ordinal()].color = Color.ORANGE;
//		Bodies[body.EARTH.ordinal()].color = Color.BLUE;
//		Bodies[body.JUPITER.ordinal()].color = Color.MAGENTA;
//		Bodies[body.MOON.ordinal()].color = Color.GRAY;

	}

//	@Override
//	public void setUnits(unitSet u) {
//		// TODO Auto-generated method stub
//
//	}
//
//	@Override
//	public unitSet getUnits() {
//		return uS;
//	}
//
//	@Override
//	public void setUnitsMaster(unitCheck uc) {
//		// TODO Auto-generated method stub
//
//	}
//
//	@Override
//	public void addUnitsUser(unitSet u) {
//		// TODO Auto-generated method stub
//
//	}

//}

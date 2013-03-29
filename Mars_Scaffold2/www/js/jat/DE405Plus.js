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

//package jat.core.ephemeris;
//
//import jat.core.astronomy.SolarSystemBodies;
//import jat.core.ephemeris.DE405Body.body;
////import jat.core.ephemeris.DE405Frame.frame;
////import jat.core.spacetime.ReferenceFrame;
////import jat.core.spacetime.TimeAPL;
////import jat.core.units.unitCheck;
////import jat.core.units.unitModel;
////import jat.core.units.unitSet;
////import jat.core.units.unitSet.distanceUnit;
////import jat.core.units.unitSet.massUnit;
////import jat.core.units.unitSet.timeUnit;
//import jat.core.util.PathUtil;
////import jat.core.util.jatMessages;
//import jat.coreNOSA.math.MatrixVector.data.VectorN;
//import jat.coreNOSA.spacetime.Time;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.EnumSet;
//
////import org.apache.commons.math3.ode.FirstOrderDifferentialEquations;
////import org.apache.commons.math3.ode.sampling.StepHandler;
////import org.apache.commons.math3.ode.sampling.StepInterpolator;

/**
 * The DE405 Ephemeris data files from JPL are given in the ICRF frame. This
 * class allows to choose the frame for which position and velocity are
 * calculated (See DE405Frame.java)
 * 
 */
//public class DE405Plus extends DE405APL /*implements FirstOrderDifferentialEquations, unitModel*/ {
    DE405Plus.prototype = new DE405APL;
//
////	public frame ephFrame;
////	public boolean bodyGravOnOff[] = new boolean[DE405Body.body.amount];
//	public VectorN[] posUserFrame = new VectorN[11];
//	public VectorN[] velUserFrame = new VectorN[11];
//	SolarSystemBodies sb;
////	public TimeAPL integrationStartTime;
//	public ArrayList<Double> time = new ArrayList<Double>();
//	public ArrayList<Double> xsol = new ArrayList<Double>();
//	public ArrayList<Double> ysol = new ArrayList<Double>();
//	public ArrayList<Double> zsol = new ArrayList<Double>();
////	jatMessages messages;
//	public boolean printSteps = false;
//	public boolean printBodyPos = false;
////	unitSet uS = new unitSet("DE405Plus", distanceUnit.km, timeUnit.sec, massUnit.kg);
//	public VectorN EarthMoonPlaneNormal;
//	public VectorN  rotationAxis;
	
//	public DE405Plus() {
//		super();
////		ephFrame = frame.ICRF;
//		sb = new SolarSystemBodies();
//	}

//	public DE405Plus(PathUtil path, jatMessages messages) {
//		this.path = path;
//		DE405_path = path.DE405Path;
//		if (messages != null)
//			messages.addln("[DE405Plus path] " + DE405_path);
//		ephFrame = frame.ICRF;
//		sb = new SolarSystemBodies();
//	}

	/*public*/function DE405Plus(/*PathUtil*/ path) {
		this.path = path;
		this.DE405_path = path.DE405Path;
//		ephFrame = frame.ICRF;
		this.sb = new SolarSystemBodies();

		this.posUserFrame = new Array(11);//VectorN[11];
		this.velUserFrame = new Array(11);//VectorN[11];
	}

//	public void setFrame(frame ephFrame) {
//		this.ephFrame = ephFrame;
//	}

//	/**
//	 * The plane of the moon's orbit around the earth changes over time. Choose
//	 * one for your simulation.
//	 * 
//	 * @param t
//	 *            Time
//	 * @throws IOException
//	 */
//	public void setEarthMoonPlaneNormal(TimeAPL t) throws IOException {
//
//		int MOON = body.MOON.ordinal();
//		int EARTH = body.EARTH.ordinal();
//
//		update_planetary_ephemeris(t);
//
//		VectorN MoonPos = posICRF[MOON].minus(posICRF[EARTH]);
//		VectorN MoonVel = velICRF[MOON].minus(velICRF[EARTH]);
//		MoonPos.unitize();
//		MoonVel.unitize();
//		//MoonPos.print("[DE405Plus pos unit] " + body.name[MOON]);
//		//MoonVel.print("[DE405Plus vel unit] " + body.name[MOON]);
//
//		EarthMoonPlaneNormal=MoonPos.crossProduct(MoonVel);
//		
//		VectorN zAxis=new VectorN(0,0,1);
//		rotationAxis=EarthMoonPlaneNormal.crossProduct(zAxis);
//		//rotationAxis.print("[DE405Plus rotation axis] ");
//	}

//	/**
//	 * See setIntegrationStartTime
//	 * 
//	 * @return User integration start time
//	 */
//	public TimeAPL getIntegrationStartTime() {
//		return integrationStartTime;
//	}

//	/**
//	 * The integrator starts with time 0 for numerical reasons. The user may
//	 * start with the launch date given in any epoch
//	 * 
//	 * @param integrationStartTime
//	 */
//	public void setIntegrationStartTime(TimeAPL integrationStartTime) {
//		this.integrationStartTime = integrationStartTime;
//	}

//	/**
//	 * Clear data for next integration
//	 */
//	public void reset() {
//		time.clear();
//		xsol.clear();
//		ysol.clear();
//		zsol.clear();
//	}

//	public void computeDerivatives(double t, double[] yval, double[] yDot) {
//		double mu_body;
//		double xBody = 0, yBody = 0, zBody = 0; // xyz coords of body i in frame
//		double x, y, z; // x, y, z distance from spacecraft to body i
//		double x2, y2, z2; // squares of distances x, y, z spacecraft to body
//		double r_sc_body, r_sc_body3; // distance from spacecraft to body i
//		VectorN bodyPos;
//		TimeAPL EphTime;
//
//		EphTime = integrationStartTime.plus(t);
//		// integrationStartTime.println();
//		// EphTime.println();
//		yDot[0] = yval[3];
//		yDot[1] = yval[4];
//		yDot[2] = yval[5];
//		yDot[3] = 0;
//		yDot[4] = 0;
//		yDot[5] = 0;
//
//		try {
//
//			for (body b : body.values()) {
//				if (bodyGravOnOff[b.ordinal()])// if (b.ordinal() == 0)
//				{
//					mu_body = sb.Bodies[b.ordinal()].mu;
//					bodyPos = get_planet_pos(b, EphTime);
//					// bodyPos.print("[DE405Plus] position of " + b.ordinal());
//					xBody = bodyPos.x[0];
//					yBody = bodyPos.x[1];
//					zBody = bodyPos.x[2];
//					x = yval[0] - xBody;
//					x2 = x * x;
//					y = yval[1] - yBody;
//					y2 = y * y;
//					z = yval[2] - zBody;
//					z2 = z * z;
//					r_sc_body = Math.sqrt(x2 + y2 + z2);
//					r_sc_body3 = r_sc_body * r_sc_body * r_sc_body;
//					yDot[3] += -mu_body * x / r_sc_body3;
//					yDot[4] += -mu_body * y / r_sc_body3;
//					yDot[5] += -mu_body * z / r_sc_body3;
//					if (printBodyPos) {
//						String nf = "%16.3f ";
//						String format = "%8s " + nf + nf + nf + nf + nf;
//						System.out.printf(format, b.name[b.ordinal()], mu_body, xBody, yBody, zBody, bodyPos.mag());
//						System.out.println();
//					}
//				}
//			}
//
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//
//	}

	/*public int */DE405Plus.prototype.getDimension = function() {
		return 6;
	};

//	public StepHandler stepHandler = new StepHandler() {
//		public void init(double t0, double[] y0, double t) {
//		}
//
//		public void handleStep(StepInterpolator interpolator, boolean isLast) {
//			double t = interpolator.getCurrentTime();
//			double[] y = interpolator.getInterpolatedState();
//			if (printSteps) {
//				String nf = "%14.3f ";
//				String format = nf + nf + nf + nf + nf + nf + nf + nf;
//				System.out.printf(format, t, y[0], y[1], y[2], y[3], y[4], y[5], energy(t, y));
//				System.out.println();
//			}
//			time.add(t);
//			xsol.add(y[0]);
//			ysol.add(y[1]);
//			zsol.add(y[2]);
//		}
//	};

//	public double energy(double t, double[] yval) {
//		double mu_body;
//		double xBody = 0, yBody = 0, zBody = 0; // xyz coords of body i in frame
//		double x, y, z; // x, y, z distance from spacecraft to body i
//		double x2, y2, z2; // squares of distances x, y, z spacecraft to body
//		double vx, vy, vz, v2; // velocities x, y, z of spacecraft, square
//		double r_sc_body; // distance from spacecraft to body i
//		VectorN bodyPos;
//		TimeAPL EphTime;
//		double potential = 0;
//
//		EphTime = integrationStartTime.plus(t);
//		vx = yval[3];
//		vy = yval[4];
//		vz = yval[5];
//		v2 = vx * vx + vy * vy + vz + vz;
//		try {
//			for (body b : body.values()) {
//				if (bodyGravOnOff[b.ordinal()]) {
//					// System.out.println(b.name[b.ordinal()]);
//					mu_body = sb.Bodies[b.ordinal()].mu;
//					bodyPos = get_planet_pos(b, EphTime);
//					// bodyPos.print("pos" + b.ordinal());
//					xBody = bodyPos.x[0];
//					yBody = bodyPos.x[1];
//					zBody = bodyPos.x[2];
//					x = yval[0] - xBody;
//					x2 = x * x;
//					y = yval[1] - yBody;
//					y2 = y * y;
//					z = yval[2] - zBody;
//					z2 = z * z;
//					r_sc_body = Math.sqrt(x2 + y2 + z2);
//					// System.out.println(r_sc_body);
//					potential += -mu_body / r_sc_body;
//					// System.out.println(potential);
//				}
//			}
//
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		return v2 / 2. + potential;
//		// return v2;
//
//	}

	/*public void  */DE405Plus.prototype.update_posvel_and_frame = function(/*Time*/ t, callback) /*throws IOException*/ {

		var ephemeris = this;
		this.update_planetary_ephemeris(t, function() {

			// Default frame is ICRF
			for (var q in DE405Body) {
				var /*int*/ bodyNumber = DE405Body[q].ordinal;
				ephemeris.posUserFrame[bodyNumber] = ephemeris.posICRF[bodyNumber];
				ephemeris.velUserFrame[bodyNumber] = ephemeris.velICRF[bodyNumber];
				// System.out.println("[DE405Plus bodyNumber]" + bodyNumber);
			}

//			// transform pos and vel to desired reference frame
//			switch (ephFrame) {
//			case ICRF:
//				break;
//			case HEE:
//				ReferenceFrame.ICRFtoHEE(this);
//				break;
//			case ECI:
//				ReferenceFrame.ICRFtoECI(this);
//				break;
//			case MEOP:
//				ReferenceFrame.ICRFtoMEOP(this);
//				break;
//			default:
//				// posUserFrame[bodyNumber] = posICRF[bodyNumber];
//				// velUserFrame[bodyNumber] = velICRF[bodyNumber];
//				break;
//			}
			callback();
		});

	};

//	public VectorN get_planet_posvel(body bodyEnum, Time t) throws IOException {
//		update_posvel_and_frame(t);
//
//		VectorN posvel = new VectorN(6);
//
//		posvel.x[0] = posUserFrame[bodyEnum.ordinal()].x[0];
//		posvel.x[1] = posUserFrame[bodyEnum.ordinal()].x[1];
//		posvel.x[2] = posUserFrame[bodyEnum.ordinal()].x[2];
//		posvel.x[3] = velUserFrame[bodyEnum.ordinal()].x[0];
//		posvel.x[4] = velUserFrame[bodyEnum.ordinal()].x[1];
//		posvel.x[5] = velUserFrame[bodyEnum.ordinal()].x[2];
//
//		return posvel;
//	}

	/*public VectorN */DE405Plus.prototype.get_planet_pos = function(/*body*/ bodyEnum, /*Time*/ t, callback) /*throws IOException*/ {

		var ephemeris = this;
		this.update_posvel_and_frame(t, function() {
			callback.ephemerisCallback(ephemeris.posICRF[bodyEnum.ordinal/*()*/]);
		});

	};

	/*public VectorN */DE405Plus.prototype.get_planet_vel = function(/*body*/ bodyEnum, /*Time*/ t, callback) /*throws IOException*/ {

		var ephemeris = this;
		this.update_posvel_and_frame(t, function() {
			callback.ephemerisCallback(ephemeris.velUserFrame[bodyEnum.ordinal/*()*/]);
		});

	};

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

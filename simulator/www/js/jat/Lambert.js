/* JAT: Java Astrodynamics Toolkit
 *
 * Copyright (c) 2002 National Aeronautics and Space Administration. All rights reserved.
 *
 * This file is part of JAT. JAT is free software; you can
 * redistribute it and/or modify it under the terms of the
 * NASA Open Source Agreement
 * 
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * NASA Open Source Agreement for more details.
 *
 * You should have received a copy of the NASA Open Source Agreement
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 */

// 2012: add exception management

//package jat.coreNOSA.cm;
//
////import jat.coreNOSA.algorithm.ScalarFunction;
//import jat.coreNOSA.algorithm.ZeroFinder;
////import jat.coreNOSA.algorithm.integrators.LinePrinter;
//import jat.coreNOSA.math.MatrixVector.data.VectorN;
//
///**
// * <P>
// * The Lambert class provides the means to solve Lambert's problem. Ref: Vallado
// * 
// * @author
// * @version 1.0
// */
//
//public class Lambert /*implements ScalarFunction*/ {
//
//	private double s = 0.0;
//	private double c = 0.0;
//	private double dt = 0.0;
//	private double mu = 0.0;
//	private boolean aflag = false;
//	private boolean bflag = false;
//	public boolean debug_print = false;
//
//	/**
//	 * Contains the computed initial delta-v.
//	 */
//	public VectorN deltav0;
//	/**
//	 * Contains the computed final delta-v.
//	 */
//	public VectorN deltavf;
//
//	/** time of flight */
//	public double tof;

	/*public void */Lambert.prototype.reset = function () {
		this.s = 0.0;
		this.c = 0.0;
		this.aflag = false;
		this.bflag = false;
		this.debug_print = false;
	};

	/**
	 * Constructor with mu
	 * 
	 * @param mu
	 *            mu of the central body
	 */
	function Lambert(/*double*/ mu) {
		this.mu = mu;
	}

	/*private double */Lambert.prototype.getalpha = function(/*double*/ a) {
		var /*double*/ alpha = 2.0 * Math.asin(Math.sqrt(this.s / (2.0 * a)));
		if (this.aflag) {
			alpha = 2.0 * Constants$pi - alpha;
		}
		return alpha;
	};

	/*private double */Lambert.prototype.getbeta = function(/*double*/ a) {
		var /*double*/ beta = 2.0 * Math.asin(Math.sqrt((this.s - this.c) / (2.0 * a)));
		if (this.bflag) {
			beta = -1.0 * beta;
		}
		return beta;
	};

	/*private double */Lambert.prototype.getdt = function(/*double*/ a, /*double*/ alpha, /*double*/ beta) {
		var /*double*/ sa = Math.sin(alpha);
		var /*double*/ sb = Math.sin(beta);
		var /*double*/ dt = Math.pow(a, 1.5) * (alpha - sa - beta + sb) / Math.sqrt(this.mu);
		return dt;
	};

	/**
	 * Evaluate the delta-t function f
	 * 
	 * @param a
	 *            semi-major axis.
	 * @return
	 */
	/*public double */Lambert.prototype.evaluate = function(/*double*/ a) {
		var /*double*/ alpha = this.getalpha(a);
		var /*double*/ beta = this.getbeta(a);
		var /*double*/ out = this.dt - this.getdt(a, alpha, beta);
		return out;
	};

	/**
	 * Computes the delta-v's required to go from r0,v0 to rf,vf.
	 * 
	 * @return Total delta-v (magnitude) required.
	 * @param dt
	 *            Time of flight
	 * @param r0
	 *            Initial position vector.
	 * @param v0
	 *            Initial velocity vector.
	 * @param rf
	 *            Desired final position vector.
	 * @param vf
	 *            Desired final velocity vector.
	 * @throws LambertException
	 */
	/*public double */Lambert.prototype.compute = function(/*VectorN*/ r0, /*VectorN*/ v0, /*VectorN*/ rf, /*VectorN*/ vf, /*double*/ dt) /*throws LambertException*/ {
		this.reset();
		var /*double*/ tp = 0.0;

		this.dt = dt;
		var /*double*/ magr0 = r0.mag();
		var /*double*/ magrf = rf.mag();

		var /*VectorN*/ dr = r0.minus(rf);
		this.c = dr.mag();
		this.s = (magr0 + magrf + this.c) / 2.0;
		var /*double*/ amin = this.s / 2.0;
		if (this.debug_print)
			console.log("amin = " + amin);

		var /*double*/ dtheta = Math.acos(r0.dotProduct(rf) / (magr0 * magrf));

		// dtheta = 2.0 * Constants.pi - dtheta;

		if (this.debug_print)
			console.log("dtheta = " + dtheta);

		if (dtheta < Constants$pi) {
			tp = Math.sqrt(2.0 / (this.mu)) * (Math.pow(this.s, 1.5) - Math.pow(this.s - this.c, 1.5)) / 3.0;
		}
		if (dtheta > Constants$pi) {
			tp = Math.sqrt(2.0 / (this.mu)) * (Math.pow(this.s, 1.5) + Math.pow(this.s - this.c, 1.5)) / 3.0;
			this.bflag = true;
		}

		if (this.debug_print)
			console.log("tp = " + tp);

		var /*double*/ betam = this.getbeta(amin);
		var /*double*/ tm = this.getdt(amin, Constants$pi, betam);

		if (this.debug_print)
			console.log("tm = " + tm);

		if (dtheta == Constants$pi) {
			// console.log(" dtheta = 180.0. Do a Hohmann");
			throw new LambertException("dtheta = 180.0. Do a Hohmann");
			// System.exit(0);
		}

		var /*double*/ ahigh = 1000.0 * amin;
		var /*double*/ npts = 3000.0;
		// this.dt = (2.70-0.89)*86400;
		if (this.debug_print)
			console.log("dt = " + dt);

		if (this.debug_print)
			console.log("************************************************");

		if (this.dt < tp) {
			// System.out.println("No elliptical path possible ");
			throw new LambertException("No elliptical path possible ");
			// System.exit(0);
		}

		if (this.dt > tm) {
			this.aflag = true;
		}

		var /*double*/ fm = this.evaluate(amin);
		var /*double*/ ftemp = this.evaluate(ahigh);

		if ((fm * ftemp) >= 0.0) {
			// System.out.println(" initial guesses do not bound ");
			throw new LambertException(" initial guesses do not bound ");
			// System.exit(0);
		}

		var /*ZeroFinder*/ regfalsi = new ZeroFinder(this, 10000, 1.0E-6, 1.0E-15);

		var /*double*/ sma = regfalsi.regulaFalsi(amin, ahigh);

		var /*double*/ alpha = this.getalpha(sma);
		var /*double*/ beta = this.getbeta(sma);

		var /*double*/ de = alpha - beta;

		var /*double*/ f = 1.0 - (sma / magr0) * (1.0 - Math.cos(de));
		var /*double*/ g = dt - Math.sqrt(sma * sma * sma / this.mu) * (de - Math.sin(de));

		var /*VectorN*/ newv0 = new VectorN({n:3});
		var /*VectorN*/ newvf = new VectorN({n:3});

		newv0.x[0] = (rf.x[0] - f * r0.x[0]) / g;
		newv0.x[1] = (rf.x[1] - f * r0.x[1]) / g;
		newv0.x[2] = (rf.x[2] - f * r0.x[2]) / g;

		this.deltav0 = newv0.minus(v0);
		if (this.debug_print)
			this.deltav0.print("deltav-0");

		var /*double*/ dv0 = this.deltav0.mag();

		var /*double*/ fdot = -1.0 * (Math.sqrt(this.mu * sma) / (magr0 * magrf)) * Math.sin(de);
		var /*double*/ gdot = 1.0 - (sma / magrf) * (1.0 - Math.cos(de));

		newvf.x[0] = fdot * r0.x[0] + gdot * newv0.x[0];
		newvf.x[1] = fdot * r0.x[1] + gdot * newv0.x[1];
		newvf.x[2] = fdot * r0.x[2] + gdot * newv0.x[2];

		this.deltavf = vf.minus(newvf);
		var /*double*/ dvf = this.deltavf.mag();
		if (this.debug_print)
			this.deltavf.print("deltav-f");

		var /*double*/ totaldv = dv0 + dvf;

		this.tof = dt;

		if (this.debug_print)
			console.log("dt = " + dt + " dv0 = " + dv0 + " dvf = " + dvf + " total dv = " + totaldv + " sma = "
					+ sma);
		return totaldv;
	};

//	/**
//	 * Test case.
//	 * 
//	 * @param args
//	 *            arguments (none).
//	 */
//	public static void main(String args[]) {
//		LinePrinter lp = new LinePrinter();
//
//		TwoBody elem0 = new TwoBody(40000.0, 0.2, 0.0, 0.0, 45.0, 0.0);
//		TwoBody elemf = new TwoBody(80000.0, 0.2, 0.0, 0.0, 270.0, 286.0);
//
//		elem0.propagate(0.0, (0.89 * 86400.0), lp, false);
//		elemf.propagate(0.0, (2.70 * 86400.0), lp, false);
//
//		elem0.print("SC1");
//		elemf.print("SC2");
//
//		VectorN r0 = elem0.getR();
//		VectorN v0 = elem0.getV();
//		VectorN rf = elemf.getR();
//		VectorN vf = elemf.getV();
//
//		Lambert lambert = new Lambert(Constants.mu);
//		try {
//			double totaldv = lambert.compute(r0, v0, rf, vf, (2.70 - 0.89) * 86400);
//			System.out.println("Total delta-v: "+totaldv);
//		} catch (LambertException e) {
//			e.printStackTrace();
//		}
//
//	}
//}

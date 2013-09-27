/* JAT: Java Astrodynamics Toolkit
 *
 * Copyright (c) 2005 National Aeronautics and Space Administration. All rights reserved.
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
//package jat.coreNOSA.spacetime;
//
//
////import java.util.Calendar;
//
///**
// * Time implements conversions between various time systems.
// * e.g. TT, TDB...
// *
// * Translated from c by Richard C. Page III
// *
// * @author Richard C. Page III
// *
// * @author Tobias Berthold
// * @since 04-24-2012: Replaced deprecated Date with Calendar
// */
//public class Time {
	function Time(inputParams) {
		if (inputParams.mjd_UTC != null) {
			this.Time_mjd_UTC(inputParams.mjd_UTC);
		} else if ((inputParams.Yr != null) &&
			(inputParams.Mon != null) &&
			(inputParams.D != null) &&
			(inputParams.Hr != null) &&
			(inputParams.Yr != null) &&
			(inputParams.S != null)) {
			this.Time_YrMonDHrMnS(inputParams.Yr, inputParams.Mon, inputParams.D, inputParams.Hr, inputParams.Mn, inputParams.S);
		} else {
			console.log("The correct Time constructor does not exist");
		}
	}
//
//	// private boolean debugGEONS = false;
//	// *** See bottom of this file for the original c code headers for TT2TDB
//
//	/**
//	 * Simulation time in seconds since epoch.
//	 */
//	protected double sim_time = 0; // [s]
//	private double MJD_TT;
////	/**
////	 * Modified Julian Date of Barycentric Dynamical Time.
////	 */
////	private double MJD_TDB;
//	/**
//	 * Modified Julian Date of Universal Coordinated Time.
//	 */
//	private double MJD_UTC;
////	/**
////	 * Modified Julian Date of Universal Time UT1
////	 */
////	private double MJD_UT1;
////	/**
////	 * Modified Julian Date of the simulation epoch in Universal Coordinated
////	 * Time.
////	 */
////	private double MJD_UTC_START;
//
////	/**
////	 * Difference between UT1 and UTC. UT1-UTC [sec] obtained from IERS Bulletin
////	 * A.
////	 * 
////	 * @see jat.coreNOSA.spacetime.FitIERS
////	 */
////	private double UT1_UTC = 0; // UT1-UTC time difference [s]. From IERS
//								// Bulletin A.
//
////	/**
////	 * local International Earth Rotation and Reference Service object to avoid
////	 * multiple instances.
////	 */
////	private FitIERS fit = null;
//
////	/**
////	 * Default constructor initializes to current system time to nearest
////	 * millisecond
////	 */
////	public Time() {
////		//java.util.Date d = new java.util.Date();
////		//CalDate cd = new CalDate(1900 + d.getYear(), 1 + d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(),d.getSeconds());
////		Calendar cal = Calendar.getInstance();
////		CalDate cd = new CalDate(cal.get(Calendar.YEAR), 1 + cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH),cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE),cal.get(Calendar.SECOND));		
////		this.MJD_UTC = cd.mjd();
////		this.MJD_UTC_START = this.MJD_UTC;
////		this.MJD_TT = TimeUtils.UTCtoTT(this.MJD_UTC);
////		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
////	}

	/**
	 * Constructor. Initializes all time values to the simulation epoch.
	 * 
	 * @param mjd_UTC
	 *            Universal Coordinated Time in modified julian date
	 */
	Time.prototype.Time_mjd_UTC = function(/*double*/ mjd_UTC) {
		this.MJD_UTC = mjd_UTC;
//		this.MJD_UTC_START = mjd_UTC;
		this.MJD_TT = TimeUtils$UTCtoTT(mjd_UTC);
//		this.MJD_TDB = TimeUtils.TTtoTDB(this.MJD_TT);
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC / 86400.0;
	};

////	/**
////	 * Constructor. Calculates the simulation epoch time from the given Calendar
////	 * Date.
////	 * 
////	 * @param date
////	 *            Gregorian Calendar Date
////	 */
////	public Time(CalDate date) {
////		this.MJD_UTC = date.mjd();
////		this.MJD_UTC_START = this.MJD_UTC;
////		this.MJD_TT = TimeUtils.UTCtoTT(this.MJD_UTC);
////		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
////	}

	/**
	 * Constructor. Creates a CalDate from the given parameters and then does
	 * Time(CalDate date)
	 * 
	 * @param Yr
	 * @param Mon
	 * @param D
	 * @param Hr
	 * @param Mn
	 * @param S
	 */
	 Time.prototype.Time_YrMonDHrMnS = function(/*int*/ Yr, /*int*/ Mon, /*int*/ D, /*int*/ Hr, /*int*/ Mn, /*double*/ S) {
//		CalDate date = new CalDate(Yr, Mon, D, Hr, Mn, S);
//		this.MJD_UTC = date.mjd();
		this.MJD_UTC = this.mjd(Yr, Mon, D, Hr, Mn, S);
//		this.MJD_UTC_START = this.MJD_UTC;
		this.MJD_TT = TimeUtils$UTCtoTT(this.MJD_UTC);
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
	};

    /** Returns the modified Julian date. From Montenbruck C++ code.
     * @return modified Julian date.
     */
    /*public double */Time.prototype.mjd = function(/*int*/ Yr, /*int*/ Mon, /*int*/ D, /*int*/ Hr, /*int*/ Mn, /*double*/ S){
        var /*long*/    MjdMidnight;
        var /*double*/  FracOfDay;
        var /*int*/     b;
        var /*int*/ year = Yr;
        var /*int*/ month = Mon;
        var /*int*/ day = D;
        var /*int*/ hour = Hr;
        var /*int*/ min = Mn;
        var /*double*/ sec = S;

        // compute the MJD
        if (month<=2) {
            month += 12;
            --year;
        }

        if ( (10000*year+100*month+day) <= 15821004 ){
            b = -2 + ((year+4716)/4) - 1179;     // Julian calendar
        }
        else {
            b = (year/400)-(year/100)+(year/4);  // Gregorian calendar
        }

        var /*int*/ temp = /*(int)*/Math.floor(30.6001*(month+1));

        MjdMidnight = Math.floor(365*year - 679004 + b + temp + day);
        FracOfDay   = (hour+min/60.0+sec/3600.0) / 24.0;

        var /*double*/ mjd = MjdMidnight + FracOfDay;
        return mjd;
    };

	/**
	 * Returns Universal Coordinated Time in modified julian date
	 * 
	 * @return MJD_UTC
	 */
	/*public double */Time.prototype.mjd_utc = function() {
		return this.MJD_UTC;
	}

//	/**
//	 * Returns Terrestrial Dynamical Time in modified julian date
//	 * 
//	 * @return MJD_TT
//	 */
//	public double mjd_tt() {
//		return this.MJD_TT;
//	}

//	/**
//	 * Returns Universal Time in modified julian date
//	 * 
//	 * @return MJD_UT1
//	 */
//	public double mjd_ut1() {
//		// * TODO watch this
//		// if(this.MJD_UT1==this.MJD_UTC || this.UT1_UTC==0){
//		// System.err.println("Warning: UT1-UTC has not been initialized");
//		if (fit == null) {
//			fit = new FitIERS();
//		}
//
//		try {
//			UT1_UTC = fit.search(MJD_UTC)[2];
//		} catch (Exception e) {
//			UT1_UTC = 0;
//		}
//		// }
//		// this.UT1_UTC = 0;
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
//		// if(debugGEONS){
//		// double UTC_UT1_Constant_Bias = -0.11046918435961;
//		// double UTC_UT1_Linear_Coefficient = -0.62804835480612E-03;
//		// double UTC_UT1_Quadratic_Coefficient = 0.31180866068779E-05;
//		// double mjdepoch = 51024;
//		// double dt = this.MJD_UTC - mjdepoch;
//		// this.MJD_UT1 = MJD_UTC + (UTC_UT1_Constant_Bias/86400) +
//		// (UTC_UT1_Linear_Coefficient*dt /(86400*86400))+
//		// UTC_UT1_Quadratic_Coefficient*dt*dt/(86400*86400*86400);
//		// }
//
//		return this.MJD_UT1;
//	}

//	/**
//	 * Returns Barycentric Dynamical Time (TDB) in julian date
//	 * 
//	 * @return MJD_TDB
//	 */
//	public double mjd_tdb() {
//		return TimeUtils.TTtoTDB(this.MJD_TT);
//	}

//	/**
//	 * Returns Universal Coordinated Time in julian date
//	 * 
//	 * @return JD_UTC
//	 */
//	public double jd_utc() {
//		return TimeUtils.MJDtoJD(this.MJD_UTC);
//	}

	/**
	 * Returns Terrestrial Dynamical Time in julian date
	 * 
	 * @return JD_TT
	 */
	/*public double */Time.prototype.jd_tt = function() {
		return TimeUtils$MJDtoJD(this.MJD_TT);
	};

//	/**
//	 * Returns Barycentric Dynamical Time (TDB) in julian date
//	 * 
//	 * @return JD_TDB
//	 */
//	public double jd_tdb() {
//		return TimeUtils.MJDtoJD(this.MJD_TDB);
//	}

//	/**
//	 * Returns Universal Time in julian date
//	 * 
//	 * @return JD_UT1
//	 */
//	public double jd_ut1() {
//		return TimeUtils.MJDtoJD(this.MJD_UT1);
//	}

//	/**
//	 * Returns a count of seconds since the reference epoch.
//	 * 
//	 * @return sim_time [sec]
//	 */
//	public double get_sim_time() {
//		return this.sim_time; // [s]
//	}

//	/**
//	 * Returns the initial epoch in modified julian date universal coordinated
//	 * time
//	 * 
//	 * @return date [modified julian days]
//	 */
//	public double get_epoch_mjd_utc() {
//		return this.MJD_UTC_START;
//	}

//	/**
//	 * Set the difference in seconds between Universal and Universal Coordinated
//	 * Time
//	 * 
//	 * @param d
//	 *            [sec]
//	 */
//	public void set_UT1_UTC(double d) {
//		this.UT1_UTC = d;
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
//	}

//	/**
//	 * Update simulation time since epoch.
//	 * 
//	 * @param t
//	 *            Seconds since epoch.
//	 */
//	public void update(double t) {
//		sim_time = t;
//		this.MJD_UTC = this.MJD_UTC_START + t * TimeUtils.sec2days;
//		this.MJD_TT = TimeUtils.UTCtoTT(this.MJD_UTC);
//		this.MJD_TDB = TimeUtils.TTtoTDB(this.MJD_TT);
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
//	}

//	public void updateTo(double mjd) {
//		sim_time = (mjd - this.MJD_UTC_START) * 86400.0;
//		this.MJD_UTC = mjd;// this.MJD_UTC_START+sim_time*TimeUtils.sec2days;
//		this.MJD_TT = TimeUtils.UTCtoTT(this.MJD_UTC);
//		this.MJD_TDB = TimeUtils.TTtoTDB(this.MJD_TT);
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC / 86400.0;
//	}

//	/**
//	 * Advance the clock by a number of seconds
//	 * 
//	 * @param dt
//	 *            [sec]
//	 */
//	public void step_seconds(double dt) {
//		this.MJD_UTC = this.MJD_UTC + dt * TimeUtils.sec2days;
//		this.MJD_TT = TimeUtils.UTCtoTT(this.MJD_UTC);
//		this.MJD_TDB = TimeUtils.TTtoTDB(this.MJD_TT);
//		this.MJD_UT1 = this.MJD_UTC + this.UT1_UTC * TimeUtils.sec2days;
//	}

//	/**
//	 * Converts the MJD expressed in UTC to give the days since Jan 01 00:00
//	 * 
//	 * @return The number of days since the beginning of the current year.
//	 */
//	public int dayOfYear() {
//		GPSTimeFormat time = new GPSTimeFormat(this.MJD_UTC);
//		CalDate date = time.calDate();
//		return date.doy();
//	}
//
//	/**
//	 * Converts the MJD expressed in UTC to give the seconds since 00:00 UTC
//	 * 
//	 * @return The number of seconds since the beginning of the current day
//	 *         (UTC).
//	 */
//	public double secOfDay() {
//		GPSTimeFormat time = new GPSTimeFormat(this.MJD_UTC);
//		CalDate date = time.calDate();
//		return date.sec_of_day();
//	}

	/**
	 * Create a new Time object by taking the current one and adding s seconds
	 * 
	 * @param s
	 *            number of seconds to add to the current time
	 * @return new Time object that is s seconds later than the current time
	 */
	Time.prototype.plus = function(/*double*/ s) {
		var /*double*/ mjd_utc = this.mjd_utc() + s / 86400.0;
		var /*Time*/ out = new Time({mjd_UTC:mjd_utc});
		return out;
	}

//	/**
//	 * Test.
//	 * 
//	 * @param args
//	 */
//	public static void main(String[] args) {
//	}

//}

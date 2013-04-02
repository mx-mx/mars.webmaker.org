// 		JDCT    Epoch Julian Date, Coordinate Time
//       EC     Eccentricity, e                                                   
//       QR     Periapsis distance, q (AU)                                        
//       IN     Inclination w.r.t xy-plane, i (degrees)                           
//       OM     Longitude of Ascending Node, OMEGA, (degrees)                     
//       W      Argument of Perifocus, w (degrees)                                
//       Tp     Time of periapsis (Julian day number)                             
//       N      Mean motion, n (degrees/day)                                      
//       MA     Mean anomaly, M (degrees)                                         
//       TA     True anomaly, nu (degrees)                                        
//       A      Semi-major axis, a (AU)                                           
//       AD     Apoapsis distance (AU)                                            
//       PR     Sidereal orbit period (day) 

var ephemeris = [
	{
		name: 'Sun',
		texture: './images/solarsystem/sunmap.jpg',
		size: 1392684
	},{
		name: 'Mercury',
		texture: './images/solarsystem/mercurymap.jpg',
		size: 2439.7,
		period: 88.0,
		EC: 0.20563593,
		A: 57909227,
		aphelion: 69817445
	},{
		name: 'Venus',
		texture: './images/solarsystem/venusmap.jpg',
		size: 6051.8,
		period: 224.7,
		EC: 0.00677672,
		A: 108209475,
		aphelion: 108942780
	},{
		name: 'Earth',
		texture: './images/solarsystem/earthmap2.jpg',
		size: 6371.00,
		period: 365.2,
		EC: 0.01671123,
		A: 149598262,
		aphelion: 152098233
	},{
		name: 'Mars',
		texture: './images/solarsystem/marsmap.jpg',
		size: 3389.5,
		period: 687,
		EC: 0.0933941,
		A: 227943824,
		aphelion: 249232432
	},{
		name: 'Jupiter',
		texture: './images/solarsystem/jupitermap.jpg',
		size: 69911,
		period: 4332,
		EC: 0.04838624,
		A: 778340821,
		aphelion: 816001807
	},{
		name: 'Saturn',
		texture: './images/solarsystem/saturnmap.jpg',
		size: 58232,
		period: 10760,
		EC: 0.05386179,
		A: 1426666422,
		aphelion: 1503509229
	},{
		name: 'Uranus',
		texture: './images/solarsystem/uranusmap.jpg',
		size: 25362,
		period: 30700,
		EC: 0.04725744,
		A: 2870658186,
		aphelion: 3006318143
	},{
		name: 'Neptune',
		texture: './images/solarsystem/neptunemap.jpg',
		size: 24622,
		period: 60200,
		EC: 0.00859048,
		A: 4498396441,
		aphelion: 4537039826
	}	
]
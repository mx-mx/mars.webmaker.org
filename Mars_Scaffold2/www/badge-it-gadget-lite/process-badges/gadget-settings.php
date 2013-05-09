<?php

//Badge-It Gadget Lite v0.5.0 - Simple scripted system to award and issue badges into Mozilla Open Badges Infrastructure
//Copyright (c) 2012 Kerri Lemoie, Codery - gocodery.com
//Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

/*** 

This is the settings file for Badge-It Gadget Lite 

Read more about Open Badges Assertions here: https://github.com/mozilla/openbadges/wiki/Assertions 

***/

/* Issuer API url - REQUIRED. This is Open Badge's hosted issuer API. */

$open_badges_api = "http://beta.openbadges.org/issuer.js";

/*version - REQUIRED. Use "0.5.0" for the beta. */

$version = "1.0.0";

/*issuer url - REQUIRED. This is the domain name of the site that will be issuing the badges. It should be the domain where you're installing the OpenBadgifier.*/

$issuer_url = "http://www.mx-mx.com/lab/moku";

/*root path - REQUIRED. CHMOD 775. This is the root path of where your process-badges directory is hosted. You SHOULD password protect this directory with something like .htaccess so that the public can't issue badges on your behalf. */

/*NOTE: your server may require the path to be: $root_path = $_SERVER['DOCUMENT_ROOT']."/badge-it-gadget-lite/process-badges/"; (Notice forward slash before "badge-it-gadget-lite" */

$root_path = $_SERVER['DOCUMENT_ROOT']."/lab/moku/badge-it-gadget-lite/process-badges/";

/* issuer name  - REQUIRED. name of organization or person that is issuing the badges. */

$issuer_name = "Department of Energy"; //This appears on the badge

/*issuer org - OPTIONAL. Organization for which the badge is being issued. Another example is if a scout badge is being issued, the "name" could be "Boy Scouts" and the "org" could be "Troop #218". */

$issuer_org = "";

/* issuer contact - OPTIONAL. A human-monitored email address associated with the issuer. */

$issuer_contact = "";

/* JSON file directory - REQUIRED. CHMOD 777. OpenBadgifier generates JSON file for each issued badge (per person). The JSON files need to be in a publicly accessible but not obvious directory. This should start at the document root of your host. Note that example has slashes at the end of the path. Please be sure to include. */

/*NOTE: your server may require the path to be: $json_dir = $_SERVER['DOCUMENT_ROOT']."/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/"; (Notice forward slash before "badge-it-gadget-lite" */

$json_dir = $_SERVER['DOCUMENT_ROOT']."/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/";

/* url location of json badge storage */

$json_url_dir = "/badge-it-gadget-lite/digital-badges/issued/json/";

/* badge images directory - REQUIRED. Set the path to the directory where your badge images are stored. They should be stored on the same domain as OpenBadifier since the images should be on the issuing site. Don't have badge images yet? You can mae some here (note: they must be PNG) - http://www.onlineiconmaker.com/application/ */

$badge_images_dir = "/badge-it-gadget-lite/digital-badges/images/";

/* badge records file - REQUIRED. CHMOD 777. OpenBadgifier will keep records in a text file of which badges were issued and if they were pushed to the obi. This could easily be extended to use a db later. Nice to have a lightweight solution anyone can use. This file has already been created and is in the directory where this settings file is.*/

$badge_records_file = "badge_records.txt";

/* BADGES!! - this is the array to store badges data. 

info on how to learn about arrays in php: http://devzone.zend.com/8/php-101-part-4-the-food-factor/ 

Here are the values (all REQUIRED unless noted otherwise):

uid = Unique Identifier should be locally unique.
name = The name of your badge. Example "Badge-It Gadget Lite Badgee" (max 128 characters)
image = The filename of the image. Example "badge-it-gadget-lite.png". This image should be in your $badge_images_dir. (Badge must be a .png) 
evidence_url =  Relative URL (In this example we are using the criteria URL as evidence URL... Ideally, a unique page that represents the actual work of the user). 
                It should be on the same server as Badge-It Gadget Lite. If you keep the directory structure as is, you can just change the .html file name in the example.
expires = OPTIONAL. Date when the badge expires. If omitted, the badge never expires. Format: YYYY-MM-DD

Notice there is a number and an array of values for each badge. The example below has five badges.
*/

$badges_array = array(
	1 => array(
	"uid" => "0",
	"name" => "Badge-It Gadget Lite Badge", 
	"image" => "badge-it-gadget-lite.png", 
	"evidence_url" => "http://www.mx-mx.com/lab/moku//badge-it-gadget-lite/digital-badges/badge-it-gadget-lite-badge-evidence.html",
	"badge_class" => "http://www.mx-mx.com/lab/moku//badge-it-gadget-lite/digital-badges/issued/json/badgeClass_badger.json",
	"expires" => "2014-02-02"), 
	2 => array(
	"uid" => "gsb0",
	"name" => "Generic Space Badge", 
	"image" => "badge_generic.png", 
	"evidence_url" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/generic_space.html", 
	"badge_class" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/badgeClass_generic.json",
	"expires" => "2020-01-01"),
	3 => array(
	"uid" => "3dm0",
	"name" => "Solar System Badge", 
	"image" => "moku_badge_solar_system.png", 
	"evidence_url" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/criteria_solar_system.html", 
	"badge_class" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/badgeClass_solar_system.json",
	"expires" => "2020-01-01"),
	4 => array(
	"uid" => "p0",
	"name" => "Mission to Mars Badge", 
	"image" => "moku_badge_mission_to_mars.png", 
	"evidence_url" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/criteria_remote_mission_to_mars.html",
	"badge_class" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/badgeClass_mission_to_mars.json",
	"expires" => "2020-01-01"), 
	5 => array(
	"uid" => "d0",
	"name" => "Remote Pilot Badge", 
	"image" => "moku_badge_remote_pilot.png", 
	"evidence_url" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/criteria_remote_pilot.html",
	"badge_class" => "http://www.mx-mx.com/lab/moku/badge-it-gadget-lite/digital-badges/issued/json/badgeClass_remote_pilot.json",
	"expires" => "2020-01-01")
	);

?>
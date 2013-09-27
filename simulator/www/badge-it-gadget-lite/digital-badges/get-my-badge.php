<?php

//Badge-It Gadget Lite v0.5.0 - Simple scripted system to award and issue badges into Mozilla Open Badges Infrastructure
//Copyright (c) 2012 Kerri Lemoie, Codery - gocodery.com
//Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

/* This script retrieves/issues the badge for the badge earner */

include '../process-badges/gadget-settings.php';

//retrieves the badge info based on the id passed in the get string

$badge = str_rot13($_GET[id]);
preg_match('/\d*/', $badge, $matches);
$badgeId = $matches[0];
preg_match('/\D+/', $badge, $matches);
$recipient_name = preg_replace('/-|_/',' ',$matches[0]);

?>

<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Get My Badge</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Get My Badge">
    <meta name="author" content="">

	<link rel="stylesheet" type="text/css" href="../../css/mars.css" />
	<!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->	
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<script src="<?php print $open_badges_api; ?>"></script>
	
	<script src="../../js/libs/jquery-1.9.1.min.js"></script>
	<script src="../../js/libs/jquery-ui-1.10.1.custom.min.js"></script>

<script>
$(document).ready(function() {
	
	$('.js-required').hide();
	$('.badge-error').hide();
	$('.browserSupport').hide();
	$('#badgeSuccess').hide();
	
		
	
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){  //The Issuer API isn't supported on MSIE Bbrowsers
		$('.backPackLink').hide();
		$('.login-info').hide();
		$('.browserSupport').show();
	}
	
	//Function that issues the badge
	
	var backPackLink = document.getElementById('backPackLink');
    backPackLink.onclick = function() {
       var assertionUrl = "<?php print $issuer_url; ?>/badge-it-gadget-lite/digital-badges/issued/json/<?php print $_GET[id]; ?>.json";
       OpenBadges.issue([''+assertionUrl+''], function(errors, successes) { 
				//	alert(errors.toSource()) 
				//	alert(successes.toSource()) 
					if (errors.length > 0 ) {
						$('#errMsg').text('Error Message: '+ errors.toSource());
						$('#badge-error').show();	
						var data = 'ERROR, <?php echo $badges_array[$badgeId]['name']; ?>, <?php echo $recipient_name; ?>, ' +  errors.toSource();
						$.ajax({
    						url: 'record-issued-badges.php',
    						type: 'POST',
    						data: { data: data }
						});
					}
					
					if (successes.length > 0) {
							$('.backPackLink').hide();
							$('.login-info').hide();
							$('#badgeSuccess').show();
							var data = 'SUCCESS, <?php echo $badges_array[$badgeId]['name']; ?>, <?php echo $recipient_name; ?>';
							$.ajax({
    							url: 'record-issued-badges.php',
    							type: 'POST',
    							data: { data: data }
							});
					}	
			});    
    };
	
	
});

</script>


  </head>

  <body>
	
	<div id="backpackloginpopup" class="modalmask" style="opacity:1.0;pointer-events:auto;">
		<div id="backpacklogindiv" class="badgecontenttarget">
			<div class="js-required">Javascript is required to get your badge. Please enable it in your preferences.</div>
			<h1>Mission To Mars</h1>
			<br>
			Badge Name: <?php echo $badges_array[$badgeId]['name']; ?>
			<br>
			Badge Earner: <?php echo $recipient_name; ?>
			<br>
			<?php echo $badgeDescription; ?>
			<br><br>
			<img src="<?php echo $imageURL; ?>">
			<br><br><br>
			<button id="backPackLink" class="squarebluebutton">Upload Badge to Backpack</button>
			<br><br>
			<div class="badge-error"><p><em>Hmmmm...something went wrong.</em> <span id="errMsg"></span></div>
			<div class="browserSupport">(Please use Firefox or Chrome to retrieve your badge)</div>
			<div id="badgeSuccess"><p><em>Congratulations!</em> If you ever want to manage or view your badges, just visit your <a href="http://beta.openbadges.org/" target="_blank">Open Badges backpack</a></p>
		</div>
	</div>


  </body>
</html>

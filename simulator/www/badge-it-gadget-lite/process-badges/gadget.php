<?php

//Badge-It Gadget Lite v0.5.0 - Simple scripted system to award and issue badges into Mozilla Open Badges Infrastructure
//Copyright (c) 2012 Kerri Lemoie, Codery - gocodery.com
//Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

/*This script creates the badge for the user. and provides the link to get-my-badge.php which interacts with open badges*/

include 'gadget-settings.php';

function rand_string( $length ) { //this function just obscures the users name and badge in the url get string 
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	
	$size = strlen( $chars );
	for( $i = 0; $i < $length; $i++ ) {
		$str .= $chars[ rand( 0, $size - 1 ) ];
	}
	
	return $str;
}


if( isset($_POST) ){
	
	
	//set all variables
	
	$badgeId 				= $_POST['badge_info'];
	$badgeRecipientName 	= $_POST['badge_recipient_name'];
	$badgeRecipientEmail 	= $_POST['badge_recipient_email'];
	$badgeUid 				= $badges_array[$badgeId]['uid'];
	$badgeName 				= $badges_array[$badgeId]['name'];
	$badgeImage				= $badges_array[$badgeId]['image'];
	$badgeEvidence			= $badges_array[$badgeId]['evidence_url'];
	$badgeClass				= $badges_array[$badgeId]['badge_class'];
	$badgeExpires			= $badges_array[$badgeId]['expires'];	
	$date 					= date('Y-m-d');
	$err 					= '';
	$msg 					= '';
	
	
	//salt email	
	$salt = rand_string(8); //randomized everytime
	$hashed_email = hash('sha256', $badgeRecipientEmail  . $salt);
	

	//creates JSON file - will write over an existing badge for same badge and same user.

	$filename = str_rot13($badgeId.'-'. preg_replace("/ /","_",$badgeRecipientName));
	
	$jsonFilePath = $json_dir . $filename .'.json';
	$hardIssuer = 'http://www.voiceovervinnie.com';

	$handle = fopen($jsonFilePath, 'w');
	/*
	$fileData = array(
		'recipient' => "sha256$".$hashed_email,
		'type' => 'email',
		'hashed' => 'true',
		'salt' => $salt,
		'evidence' => $badgeEvidence,
		'issued_on'=> $date,
		'badge' => array(
			'version' => '0.5.0',
			'name' => $badgeName,
			'image' => $issuer_url.$badge_images_dir.$badgeImage,
			'evidence' => $badgeEvidence,
			'expires' => $badgeExpires,
			'issuer' => array(
				'origin' => $hardIssuer,
				'name' => $issuer_name,
				'org' => $issuer_org,
				'contact' => $issuer_contact,
			)
		)
	);*/
	$fileData = array(
		'uid' => $badgeUid,
		'recipient' => array(
			'type' => 'email',
			'hashed' => true,
			'salt' => $salt,
			'identity' => "sha256$".$hashed_email,
		),
		'image' => $issuer_url.$badge_images_dir.$badgeImage,
		'evidence' => $badgeEvidence,
		'issuedOn'=> $date,
		'badge'=> $badgeClass,
		'verify' => array(
			'type' => 'hosted',
			'url' => $issuer_url.$json_url_dir.$filename.'.json',
		)	
	);
	
	//Writes JSON file
	
	if (fwrite($handle, json_encode($fileData)) === FALSE) {
        $err = '<div class="badge-error">Cannot write to file ($jsonFilePath). Please check your \$json_dir in gadget_settings.php</div>';
   }
	else { //Sucess message and write badge to badge_records.txt file
		$msg = '<div class="badge-link-success">Your badge is ready to be issued. Please provide this link to the badge earner: <a href="'.$issuer_url.'/badge-it-gadget-lite/digital-badges/get-my-badge.php?id='.$filename.'">'.$issuer_url.'/badge-it-gadget-lite/digital-badges/get-my-badge.php?id='.$filename.'</a></div>';
		fclose($handle);
		
	//Writes to badge_records.txt file
		
		$badgeRecordsFile = $root_path . $badge_records_file;
	
		$badgeHandle = fopen($badgeRecordsFile, 'a'); 
		$badge_data = "BADGE AWARDED: ".$date.", ".$badgeName.", ".$badgeUid.", ".$jsonFilePath.", ".$badgeRecipientName.", ".$badgeRecipientEmail.", ".$badgeEvidence;
	
		if (! empty($badgeEvidence)) {
			$badge_data .= ", ".$badgeEvidence;
		}
	
		$badge_data .= "\n";
	
		if (fwrite($badgeHandle, $badge_data) === FALSE) {
  		$err .= '<div class="badge-error">Cannot write to file ('.$badgeRecordsFile.'). Please check your $root and $badge_records_file in gadget_settings.php. Your JSON file was created but the badge was not recorded.</div>';
  	}
	
	 	fclose($badgeHandle);
				
	}

		//Set return messages
		
		$returndata = array(
		'posted_form_data' => array(
			'badgeId' => $badgeId,
			'badgeRecipient' => $badgeRecipientName,
			'badgeRecipientEmail' => $badgeRecipientEmail,
			'badgeEvidence' => $badgeEvidence
			),
		'success' => $msg,
		'errors' => $err
	);
	
	//go back to Gadget Badger page with results
	
	if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'){
		
		//set session variables & return success or errors
		session_start();
		$_SESSION['bf_returndata'] = $returndata;
		
		//redirect back to form
		header('location: ' . $_SERVER['HTTP_REFERER']);
	}
	
}
?>
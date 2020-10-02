<?php
function IsInArray($array , $findme_1, $findme_2) {
	foreach ($array as $c) {
		if (strpos(mb_strtolower($c), mb_strtolower($findme_1)) === false) ; else return true; 
		if(strpos(mb_strtolower($c), mb_strtolower($findme_2)) === false) ; else return true; 
	}
	return false;
}

if(isset($_GET['url'])) { 
	$url = $_GET['url']; 
	$site_headers = get_headers($url);
	$findme_1 = "DENY";
	$findme_2 = "SAMEORIGIN";
	if(IsInArray($site_headers, $findme_1, $findme_2)) { echo "true"; } else { echo "false"; }
} else 	{ echo "true"; }
?>


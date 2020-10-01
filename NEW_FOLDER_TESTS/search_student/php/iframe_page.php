<?php
if(isset($_GET['url'])) { 
	$url = $_GET['url']; 
	$domain = file_get_contents($url);
	header('Content-Type: text/html; charset=utf-8');
	header_remove("X-Frame-Options");
	echo $domain;
} else echo '';
?>

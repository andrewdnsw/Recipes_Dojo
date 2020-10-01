<?php
$serp = file_get_contents("php://input"); //contents of POST buffer
$fp = fopen("from_python_web.html","wb") or die("невозможно открыть/создать файл from_python.html");
if(isset($serp) and !empty($serp)) { fwrite($fp, $serp); }
else { fwrite($fp, ''); }
fclose($fp);
echo 'php/from_python_web.html';
?>


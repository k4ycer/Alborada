<?php
error_reporting(1);

include_once('Helpers.php');

global $db;

$user = "root";
$password = "";

try{
  $db = new PDO('mysql:host=localhost:3306;dbname=alborada;charset=utf8', $user, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
  // Success connection

}catch(PDOException $ex){
	// Error connection
	Error::throwError(Error::DB_CONNECTION);
}
?>

<?php 
	ini_set("display_errors","1");
	try{
		$DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
		$resultado= $DBH->prepare('DELETE FROM Usuarios where idUsuario = :x'); 
		$resultado->bindParam(":x", $_REQUEST['id'],PDO::PARAM_STR);
		$resultado->execute(); 
	}
	catch(PDOException $e) {
	   echo $e->getMessage();
	}

?>
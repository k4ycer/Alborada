<?php
	ini_set("display_errors","1");
	try{
		$correo = $_REQUEST["correo"];
		$contrasena = $_REQUEST["contrasena"];
		$nombre = $_REQUEST["nombre"];
		$privilegio = $_REQUEST["privilegio"];

		$DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
		$resultado= $DBH->prepare('INSERT INTO usuarios (correo, contrasena, nombre, privilegio) VALUES (:a ,:b, :c, :d)'); 
		$resultado->bindParam(":a", $correo, PDO::PARAM_STR);
		$resultado->bindParam(":b", sha1($contrasena), PDO::PARAM_STR);
		$resultado->bindParam(":c", $nombre, PDO::PARAM_STR);
		$resultado->bindParam(":d", $privilegio, PDO::PARAM_STR);

		$resultado->execute();

		print_r($resultado->errorInfo());
	}
	catch(PDOException $e) {
	   echo $e->getMessage();
	}
	$DBH=null;
?>
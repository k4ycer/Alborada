<?php
	
	ini_set("display_errors","1");
	try{
		$usuarioBase = $_REQUEST["user"];
		$contrasenaBase = $_REQUEST["password"];
		$DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
		$resultado= $DBH->prepare('SELECT idUsuario, nombre, contrasena FROM usuarios WHERE nombre= :a AND contrasena= :b'); 
		$resultado->bindParam(":a", $usuarioBase, PDO::PARAM_STR);
		$contraSha = sha1($contrasenaBase);
		$resultado->bindParam(":b", $contraSha, PDO::PARAM_STR);
		$resultado->execute();

		while($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
			$user = $row["nombre"];
			$pass = $row["contrasena"];
			$idUsuario = $row["idUsuario"];
		}

		if ($user != "" && $pass != "") {
			session_start();
			$_SESSION['idUsuario'] = $idUsuario;
			$_SESSION['usuario'] = $usuarioBase;
			$_SESSION['contrasena'] = $contrasenaBase;
			echo "correcto";
		}
	}
	catch(PDOException $e) {
	   echo $e->getMessage();
	}
	$DBH=null;
?>
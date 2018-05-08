<?php
	try{
		$DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
		$resultado= $DBH->prepare('SELECT * FROM usuarios'); 
		$resultado->execute();
		$datos = [];
		while($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
			$datos[] = $row;
		}

		$resultadosJson = json_encode($datos);
		echo $resultadosJson;
	}
	catch(PDOException $e) {
	   echo $e->getMessage();
	}
	$DBH=null;
?>
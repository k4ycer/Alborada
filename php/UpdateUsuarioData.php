<?php
    error_reporting(0);
	// Libreria para abrir excel
    require_once("PHPExcel/Classes/PHPExcel/IOFactory.php");
    $DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
	$nombreArchivo = $_FILES["archivo"]["tmp_name"];
	$objPHPExcel = PHPExcel_IOFactory::load($nombreArchivo);
	//Asigno la hoja de calculo activa
	$objPHPExcel->setActiveSheetIndex(0);
	//Obtengo el numero de filas del archivo
	$numRows = $objPHPExcel->setActiveSheetIndex(0)->getHighestRow();
	for ($i = 2; $i <= $numRows; $i++) {
		$usuario = array(
			'correo' => $objPHPExcel->getActiveSheet()->getCell('A'.$i)->getCalculatedValue(),
			'contrasena' => $objPHPExcel->getActiveSheet()->getCell('B'.$i)->getCalculatedValue(),
			'nombre' => $objPHPExcel->getActiveSheet()->getCell('C'.$i)->getCalculatedValue(),
			'privilegio' => $objPHPExcel->getActiveSheet()->getCell('D'.$i)->getCalculatedValue()
		);

        $resultado= $DBH->prepare('INSERT INTO usuarios (correo, contrasena, nombre, privilegio) VALUES (:a ,:b, :c, :d)'); 
        $resultado->bindParam(":a", $usuario["correo"], PDO::PARAM_STR);
        $resultado->bindParam(":b", sha1($usuario["contrasena"]), PDO::PARAM_STR);
        $resultado->bindParam(":c", $usuario["nombre"], PDO::PARAM_STR);
        $resultado->bindParam(":d", $usuario["privilegio"], PDO::PARAM_STR);
        try{
			// Execute query
			$resultado->execute();
		} catch (Exception $ex){
			
        }
	}
	echo "Exito";
?>
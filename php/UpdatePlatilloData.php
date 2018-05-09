<?php
	// Libreria para abrir excel
 	require_once("PHPExcel/Classes/PHPExcel/IOFactory.php");
 	// Conexion a la base 
	require_once('DBConnection.php');
	global $db;
	$nombreArchivo = $_FILES["archivo"]["tmp_name"];
	$objPHPExcel = PHPExcel_IOFactory::load($nombreArchivo);
	//Asigno la hoja de calculo activa
	$objPHPExcel->setActiveSheetIndex(0);
	//Obtengo el numero de filas del archivo
	$numRows = $objPHPExcel->setActiveSheetIndex(0)->getHighestRow();
	for ($i = 2; $i <= $numRows; $i++) {
		$platillo = array(
			'nombre' => $objPHPExcel->getActiveSheet()->getCell('A'.$i)->getCalculatedValue(),
			'descripcion' => $objPHPExcel->getActiveSheet()->getCell('B'.$i)->getCalculatedValue(),
			'precio' => $objPHPExcel->getActiveSheet()->getCell('C'.$i)->getCalculatedValue(),
			'ingredientes' => $objPHPExcel->getActiveSheet()->getCell('D'.$i)->getCalculatedValue(),
			'existencia' => $objPHPExcel->getActiveSheet()->getCell('E'.$i)->getCalculatedValue(),
			'imagen' => "php/uploads/images/noimage.jpeg"
		);

		$sql = "CALL insertPlatillo(:nombre,:descripcion,:imagen,:precio,:ingredientes,:existencia)";
		$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		try{
			// Execute query
			$statement->execute(array("nombre"=>$platillo["nombre"], "descripcion"=>$platillo["descripcion"], "imagen"=>$platillo["imagen"], "precio"=>$platillo["precio"], "ingredientes"=>$platillo["ingredientes"], "existencia"=>$platillo["existencia"]));
			$platillos = array();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
		} catch (Exception $ex){
			
		}
	}
	echo "Exito";
?>
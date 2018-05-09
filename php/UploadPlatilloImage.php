<?php
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Origin: *");
error_reporting(0);
require_once('Helpers.php');
	
	$uploads_dir = 'uploads/images/platillos';
	$image_dir = 'php/uploads/images/platillos';

	$object = new stdClass();
	if(!isset($_FILES['imagen'])){
		ErrorManager::throwError(ErrorManager::IMAGEN_FALTANTE);
	}else{
		$tmp_name = $_FILES['imagen']['tmp_name'];
		$fileName = time() . $_FILES['imagen']['name'];
	    if(move_uploaded_file($tmp_name, "$uploads_dir/$fileName")){
	    	$object->imagen = "$image_dir/$fileName";
	    	echo json_encode($object, JSON_UNESCAPED_UNICODE);
	    }else{
	    	ErrorManager::throwError(ErrorManager::IMAGEN_ERROR);
	    }
	}
?>
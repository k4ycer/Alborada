<?php
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Origin: *");
require_once('DBConnection.php');

class PlatillosModule {
	// Method for request
	const METHOD = DataManager::METHOD_INPUT;

	// ############################################### PLATILLOS ###############################################
	
	/**
	 * Get information of the platillos
	 * @param  boolean $die if true method dies request if not return query
	 * @return object       {platillos:""}
	 */
	public static function get($die = false){
		global $db;
		// Prapare dataManager
		$inputFields = array();
		$validateFields = array();
		$requestMethod = PlatillosModule::METHOD;
		$dataManager = new DataManager($inputFields, $validateFields, $requestMethod);
		// Get platillos
		$sql = "SELECT * FROM platillos;";
		$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		try{
			// Execute query
			$statement->execute(array());
			$platillos = array();
			while($result = $statement->fetch(PDO::FETCH_ASSOC)){
				array_push($platillos, $result);
			}
			// Add result to output
			$dataManager->addOutput("platillos", $platillos);
		} catch (Exception $ex){
			// Get sqlstate message
			$errorInfo = ErrorManager::getError($statement->errorInfo()[2]);
			// Throw error
			ErrorManager::throwError($errorInfo);
		}

		// Send data
		if ($die) 
			$dataManager->sendOutput();
		else
			return $dataManager->output;
	}

	/**
	 * Insert platillo
	 * @param  boolean $die if true method dies request if not return query
	 * @return object       {id:""}
	 */
	public static function insertPlatillo($die = false){
		global $db;
		// Prapare dataManager
		$inputFields = array("nombre", "descripcion", "imagen", "precio", "ingredientes", "existencia");
		$validateFields = array("nombre" => DataManager::TYPE_STRING, "nombre" => DataManager::TYPE_STRING, "imagen" => DataManager::TYPE_STRING, "precio" => DataManager::TYPE_NUMBER, "ingredientes" => DataManager::TYPE_STRING, "existencia" => DataManager::TYPE_NUMBER);
		$requestMethod = PlatillosModule::METHOD;
		$dataManager = new DataManager($inputFields, $validateFields, $requestMethod);
		// Obtain input
		$dataManager->getInput();

		$sql = "CALL insertPlatillo(:nombre,:descripcion,:imagen,:precio,:ingredientes,:existencia)";
		$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		try{
			// Execute query
			$statement->execute(array("nombre"=>$dataManager->input->nombre, "descripcion"=>$dataManager->input->descripcion, "imagen"=>$dataManager->input->imagen, "precio"=>$dataManager->input->precio, "ingredientes"=>$dataManager->input->ingredientes, "existencia"=>$dataManager->input->existencia));
			
			$sql = "SELECT LAST_INSERT_ID() AS ID";
			$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$statement->execute(array());
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			// Add result to output
			$dataManager->addOutput("id", $result["ID"]);

		} catch (Exception $ex){
			var_dump($ex);
			// Get sqlstate message
			$errorInfo = ErrorManager::getError($statement->errorInfo()[2]);

			// Throw error
			ErrorManager::throwError($errorInfo);
		}

		// Send data
		if ($die) 
			$dataManager->sendOutput();
		else
			return $dataManager->output;
	}

	/**
	 * Delete platillo
	 * @param  boolean $die if true method dies request if not return query
	 * @return object       {status:""}
	 */
	public static function deletePlatillo($die = false){
		global $db;
		// Prapare dataManager
		$inputFields = array("idPlatillo");
		$validateFields = array("idPlatillo" => DataManager::TYPE_NUMBER);
		$requestMethod = PlatillosModule::METHOD;
		$dataManager = new DataManager($inputFields, $validateFields, $requestMethod);

		// Obtain input
		$dataManager->getInput();

		$sql = "CALL deletePlatillo(:idPlatillo)";
		$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		try{
			// Execute query
			$statement->execute(array(":idPlatillo"=>$dataManager->input->idPlatillo));
			
			$sql = "SELECT LAST_INSERT_ID() AS ID";
			$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$statement->execute(array());
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			// Add result to output
			$dataManager->addOutput("status", 1);
		} catch (Exception $ex){
			// Get sqlstate message
			$errorInfo = ErrorManager::getError($statement->errorInfo()[2]);
			$errorInfo['status'] = 0;
			// Throw error
			ErrorManager::throwError($errorInfo);
		}

		// Send data
		if ($die) 
			$dataManager->sendOutput();
		else
			return $dataManager->output;
	}

	/**
	 * Update platillo
	 * @param  boolean $die if true method dies request if not return query
	 * @return object       {status:""}
	 */
	public static function updatePlatillo($die = false){
		global $db;
		// Prapare dataManager
		$inputFields = array("idPlatillo", "nombre", "descripcion", "imagen", "precio", "ingredientes", "existencia");
		$validateFields = array("idPlatillo" => DataManager::TYPE_NUMBER, "nombre" => DataManager::TYPE_STRING, "nombre" => DataManager::TYPE_STRING, "imagen" => DataManager::TYPE_STRING, "precio" => DataManager::TYPE_NUMBER, "ingredientes" => DataManager::TYPE_STRING, "existencia" => DataManager::TYPE_NUMBER);
		$requestMethod = PlatillosModule::METHOD;
		$dataManager = new DataManager($inputFields, $validateFields, $requestMethod);
		// Obtain input
		$dataManager->getInput();

		$sql = "CALL updatePlatillo(:idPlatillo,:nombre,:descripcion,:imagen,:precio,:ingredientes,:existencia)";
		$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		try{
			// Execute query
			$statement->execute(array("idPlatillo"=>$dataManager->input->idPlatillo,"nombre"=>$dataManager->input->nombre, "descripcion"=>$dataManager->input->descripcion, "imagen"=>$dataManager->input->imagen, "precio"=>$dataManager->input->precio, "ingredientes"=>$dataManager->input->ingredientes, "existencia"=>$dataManager->input->existencia));
			
			$sql = "SELECT LAST_INSERT_ID() AS ID";
			$statement = $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$statement->execute(array());
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			// Add result to output
			$dataManager->addOutput("status", 1);
		} catch (Exception $ex){
			// Get sqlstate message
			$errorInfo = ErrorManager::getError($statement->errorInfo()[2]);
			$errorInfo['status'] = 0;
			// Throw error
			ErrorManager::throwError($errorInfo);
		}

		// Send data
		if ($die) 
			$dataManager->sendOutput();
		else
			return $dataManager->output;
	}

	/**
	 * Manages request from clients
	 */
	public static function manageRequest(){
		// Prapare dataManager
		$inputFields = array("action");
		$validateFields = array();
		$requestMethod = DataManager::METHOD_GET;
		$dataManager = new DataManager($inputFields, $validateFields, $requestMethod);

		// Obtain input
		$dataManager->getInput();

		switch ($dataManager->input->action) {
			case 'get':
				PlatillosModule::get(true);
				break;
			case 'insertPlatillo':
				PlatillosModule::insertPlatillo(true);
				break;
			case 'deletePlatillo':
				PlatillosModule::deletePlatillo(true);
				break;
			case 'updatePlatillo':
				PlatillosModule::updatePlatillo(true);
				break;
			default:
				ErrorManager::throwError(ErrorManager::NO_INFO);
			break;
		}
	}
}

PlatillosModule::manageRequest();
?>
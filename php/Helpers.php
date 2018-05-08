<?php
	/**
	 * ################################### Error handler class ###################################
	 */
	class ErrorManager {
		/*
			Errors
			1 - 9 -> Requests
			
		*/
		const CUSTOM_ERROR = 0;
		const DB_CONNECTION = array('code' => 1, 'message' => "No se puede conectar a la base de datos.");
		const NO_ERROR = array('code' => 2, 'message' => "No se puede realizar la operación, intentalo más tarde.");
		const NO_INFO = array('code' => 3, 'message' => "No se obtuvo información para procesar.");
	    const WRONG_INFO = array('code' => 6, 'message' => "La información proporcionada no es correcta.");
	    const WRONG_TABLE = array('code' => 7, 'message' => "La tabla seleccionada es incorrecta.");

	    const NO_EXISTE_PLATILLO = array('code' => 11, 'message' => "No se encuentra el platillo proporcionado.");
	    const IMAGEN_FALTANTE = array('code' => 12, 'message' => "No se proporciono imagen de platillo.");
	    const IMAGEN_ERROR = array('code' => 13, 'message' => "Ocurrio un error al subir la imagen.");


		const ERROR_MAP = array(
			ErrorManager::DB_CONNECTION,
			ErrorManager::NO_ERROR,
			ErrorManager::NO_INFO,
			ErrorManager::WRONG_INFO,
			ErrorManager::WRONG_TABLE,
			ErrorManager::NO_EXISTE_PLATILLO,
			ErrorManager::IMAGEN_FALTANTE,
			ErrorManager::IMAGEN_ERROR
		);

		/**
		 * Get the error from a code, if it is not it in the errormap it throws the default error NO_ERROR, 
		 * with a debugmessage of the code
		 * @param  int $code Number for identify the error that occurs
		 * @return {'code':string, 'message':string}       Error object with the corresponding error code
		 */
		public static function getError($code){
			if(!isset($code))
				return ErrorManager::NO_ERROR;	
			foreach (ErrorManager::ERROR_MAP as $key => $value) {
				if($value['code'] == $code)
					return $value;
			}
			$value = ErrorManager::NO_ERROR;
			$value['debugMessage'] = $code;
			return $value;
		}

	    /**
	     * Exit request and prints error with ErrorCode and Message
	     * @param  const ERROR $error array with error information
	     */
	    public static function throwError($error){
	    	$errorInfo = array();
	    	foreach ($error as $key => $value) {
				if($key != 'code' && $key != 'message' && $key != 'debugMessage')
					$errorInfo[$key] = $value;
			}
			$errorInfo['ErrorCode'] = $error['code'];
			$errorInfo['Message'] = $error['message'];
			$errorInfo['DebugMessage'] = $error['debugMessage'];
			die(json_encode($errorInfo, JSON_UNESCAPED_UNICODE));
		}

		/**
		 * Exit request and prints custom error with ErrorCode 0 and custom message
		 * @param  string $errorMessage Error description for displaying to the user
		 * @param  object $error        Aditionale information for throwing the error
		 * @return null               Prints error in json and die
		 */
		public static function throwCustomError($errorMessage, $error){
			$error['ErrorCode'] = ERRORManager::CUSTOM_ERROR;
			$error['Message'] = $errorMessage;
			die(json_encode($error, JSON_UNESCAPED_UNICODE));
		}
	};

	/**
	 * ################################### Data manager class ###################################
	 */
	class DataManager {
		// Config constants
		const METHOD_GET = 1;
		const METHOD_REQUEST = 2;
		const METHOD_POST = 3;
		const METHOD_INPUT = 4;

		const TYPE_NUMBER = "number";
		const TYPE_DATE = "date";
		const TYPE_STRING = "string";
		const TYPE_OBJECT = "object";
		const TYPE_ARRAY = "array";

		// Saves output data
		public $output;
		// Saves input data
		public $input;
		// Saves keys for the inputs to receive
		public $inputFields;
		// Saves must receive inputs and types
		public $validateFields;
		// Saves request method
		public $requestMethod;

		/**
		 * Initialize class
		 * @param array $inputFields    string array with input names
		 * @param array $validateFields string array with input names => types to validate
		 * @param method $requestMethod    method for validation
		 */
		function __construct($inputFields, $validateFields, $requestMethod){
			$this->inputFields = $inputFields;
			$this->validateFields = $validateFields;
			$this->requestMethod = $requestMethod;
			$this->output = new stdClass();
			$this->input = new stdClass();
		}

		/**
		 * Get input depending on the method 
		 */
		function getInput(){
			switch ($this->requestMethod) {
				case DataManager::METHOD_GET:
					foreach ($this->inputFields as $key) {
						$value = $_GET[$key];
						$this->validateInput($key, $value);
						$this->input->{$key} = $value;
					}
				break;
				case DataManager::METHOD_REQUEST:
					foreach ($this->inputFields as $key) {
						$value = $_REQUEST[$key];
						$this->validateInput($key, $value);
						$this->input->{$key} = $value;
					}
				break;
				case DataManager::METHOD_POST:
					foreach ($this->inputFields as $key) {
						$value = $_POST[$key];
						$this->validateInput($key, $value);
						$this->input->{$key} = $value;
					}
				break;
				case DataManager::METHOD_INPUT:
					$inputData = file_get_contents("php://input");
					$request = (array)json_decode($inputData);
					foreach ($this->inputFields as $key) {
						$value = $request[$key];
						$this->validateInput($key, $value);
						$this->input->{$key} = $value;
					}
				break;
			}

			foreach ($validateFields as $key => $value) {
				if(!array_key_exists($key, $this->input)){
					throwCustomError("Falta información para procesar la solicitud", array("Variable" => $key, "Type" => $value));
				}
			}
		}

		/**
		 * Validate input with specified type, if not throws custom error
		 * @param  string $key   key for the input
		 * @param  string $value value of the input
		 * @return bool        if it is valid or not
		 */
		function validateInput($key, $value){
			if(array_key_exists($key, $this->validateFields)){
				$type = $this->validateFields[$key];
				switch ($type) {
					case DataManager::TYPE_NUMBER:
						if(is_numeric($value))
							return true;
						else
							ErrorManager::throwCustomError("Error validando input", array('Variable' => $key, 'Value' => $value, 'Type' => $type));
					break;

					case DataManager::TYPE_DATE:
						if($this->is_date($value))
							return true;
						else
							ErrorManager::throwCustomError("Error validando input", array('Variable' => $key, 'Value' => $value, 'Type' => $type));
					break;

					case DataManager::TYPE_STRING:
						if(is_string($value) && $value != "")
							return true;
						else
							ErrorManager::throwCustomError("Error validando input", array('Variable' => $key, 'Value' => $value, 'Type' => $type));
					break;

					case DataManager::TYPE_OBJECT:
						if(is_object($value))
							return true;
						else
							ErrorManager::throwCustomError("Error validando input", array('Variable' => $key, 'Value' => $value, 'Type' => $type));
					break;

					case DataManager::TYPE_ARRAY:
						if(is_array($value))
							return true;
						else
							ErrorManager::throwCustomError("Error validando input", array('Variable' => $key, 'Value' => $value, 'Type' => $type));
					break;
				}
			}else{
				return true;
			}
		}

		/**
		 * Validate date
		 * @param  string  $date   date to validate
		 * @param  string  $format format to validate
		 * @return boolean         if it is a valid date
		 */
		function is_date($date, $format = 'Y-m-d') {
	    $d = DateTime::createFromFormat($format, $date);
	    return $d && $d->format($format) == $date;
		}

		/**
		 * Adds data to output
		 * @param string $key   key for the data
		 * @param data $value value for the data
		 */
		function addOutput($key, $value){
			$this->output->{$key} =  $value;
		}

		/**
		 * Prints output as json and die
		 */
		function sendOutput(){
			die(json_encode($this->output, JSON_UNESCAPED_UNICODE));
		}
	}
?>
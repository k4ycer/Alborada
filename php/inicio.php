<?php 
	session_start();
	if((strcmp($_SESSION['usuario'], "") != "0") && (strcmp($_SESSION['contrasena'], "") != "0")){
		echo "1";
	}else{
		echo "0";
	}
?>
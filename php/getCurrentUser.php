<?php
session_start();

$res = array();

if(isset($_SESSION['idUsuario'])){
    $idUsuario = $_SESSION['idUsuario'];
    $res['status'] = 1;
    $res['userId'] = $idUsuario;
}else{
    $res['status'] = 0;
    $res['reason'] = "No se ha iniciado sesion";
}

echo json_encode($res);

?>
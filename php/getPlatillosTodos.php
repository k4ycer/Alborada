<?php

$res = array();

try{
    $DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
    $resultado= $DBH->prepare('SELECT * FROM platillos'); 
    $resultado->execute();

    $platillos = array();
    while($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
        $platillo = array(
            'idPlatillo' => $row['idPlatillo'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'imagen' => $row['imagen'],
            'precio' => $row['precio'],
            'ingredientes' => $row['ingredientes'],
            'existencia' => $row['existencia']
        );
        $platillos[] = $platillo;
    }

    $res['status'] = 1;
    $res['platillos'] = $platillos;

    echo json_encode($res);
}
catch(PDOException $e) {
   echo $e->getMessage();
}
$DBH=null;

?>
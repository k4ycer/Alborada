<?php

$idUsuario = $_GET['userId'];
$orderStatus = $_GET['orderStatus'];

$res = array();

try{
    $DBH = new PDO("mysql:host=localhost;dbname=alborada", "root", ""); 
    $resultado= $DBH->prepare('SELECT * FROM ticket WHERE fkUsuario = :a AND status = :b'); 
    $resultado->bindParam(":a", $idUsuario, PDO::PARAM_INT);
    $resultado->bindParam(":b", $orderStatus, PDO::PARAM_STR);
    $resultado->execute();

    $tickets = array();
    while($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
        $ticket = array('idTicket' => $row['idTicket']);
        $tickets[] = $ticket;
    }

    $res['status'] = 1;
    $res['tickets'] = $tickets;

    echo json_encode($res);
}
catch(PDOException $e) {
   echo $e->getMessage();
}
$DBH=null;

?>
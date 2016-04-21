<?php

$conn = mysqli_connect("fdb4.biz.nf","1568544_a544","1111aaaa","1568544_a544");
if(!$conn){ echo 'Server error. Please try again sometime.';}
else{
  $worldstate = array();
  //$worldstate = array('x1' => [posx, posy, move])
  $result = mysqli_query($conn, "SELECT imgid, posx, posy, move FROM TTT ");
  while ($row = mysqli_fetch_row($result)){
    //echo $row;
    $info = array($row[1], $row[2], $row[3]);
    $worldstate[$row[0]] = $info;
  }
  echo json_encode($worldstate);
}  
  // disconnect from server
//mysqli_close($conn);

?>

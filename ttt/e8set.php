<?php
$imgstart = $_GET["imgstart"];
$imgstop = $_GET["imgstop"];
$posx = $_GET["posx"];
$posy = $_GET["posy"];



$conn = mysqli_connect("fdb4.biz.nf","1568544_a544","1111aaaa","1568544_a544");
if(!$conn){ echo 'Server error. Please try again sometime.';}

else if($imgstart != ""){
	mysqli_query($conn,"UPDATE TTT SET move = '0' WHERE imgid='$imgstart'");
}

else if($imgstop != ""){
	mysqli_query($conn,"UPDATE TTT SET move = '1', posx = '$posx', posy = '$posy' WHERE imgid='$imgstop'");
}



?>
<?php
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "businessdb";

$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if ($conn) {
    echo "You are connected!";
} else {
    echo "Not connected!";
    exit; 
}
$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

$jmeno = $_POST['jmeno'];
$telefon = $_POST['telefon'];
$adresa = $_POST['adresa'];
$mesto = $_POST['mesto'];
$psc = $_POST['psc'];
$platebni_metoda = $_POST['platebni_metoda'];

$stmt = $mysqli->prepare("INSERT INTO objednavky (jmeno, telefon, adresa, mesto, psc, platebni_metoda) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $jmeno, $telefon, $adresa, $mesto, $psc, $platebni_metoda);


if ($stmt->execute()) {
    echo "Objednávka byla úspìšnì uložena!";
} else {
    echo "Chyba pøi ukládání: " . $stmt->error;
}
header("Location: Index.php");
exit;
?>


<?php
$host = 'localhost';
$dbname = 'ultimate_shop';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Setting default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Note: Don't echo detailed error in production, but good for local XAMPP debug
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}
?>

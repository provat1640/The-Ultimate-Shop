<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

echo json_encode([
    "id" => $_SESSION['user_id'], 
    "username" => $_SESSION['username'], 
    "role" => $_SESSION['role']
]);
?>

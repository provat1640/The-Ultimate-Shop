<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];

echo json_encode(["message" => "Login successful", "role" => $user['role']]);
?>

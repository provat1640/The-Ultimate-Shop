<?php
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

$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
    $stmt->execute([$username, $hash]);
    echo json_encode(["message" => "Registration successful!"]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(["error" => "Username might already exist."]);
}
?>

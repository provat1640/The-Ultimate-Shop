<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'] ?? null;
$items = json_encode($input['items'] ?? []);
$total = $input['total'] ?? 0;
$paymentMethod = $input['paymentMethod'] ?? 'cod';

try {
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, items_json, total_amount, payment_method) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $items, $total, $paymentMethod]);
    echo json_encode(["message" => "Order placed successfully!", "orderId" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Checkout failed internally."]);
}
?>

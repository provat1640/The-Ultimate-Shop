<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle JSON input
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    // Check if new arrivals requested
    if (isset($_GET['new_arrivals']) && $_GET['new_arrivals'] == '1') {
        $stmt = $pdo->query("SELECT * FROM products WHERE is_new_arrival = 1");
    } else {
        $stmt = $pdo->query("SELECT * FROM products");
    }
    echo json_encode($stmt->fetchAll());
    exit;
}

// Ensure Admin privilege for operations
function checkAdmin() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Admin required"]);
        exit;
    }
}

if ($method === 'POST') {
    checkAdmin();
    $name = $input['name'];
    $price = $input['price'];
    $image = $input['image'];
    $is_new = isset($input['is_new_arrival']) && $input['is_new_arrival'] ? 1 : 0;
    
    $stmt = $pdo->prepare("INSERT INTO products (name, price, image, is_new_arrival) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $price, $image, $is_new])) {
        echo json_encode(["id" => $pdo->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to add"]);
    }
} elseif ($method === 'PUT') {
    checkAdmin();
    $id = $_GET['id'];
    $name = $input['name'];
    $price = $input['price'];
    $image = $input['image'];
    $is_new = isset($input['is_new_arrival']) && $input['is_new_arrival'] ? 1 : 0;
    
    $stmt = $pdo->prepare("UPDATE products SET name=?, price=?, image=?, is_new_arrival=? WHERE id=?");
    if ($stmt->execute([$name, $price, $image, $is_new, $id])) {
        echo json_encode(["message" => "Updated"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update"]);
    }
} elseif ($method === 'DELETE') {
    checkAdmin();
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM products WHERE id=?");
    if ($stmt->execute([$id])) {
        echo json_encode(["message" => "Deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete"]);
    }
}
?>

-- Run this SQL in your phpMyAdmin SQL tab to setup your Database!

CREATE DATABASE IF NOT EXISTS ultimate_shop;
USE ultimate_shop;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    is_new_arrival TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    items_json TEXT NOT NULL,
    total_amount INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin Account (password is 'admin123' using bcrypt)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2y$10$Rz/6h//Uo/GOKT93L/uSBeR/M0gG0uW.i1zS3J5W.F2Tq3F1jH.o2', 'admin');

-- Default Products
INSERT INTO products (name, price, image, is_new_arrival) VALUES 
('Coffee Quartz', 800, 'images/polo_1.jpeg', 1),
('Green Polo', 800, 'images/polo_2.jpeg', 0),
('Anthra Melange', 1000, 'images/polo_3.jpeg', 1),
('Hallmark', 1000, 'images/polo_4.jpeg', 0),
('Magnificent', 1000, 'images/polo_5.jpeg', 1);

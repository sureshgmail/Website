<?php
// SIMPLE DEBUG VERSION - Just echo back form data
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Sanitize function
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Get form data
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$organization = isset($_POST['organization']) ? sanitize($_POST['organization']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';

// Basic validation
$errors = [];

if (empty($name)) {
    $errors['name'] = "Name is required.";
} elseif (strlen($name) < 2) {
    $errors['name'] = "Name must be at least 2 characters.";
}

if (empty($email)) {
    $errors['email'] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "Invalid email format.";
}

if (empty($organization)) {
    $errors['organization'] = "Organization is required.";
}

if (!empty($errors)) {
    http_response_code(200);
    echo json_encode([
        'status' => 'error',
        'errors' => $errors,
        'message' => 'Validation failed'
    ]);
    exit;
}

// Success - echo back the data
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Form data received successfully (DEBUG MODE)',
    'data' => [
        'name' => $name,
        'email' => $email,
        'organization' => $organization,
        'message' => $message
    ],
    'debug_info' => [
        'php_version' => phpversion(),
        'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'timestamp' => date('Y-m-d H:i:s'),
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'remote_addr' => $_SERVER['REMOTE_ADDR']
    ]
]);
exit;

<?php
session_start();
require_once 'db.php';

// Protect route: Admins only
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: dashboard.php");
    exit();
}

if (isset($_GET['id'])) {
    $target_id = intval($_GET['id']);
    $current_user_id = $_SESSION['user_id'];

    // Prevent active admin from deleting themselves
    if ($target_id !== $current_user_id) {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $target_id);
        $stmt->execute();
        $stmt->close();
    }
}

header("Location: search.php");
exit();
?>
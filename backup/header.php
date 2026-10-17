<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$user_role = $_SESSION['role'] ?? 'user';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
  <div class="container">
    <a class="navbar-brand fw-bold" href="dashboard.php">AppPortal</a>
    <div class="navbar-nav ms-auto align-items-center">
      <?php if (isset($_SESSION['user_id'])): ?>
        <span class="navbar-text me-3 text-white">
          Logged in as <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong> 
          <span class="badge bg-<?php echo $user_role === 'admin' ? 'danger' : 'primary'; ?>">
            <?php echo strtoupper($user_role); ?>
          </span>
        </span>
        <a class="nav-link text-white me-2" href="dashboard.php">Dashboard</a>
        <a class="nav-link text-white me-2" href="profile.php">My Profile</a>
        <?php if ($user_role === 'admin'): ?>
            <a class="nav-link text-white me-2" href="search.php">Manage Users</a>
        <?php endif; ?>
        <a class="btn btn-outline-light btn-sm ms-2" href="logout.php">Logout</a>
      <?php else: ?>
        <a class="nav-link text-white" href="login.php">Login</a>
        <a class="btn btn-primary btn-sm ms-2" href="register.php">Register</a>
      <?php endif; ?>
    </div>
  </div>
</nav>
<div class="container">
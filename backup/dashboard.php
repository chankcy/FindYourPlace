<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_role = $_SESSION['role'] ?? 'user';

include 'header.php';
?>

<div class="p-5 mb-4 bg-white rounded-3 shadow-sm border">
  <div class="container-fluid py-3">
    <h1 class="display-5 fw-bold">Welcome back, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
    <p class="col-md-8 fs-4">You are logged in as a <strong><?php echo htmlspecialchars($user_role); ?></strong>.</p>
    <div class="mt-4">
        <a class="btn btn-outline-primary btn-lg me-2" href="profile.php">Edit Profile & Password</a>
        <?php if ($user_role === 'admin'): ?>
            <a class="btn btn-primary btn-lg" href="search.php">Manage System Users</a>
        <?php endif; ?>
    </div>
  </div>
</div>
</div></body></html>
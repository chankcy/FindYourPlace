<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$success_msg = '';
$error_msg = '';

// Fetch current user details
$stmt = $conn->prepare("SELECT username, email, password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Process Profile Information Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $email = trim($_POST['email']);
    
    if (!empty($email)) {
        $stmt = $conn->prepare("UPDATE users SET email = ? WHERE id = ?");
        $stmt->bind_param("si", $email, $user_id);
        if ($stmt->execute()) {
            $user['email'] = $email;
            $success_msg = "Email address updated successfully!";
        } else {
            $error_msg = "Email address is already in use by another account.";
        }
        $stmt->close();
    } else {
        $error_msg = "Email field cannot be empty.";
    }
}

// Process Password Modification
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    if (!empty($current_password) && !empty($new_password) && !empty($confirm_password)) {
        if (password_verify($current_password, $user['password'])) {
            if ($new_password === $confirm_password) {
                $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->bind_param("si", $new_hash, $user_id);
                if ($stmt->execute()) {
                    $user['password'] = $new_hash;
                    $success_msg = "Password changed successfully!";
                } else {
                    $error_msg = "Error updating password.";
                }
                $stmt->close();
            } else {
                $error_msg = "New password and confirmation do not match.";
            }
        } else {
            $error_msg = "Incorrect current password.";
        }
    } else {
        $error_msg = "Please fill in all password fields.";
    }
}

include 'header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <h2 class="mb-4">My Account Settings</h2>

        <?php if ($success_msg): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success_msg; ?>
            </div>
        <?php endif; ?>

        <?php if ($error_msg): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error_msg; ?>
            </div>
        <?php endif; ?>

        <!-- Form 1: Profile Details -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
                <h5 class="card-title mb-0">Profile Information</h5>
            </div>
            <div class="card-body">
                <form action="profile.php" method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Username</label>
                        <input type="text" class="form-control" value="<?php echo htmlspecialchars($user['username']); ?>" disabled>
                        <small class="text-muted">Usernames cannot be changed.</small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Email Address</label>
                        <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                    </div>

                    <button type="submit" name="update_profile" class="btn btn-primary">Update Profile</button>
                </form>
            </div>
        </div>

        <!-- Form 2: Password Modification -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
                <h5 class="card-title mb-0">Change Password</h5>
            </div>
            <div class="card-body">
                <form action="profile.php" method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Current Password</label>
                        <input type="password" name="current_password" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">New Password</label>
                        <input type="password" name="new_password" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Confirm New Password</label>
                        <input type="password" name="confirm_password" class="form-control" required>
                    </div>

                    <button type="submit" name="change_password" class="btn btn-warning">Change Password</button>
                </form>
            </div>
        </div>
    </div>
</div>
</div></body></html>
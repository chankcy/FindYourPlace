<?php
session_start();
require_once 'db.php';

// Protect route: Admins only
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: dashboard.php");
    exit();
}

$message = '';
$id = $_GET['id'] ?? null;

if (!$id) {
    header("Location: search.php");
    exit();
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $role = $_POST['role'];

    if (!empty($username) && !empty($email)) {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?");
        $stmt->bind_param("sssi", $username, $email, $role, $id);

        if ($stmt->execute()) {
            $message = "User record updated successfully! <a href='search.php'>Back to User Directory</a>";
        } else {
            $message = "Error updating record.";
        }
        $stmt->close();
    } else {
        $message = "Please fill in all fields.";
    }
}

// Fetch Current User Details
$stmt = $conn->prepare("SELECT username, email, role FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user) {
    die("User not found.");
}

include 'header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="card-title mb-4">Edit User #<?php echo htmlspecialchars($id); ?></h3>
                <?php if ($message): ?>
                    <div class="alert alert-success"><?php echo $message; ?></div>
                <?php endif; ?>

                <form action="edit.php?id=<?php echo $id; ?>" method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Username</label>
                        <input type="text" name="username" class="form-control" value="<?php echo htmlspecialchars($user['username']); ?>" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Email</label>
                        <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Role Privilege</label>
                        <select name="role" class="form-select">
                            <option value="user" <?php echo $user['role'] === 'user' ? 'selected' : ''; ?>>USER</option>
                            <option value="admin" <?php echo $user['role'] === 'admin' ? 'selected' : ''; ?>>ADMIN</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <a href="search.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>
</div></body></html>
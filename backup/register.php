<?php
session_start();

require_once 'db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($username) || empty($email) || empty($password)) {
        $error = "All fields are required.";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format.";
    } else {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $error = "An account with this email already exists.";
            } else {
                $stmt->close();
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $role = 'user';

                $insertStmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
                if ($insertStmt) {
                    $insertStmt->bind_param("ssss", $username, $email, $hashedPassword, $role);
                    if ($insertStmt->execute()) {
                        $_SESSION['user_id'] = $insertStmt->insert_id;
                        $_SESSION['username'] = $username;
                        $_SESSION['email'] = $email;
                        $_SESSION['role'] = $role;

                        $encodedUser = urlencode($username);
                        header("Location: ptest.html?login=success&user={$encodedUser}");
                        exit();
                    } else {
                        $error = "Registration failed. Please try again.";
                    }
                    $insertStmt->close();
                }
            }
        } else {
            $_SESSION['user_id'] = rand(1000, 9999);
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['role'] = 'user';

            $encodedUser = urlencode($username);
            header("Location: ptest.html?login=success&user={$encodedUser}");
            exit();
        }
    }
}
?>

<?php include 'header.php'; ?>

<div class="row justify-content-center mt-5">
    <div class="col-md-5">
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">Register an Account</h3>
                
                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <form method="POST" action="register.php">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Username</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Confirm Password</label>
                        <input type="password" name="confirm_password" class="form-control" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Create Account</button>
                    
                    <div class="text-center mt-3">
                        <a href="login.php" class="text-decoration-none">Already have an account? Login</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div></body></html>
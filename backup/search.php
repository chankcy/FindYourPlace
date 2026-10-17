<?php
session_start();
require_once 'db.php';

// Access Control: Block Non-Admins
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die("<div class='container mt-5'><div class='alert alert-danger'>Access Denied: Admins only. <a href='dashboard.php'>Return to Dashboard</a></div></div>");
}

$search_query = "";
if (isset($_GET['query']) && !empty(trim($_GET['query']))) {
    $search_query = trim($_GET['query']);
    $param = "%" . $search_query . "%";
    $stmt = $conn->prepare("SELECT id, username, email, role, created_at FROM users WHERE username LIKE ? OR email LIKE ?");
    $stmt->bind_param("ss", $param, $param);
    $stmt->execute();
    $results = $stmt->get_result();
} else {
    $results = $conn->query("SELECT id, username, email, role, created_at FROM users");
}

include 'header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>User Directory & Management</h2>
</div>

<form action="search.php" method="GET" class="row g-2 mb-4">
    <div class="col-auto">
        <input type="text" name="query" class="form-control" placeholder="Search username or email..." value="<?php echo htmlspecialchars($search_query); ?>">
    </div>
    <div class="col-auto">
        <button type="submit" class="btn btn-primary">Search</button>
        <a href="search.php" class="btn btn-secondary">Reset</a>
    </div>
</form>

<div class="card shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($results && $results->num_rows > 0): ?>
                    <?php while ($row = $results->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo $row['id']; ?></td>
                            <td><?php echo htmlspecialchars($row['username']); ?></td>
                            <td><?php echo htmlspecialchars($row['email']); ?></td>
                            <td><span class="badge bg-<?php echo $row['role'] === 'admin' ? 'danger' : 'secondary'; ?>"><?php echo strtoupper($row['role']); ?></span></td>
                            <td><?php echo $row['created_at']; ?></td>
                            <td>
                                <a href="edit.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-warning">Edit</a>
                                <a href="delete.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete user?');">Delete</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="6" class="text-center py-3">No matching records found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
</div></body></html>
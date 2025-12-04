import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminUsers.css";

const ROLE_OPTIONS = [
  { label: "ROLE_USER", value: "ROLE_USER" },
  { label: "ROLE_ADMIN", value: "ROLE_ADMIN" },
  // Some projects use plain names; keep them for compatibility with Navbar/Login checks
  { label: "Candidate", value: "Candidate" },
  { label: "Admin", value: "Admin" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form state
  const [newUser, setNewUser] = useState({ username: "", fullName: "", email: "" });
  const [newUserRoles, setNewUserRoles] = useState([]);
  const [creating, setCreating] = useState(false);

  // Editing roles per user
  const [editedRoles, setEditedRoles] = useState({}); // { [userId]: [roles] }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/users/all");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleNamesOf = (u) => {
    // backend returns roles as array of objects { roleId, roleName }
    if (!u || !u.roles) return [];
    if (Array.isArray(u.roles)) return u.roles.map((r) => r.roleName || r);
    // if roles is a Set serialized, attempt to convert
    try {
      return Object.values(u.roles).map((r) => (r.roleName ? r.roleName : r));
    } catch {
      return [];
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.fullName.trim() || !newUser.email.trim()) {
      toast.warn("Please fill username, full name and email");
      return;
    }
    setCreating(true);
    try {
      const payload = { ...newUser, roles: new Set(newUserRoles) };
      // Convert Set to Array for JSON
      payload.roles = Array.from(payload.roles);
      const res = await fetch("http://localhost:8081/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Failed to create user");
      }
      await res.json();
      toast.success("User created. Initial password equals email.");
      setNewUser({ username: "", fullName: "", email: "" });
      setNewUserRoles([]);
      // Refresh list
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Creation failed");
    } finally {
      setCreating(false);
    }
  };

  const toggleRoleIn = (roles, role) => {
    const set = new Set(roles);
    if (set.has(role)) set.delete(role);
    else set.add(role);
    return Array.from(set);
  };

  const handleRoleToggle = (userId, roleName) => {
    setEditedRoles((prev) => {
      const current = prev[userId] ?? [];
      return { ...prev, [userId]: toggleRoleIn(current, roleName) };
    });
  };

  const saveRoles = async (userId) => {
    try {
      const roles = editedRoles[userId] ?? [];
      const res = await fetch(`http://localhost:8081/api/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Roles updated");
      setEditedRoles((prev) => ({ ...prev, [userId]: undefined }));
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update roles");
    }
  };

  const initEditedRolesIfNeeded = (u) => {
    if (editedRoles[u.userId] === undefined) {
      setEditedRoles((prev) => ({ ...prev, [u.userId]: roleNamesOf(u) }));
    }
  };

  const renderRoleCheckboxes = (userId) => {
    const selected = editedRoles[userId] ?? [];
    return (
      <div className="role-checkboxes">
        {ROLE_OPTIONS.map((opt) => (
          <label key={opt.value} className="role-option">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => handleRoleToggle(userId, opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    );
  };

  const usersWithMemo = useMemo(() => users, [users]);

  return (
    <div className="admin-users-page">
      <h1>Manage Users</h1>

      <section className="create-user-section">
        <h2>Create New User</h2>
        <p className="note">Initial password will be same as email ID.</p>
        <form className="create-user-form" onSubmit={handleCreate}>
          <div className="grid-3">
            <input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
            />
            <input
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser((s) => ({ ...s, fullName: e.target.value }))}
            />
            <input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))}
            />
          </div>
          <div className="role-checkboxes">
            {ROLE_OPTIONS.map((opt) => (
              <label key={opt.value} className="role-option">
                <input
                  type="checkbox"
                  checked={newUserRoles.includes(opt.value)}
                  onChange={() => setNewUserRoles((roles) => toggleRoleIn(roles, opt.value))}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <button type="submit" className="primary" disabled={creating}>{creating ? "Creating..." : "Create User"}</button>
        </form>
      </section>

      <section>
        <h2>All Users</h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : usersWithMemo.length === 0 ? (
          <div className="empty">No users found</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersWithMemo.map((u) => (
                <tr key={u.userId} onMouseEnter={() => initEditedRolesIfNeeded(u)}>
                  <td>{u.userId}</td>
                  <td>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <div className="current-roles">
                      {(roleNamesOf(u) || []).join(", ") || "—"}
                    </div>
                    {renderRoleCheckboxes(u.userId)}
                  </td>
                  <td className="actions">
                    <Link className="secondary" to={`/admin/users/${u.userId}/profile`}>View Profile</Link>
                    <button className="primary" onClick={() => saveRoles(u.userId)}>Save Roles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../routes/paths";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --border:      rgba(255,255,255,0.07);
  --border2:     rgba(34,211,238,0.18);
  --text:        #dde4f0;
  --muted:       #5a6480;
  --muted2:      #8892aa;
  --accent:      #f59e0b;
  --amber-dim:   rgba(245,158,11,0.1);
  --amber-glow:  rgba(245,158,11,0.22);
  --emerald:     #34d399;
  --cyan:        #22d3ee;
  --red:         #f87171;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

.users-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
  display: flex;
  overflow: hidden;
}

.users-sidebar {
  width: 248px;
  min-height: 100vh;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--surface) 0%, rgba(8,14,26,0.8) 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.2rem;
  gap: 1.5rem;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.users-sidebar::-webkit-scrollbar { width: 4px; }
.users-sidebar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.users-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Fraunces', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.users-brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--amber-glow));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 0 16px var(--amber-glow);
}

.users-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.users-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--muted2);
  transition: all 0.2s var(--ease);
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  width: 100%;
}

.users-nav-item:hover, .users-nav-item.active {
  background: var(--amber-dim);
  color: var(--accent);
  border-color: rgba(245,158,11,0.25);
}

.users-nav-icon { font-size: 1.1rem; }

.users-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.users-header {
  height: 68px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(90deg, rgba(8,14,26,0.8), rgba(8,14,26,0.95));
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

.users-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.users-header-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #fff;
}

.users-header-subtitle {
  color: var(--muted);
  font-size: 0.85rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

.users-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.users-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.users-content::-webkit-scrollbar { width: 6px; }
.users-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

.users-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 280px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.2s var(--ease);
}

.search-box:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(245,158,11,0.2);
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.7rem 1.2rem;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted2);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  white-space: nowrap;
}

.filter-btn:hover, .filter-btn.active {
  background: var(--amber-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.btn-add-user {
  padding: 0.8rem 1.6rem;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s var(--ease);
}

.btn-add-user:hover {
  background: #f59e0b;
  box-shadow: 0 0 16px var(--amber-glow);
  transform: translateY(-2px);
}

.users-table-container {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: rgba(245,158,11,0.07);
  border-bottom: 1px solid var(--border);
}

.users-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--muted2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table tbody tr {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: all 0.2s var(--ease);
}

.users-table tbody tr:hover {
  background: rgba(245,158,11,0.05);
}

.users-table td {
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--amber-glow));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.user-name {
  font-weight: 600;
  color: #fff;
}

.user-email {
  font-size: 0.8rem;
  color: var(--muted);
}

.role-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.role-admin { background: rgba(248,113,113,0.15); color: var(--red); }
.role-teacher { background: rgba(34,211,153,0.15); color: var(--emerald); }
.role-parent { background: rgba(34,211,238,0.15); color: var(--cyan); }
.role-student { background: rgba(99,102,241,0.15); color: #6366f1; }

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active { background: rgba(52,211,153,0.15); color: var(--emerald); }
.status-inactive { background: rgba(107,114,128,0.15); color: #9ca3af; }
.status-pending { background: rgba(245,158,11,0.15); color: var(--accent); }
.status-suspended { background: rgba(248,113,113,0.15); color: var(--red); }

.institution-text {
  color: var(--muted2);
  font-size: 0.9rem;
}

.joined-date {
  color: var(--muted);
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s var(--ease);
}

.btn-action:hover {
  background: var(--amber-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.btn-action.danger:hover {
  background: rgba(248,113,113,0.15);
  border-color: var(--red);
  color: var(--red);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted2);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  font-weight: 600;
}

.page-btn:hover, .page-btn.active {
  background: var(--amber-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.page-info {
  color: var(--muted);
  font-size: 0.9rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.empty-text {
  color: var(--muted);
  margin-bottom: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--muted2);
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s var(--ease);
}

.modal-close:hover {
  color: var(--accent);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
}

.form-input, .form-select {
  padding: 0.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.2s var(--ease);
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(245,158,11,0.2);
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.btn-submit {
  flex: 1;
  padding: 0.8rem;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-submit:hover {
  background: #f59e0b;
  box-shadow: 0 0 16px var(--amber-glow);
}

.btn-cancel {
  flex: 1;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted2);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-cancel:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--amber-dim);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.users-table-container {
  animation: fadeUp 0.4s var(--ease);
}
`;

function AdminUsersPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "teacher",
    status: "active",
    institution: "",
  });

  // Mock users data
  const allUsers = [
    { id: 1, fullName: "John Smith", email: "john.smith@example.com", role: "teacher", status: "active", institution: "Central High School", joinedDate: "2024-01-15" },
    { id: 2, fullName: "Sarah Johnson", email: "sarah.j@example.com", role: "parent", status: "active", institution: "Central High School", joinedDate: "2024-02-20" },
    { id: 3, fullName: "Mike Davis", email: "mike.davis@example.com", role: "admin", status: "active", institution: "System", joinedDate: "2023-12-01" },
    { id: 4, fullName: "Emily Williams", email: "emily.w@example.com", role: "teacher", status: "pending", institution: "North Valley Academy", joinedDate: "2024-03-10" },
    { id: 5, fullName: "Robert Brown", email: "robert.b@example.com", role: "student", status: "active", institution: "Central High School", joinedDate: "2024-01-05" },
    { id: 6, fullName: "Lisa Anderson", email: "lisa.a@example.com", role: "parent", status: "inactive", institution: "North Valley Academy", joinedDate: "2023-11-18" },
    { id: 7, fullName: "James Miller", email: "james.m@example.com", role: "teacher", status: "active", institution: "Eastside College", joinedDate: "2024-02-14" },
    { id: 8, fullName: "Jessica Lee", email: "jessica.l@example.com", role: "student", status: "suspended", institution: "Central High School", joinedDate: "2024-03-01" },
    { id: 9, fullName: "David Taylor", email: "david.t@example.com", role: "parent", status: "active", institution: "Eastside College", joinedDate: "2024-01-22" },
    { id: 10, fullName: "Amanda White", email: "amanda.w@example.com", role: "teacher", status: "active", institution: "North Valley Academy", joinedDate: "2024-02-28" },
    { id: 11, fullName: "Chris Martin", email: "chris.m@example.com", role: "admin", status: "active", institution: "System", joinedDate: "2024-01-10" },
    { id: 12, fullName: "Patricia Harris", email: "patricia.h@example.com", role: "student", status: "active", institution: "Eastside College", joinedDate: "2024-03-05" },
  ];

  const navItems = [
    { icon: "⊞", label: "Overview", path: PATHS.ADMIN },
    { icon: "👥", label: "Users", path: PATHS.ADMIN_USERS },
    { icon: "🏫", label: "Institutions", path: PATHS.ADMIN_INSTITUTIONS },
    { icon: "📊", label: "Reports", path: PATHS.ADMIN_REPORTS },
    { icon: "🔒", label: "Security", path: PATHS.ADMIN_SECURITY },
    { icon: "⚙️", label: "Settings", path: PATHS.ADMIN_SETTINGS },
  ];

  // Determine active nav based on current location
  const getActiveNavIndex = () => {
    if (location.pathname === PATHS.ADMIN) return 0;
    if (location.pathname === PATHS.ADMIN_USERS) return 1;
    if (location.pathname === PATHS.ADMIN_INSTITUTIONS) return 2;
    if (location.pathname === PATHS.ADMIN_REPORTS) return 3;
    if (location.pathname === PATHS.ADMIN_SECURITY) return 4;
    if (location.pathname === PATHS.ADMIN_SETTINGS) return 5;
    return 0;
  };

  const activeNavIndex = getActiveNavIndex();

  // Filter users
  let filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = () => {
    setFormData({ fullName: "", email: "", role: "teacher", status: "active", institution: "" });
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const handleEditUser = (u) => {
    setFormData({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      institution: u.institution,
    });
    setSelectedUser(u);
    setShowEditModal(true);
  };

  const handleSaveUser = () => {
    console.log("Saving user:", selectedUser ? "Edit" : "Add", formData);
    if (selectedUser) {
      setShowEditModal(false);
    } else {
      setShowAddModal(false);
    }
  };

  const handleDeleteUser = (u) => {
    if (confirm(`Are you sure you want to delete ${u.fullName}?`)) {
      console.log("Deleting user:", u.fullName);
    }
  };

  const getRoleBadgeClass = (role) => `role-badge role-${role}`;
  const getStatusBadgeClass = (status) => `status-badge status-${status}`;
  const getInitials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <>
      <style>{CSS}</style>
      <div className="users-root">
        {/* Sidebar */}
        <aside className="users-sidebar">
          <div className="users-brand">
            <div className="users-brand-icon">⚡</div>
            <span>EduAdmin</span>
          </div>

          <nav className="users-nav">
            {navItems.map((item, idx) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <button
                  className={`users-nav-item ${idx === activeNavIndex ? "active" : ""}`}
                >
                  <span className="users-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Quick Stats</p>
            <div style={{ fontSize: "0.85rem", color: "var(--muted2)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div>👥 1,284 Users</div>
              <div>✓ 1,127 Active</div>
              <div>⏳ 24 Pending</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="users-main">
          {/* Header */}
          <header className="users-header">
            <div className="users-header-left">
              <h1 className="users-header-title">User Management</h1>
              <span className="users-header-subtitle">{filteredUsers.length} users found</span>
            </div>
            <div className="users-header-right">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "600", color: "#fff" }}>{user?.fullName || "Administrator"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{user?.role || "ADMIN"}</div>
              </div>
              <button className="btn-add-user" onClick={() => logout()} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted2)" }}>Sign Out</button>
            </div>
          </header>

          {/* Content */}
          <div className="users-content">
            {/* Controls */}
            <div className="users-controls">
              <input
                type="text"
                className="search-box"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />

              <div className="filter-group">
                <button
                  className={`filter-btn ${filterRole === "all" ? "active" : ""}`}
                  onClick={() => {
                    setFilterRole("all");
                    setCurrentPage(1);
                  }}
                >
                  All Roles
                </button>
                <button
                  className={`filter-btn ${filterRole === "teacher" ? "active" : ""}`}
                  onClick={() => {
                    setFilterRole("teacher");
                    setCurrentPage(1);
                  }}
                >
                  Teachers
                </button>
                <button
                  className={`filter-btn ${filterRole === "parent" ? "active" : ""}`}
                  onClick={() => {
                    setFilterRole("parent");
                    setCurrentPage(1);
                  }}
                >
                  Parents
                </button>
                <button
                  className={`filter-btn ${filterRole === "student" ? "active" : ""}`}
                  onClick={() => {
                    setFilterRole("student");
                    setCurrentPage(1);
                  }}
                >
                  Students
                </button>
              </div>

              <div className="filter-group">
                <button
                  className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("all");
                    setCurrentPage(1);
                  }}
                >
                  All Status
                </button>
                <button
                  className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("active");
                    setCurrentPage(1);
                  }}
                >
                  Active
                </button>
                <button
                  className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("pending");
                    setCurrentPage(1);
                  }}
                >
                  Pending
                </button>
              </div>

              <button className="btn-add-user" onClick={handleAddUser}>
                ➕ Add User
              </button>
            </div>

            {/* Users Table */}
            {paginatedUsers.length > 0 ? (
              <>
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Institution</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{getInitials(u.fullName)}</div>
                              <div className="user-details">
                                <div className="user-name">{u.fullName}</div>
                                <div className="user-email">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                          </td>
                          <td>
                            <span className="institution-text">{u.institution}</span>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(u.status)}>{u.status}</span>
                          </td>
                          <td>
                            <span className="joined-date">{new Date(u.joinedDate).toLocaleDateString()}</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-action" onClick={() => handleEditUser(u)} title="Edit">
                                ✏️
                              </button>
                              <button className="btn-action" title="View Details">
                                👁️
                              </button>
                              <button className="btn-action danger" onClick={() => handleDeleteUser(u)} title="Delete">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`page-btn ${page === currentPage ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </>
            ) : (
              <div className="users-table-container">
                <div className="empty-state">
                  <div className="empty-icon">👤</div>
                  <div className="empty-title">No users found</div>
                  <div className="empty-text">Try adjusting your search or filter criteria</div>
                  <button className="btn-add-user" onClick={handleAddUser}>
                    ➕ Add First User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="School/Institution name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="btn-submit" onClick={handleSaveUser}>
                Create User
              </button>
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit User</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="btn-submit" onClick={handleSaveUser}>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminUsersPage;

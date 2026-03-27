import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roles = ["ADMIN", "TEACHER", "PARENT"];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "TEACHER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Register</h1>
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" value={form.fullName} onChange={onChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} required minLength={6} />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={onChange}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {error ? <p className="error">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

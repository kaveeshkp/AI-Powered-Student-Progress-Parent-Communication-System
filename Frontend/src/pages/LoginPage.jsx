import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const response = await login(form);
      const role = response.role;
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "TEACHER") {
        navigate("/teacher");
      } else {
        navigate("/parent");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

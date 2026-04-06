import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/login">Go to login</Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "User";

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        firstName,
        lastName,
        email,
        password
      });

      toast.success(res.data?.message || "Registered successfully!");
      navigate("/Login");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Registration failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card" role="region" aria-label="Register form">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="register-close-button"
          aria-label="Close"
        >
          <IoClose size={18} />
        </button>
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="register-title">Create account</h2>
          <input
            className="register-input"
            type="text"
            placeholder="Full name"
            aria-label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="password"
            placeholder="Confirm password"
            aria-label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="register-button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          
          <p className="login-link">
            Already have an account? <Link to="/Login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

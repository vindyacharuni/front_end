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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    } else if (fullName.trim().split(/\s+/).length < 2) {
      tempErrors.fullName = "Please enter both first and last name";
    }

    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
            className={`register-input ${errors.fullName ? "border border-red-500" : ""}`}
            type="text"
            placeholder="Full name"
            aria-label="Full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
          />
          {errors.fullName && <span className="register-error-message">{errors.fullName}</span>}

          <input
            className={`register-input ${errors.email ? "border border-red-500" : ""}`}
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && <span className="register-error-message">{errors.email}</span>}

          <input
            className={`register-input ${errors.password ? "border border-red-500" : ""}`}
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && <span className="register-error-message">{errors.password}</span>}

          <input
            className={`register-input ${errors.confirmPassword ? "border border-red-500" : ""}`}
            type="password"
            placeholder="Confirm password"
            aria-label="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
            }}
          />
          {errors.confirmPassword && <span className="register-error-message">{errors.confirmPassword}</span>}

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

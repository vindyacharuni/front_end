import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            tempErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            tempErrors.password = "Password is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
            toast.success("Logged in successfully.");
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            navigate("/");
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Login failed";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card" role="region" aria-label="Login form">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="login-close-button"
                    aria-label="Close"
                >
                    <IoClose size={18} />
                </button>
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">Log in</h2>
                    <input
                        className={`login-input ${errors.email ? "border border-red-500" : ""}`}
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                    />
                    {errors.email && <span className="login-error-message">{errors.email}</span>}

                    <input
                        className={`login-input ${errors.password ? "border border-red-500" : ""}`}
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                    />
                    {errors.password && <span className="login-error-message">{errors.password}</span>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                    
                    <p className="signup-link">Don't have an account? <Link to="/register">Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}
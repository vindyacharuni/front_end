import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">Log in</h2>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                    
                    <p className="signup-link">Don't have an account? <Link to="/register">Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}
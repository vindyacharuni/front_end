import "./RegisterPage.css";

export default function RegisterPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle register
  };

  return (
    <div className="register-page">
      <div className="register-card" role="region" aria-label="Register form">
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="register-title">Create account</h2>
          <input className="register-input" type="text" placeholder="Full name" aria-label="Full name" />
          <input className="register-input" type="email" placeholder="Email" aria-label="Email" />
          <input className="register-input" type="password" placeholder="Password" aria-label="Password" />
          <input className="register-input" type="password" placeholder="Confirm password" aria-label="Confirm password" />
          <button className="register-button" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

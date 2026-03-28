'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Start trading on PrediktIt with $10,000 in free play money</p>

        <button className="btn btn-outline btn-md btn-block" style={{ marginBottom: '8px' }}>
          Sign up with Google
        </button>
        <button className="btn btn-outline btn-md btn-block" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
          Sign up with Wallet
        </button>

        <div className="auth-divider">or</div>

        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-input" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Create Account</button>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

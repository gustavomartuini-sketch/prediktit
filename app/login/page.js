'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to your PrediktIt account</p>

        <button className="btn btn-outline btn-md btn-block" style={{ marginBottom: '8px' }}>
          Continue with Google
        </button>
        <button className="btn btn-outline btn-md btn-block" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
          Connect Wallet
        </button>

        <div className="auth-divider">or</div>

        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Sign In</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Sign up for free</a>
        </div>
      </div>
    </div>
  );
}

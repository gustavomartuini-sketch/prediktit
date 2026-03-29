'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        window.location.href = '/login';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleWalletSignUp = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('No wallet detected. Please install MetaMask.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const message = `Sign up for PrediktIt\nTimestamp: ${Date.now()}`;

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      const result = await signIn('wallet', {
        address,
        signature,
        message,
        redirect: false,
      });

      if (result?.error) {
        setError('Wallet authentication failed. Please try again.');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Wallet connection cancelled.');
      } else {
        setError('Wallet connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Start trading on PrediktIt with $10,000 in free play money</p>

        {error && (
          <div style={{
            padding: '12px', marginBottom: '16px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
            color: '#ef4444', fontSize: '13px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-outline btn-md btn-block"
          style={{ marginBottom: '8px' }}
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          Sign up with Google
        </button>
        <button
          className="btn btn-outline btn-md btn-block"
          style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
          onClick={handleWalletSignUp}
          disabled={loading}
        >
          Sign up with Wallet
        </button>

        <div className="auth-divider">or</div>

        <form onSubmit={handleSubmit}>
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
            <input type="password" className="form-input" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
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

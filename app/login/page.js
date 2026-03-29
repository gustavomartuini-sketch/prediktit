'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Try demo@prediktit.com with any password.');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleWalletConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('No wallet detected. Please install MetaMask.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const message = `Sign in to PrediktIt\nTimestamp: ${Date.now()}`;

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
        <h1>Welcome Back</h1>
        <p>Sign in to your PrediktIt account</p>

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
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Continue with Google
        </button>
        <button
          className="btn btn-outline btn-md btn-block"
          style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
          onClick={handleWalletConnect}
          disabled={loading}
        >
          Connect Wallet
        </button>

        <div className="auth-divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Sign up for free</a>
        </div>
      </div>
    </div>
  );
}

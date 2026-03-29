import '../styles/globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'PrediktIt - Prediction Market Platform',
  description: 'Trade on real-world events. Binary, multi-outcome, and scalar prediction markets with play money and crypto.',
  keywords: 'prediction market, trading, forecasting, polymarket alternative, kalshi alternative',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="nav-logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">PrediktIt</span>
            </a>
            <div className="nav-links">
              <a href="/markets" className="nav-link">Markets</a>
              <a href="/create" className="nav-link">Create</a>
              <a href="/dashboard" className="nav-link">Dashboard</a>
              <a href="/portfolio" className="nav-link">Portfolio</a>
              <a href="/marketing" className="nav-link nav-link-special">Marketing</a>
              <a href="/admin" className="nav-link" style={{ color: 'var(--red)' }}>Admin</a>
            </div>
            <div className="nav-right">
              <div className="nav-balance">
                <span className="balance-label">Balance</span>
                <span className="balance-amount">$10,000</span>
              </div>
              <a href="/login" className="btn btn-outline btn-sm">Log In</a>
              <a href="/register" className="btn btn-primary btn-sm">Sign Up</a>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3 className="footer-title">
                  <span className="logo-icon">◆</span> PrediktIt
                </h3>
                <p className="footer-desc">The next-generation prediction market platform. Trade on real-world events with play money or crypto.</p>
              </div>
              <div className="footer-col">
                <h4>Platform</h4>
                <a href="/markets">All Markets</a>
                <a href="/create">Create Market</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/portfolio">Portfolio</a>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <a href="/markets">How It Works</a>
                <a href="/api/markets">API Docs</a>
                <a href="/marketing">Blog</a>
                <a href="/markets">FAQ</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="/markets">Terms of Service</a>
                <a href="/markets">Privacy Policy</a>
                <a href="/markets">Risk Disclosure</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 PrediktIt. All rights reserved. Trade responsibly.</p>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}

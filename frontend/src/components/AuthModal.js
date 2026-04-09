import React, { useState } from 'react';
import axios from 'axios';

const rawUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const BACKEND_URL = rawUrl.replace(/\/$/, '');

export default function AuthModal({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: email.trim(),
        password: password || null
      });

      // ✅ store JWT token
      localStorage.setItem("token", response.data.access_token);

      onAuthSuccess(
        response.data.access_token,
        response.data.is_admin,
        response.data.email
      );

    } catch (err) {
      const errorData = err.response?.data?.detail;

      if (Array.isArray(errorData)) {
        setError("Please enter a valid email address.");
      } else {
        setError(errorData || 'Failed to connect to backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2">🕷️</h1>
          <h2 className="text-3xl font-bold glitch-text mb-2">SAMAY'S PORTFOLIO</h2>
          <p className="text-gray-400">Enter your email to access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="Admin Password (only if admin)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Enter Portfolio'}
          </button>

        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Secure JWT Authentication</p>
        </div>
      </div>
    </div>
  );
}
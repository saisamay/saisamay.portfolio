import React, { useState } from 'react';
import axios from 'axios';

const rawUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const BACKEND_URL = rawUrl.replace(/\/$/, '');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AuthModal({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = EMAIL_REGEX.test(email.trim());

  // ── Real-time email change ──────────────────────────────
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError('');

    // Drop down password only when backend confirms admin, not client-side.
    // But if user clears the email, collapse the password field.
    if (showPassword && !val) {
      setShowPassword(false);
      setPassword('');
    }
  };

  // ── Submit ──────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: email.trim(),
        password: password || null,
      });

      localStorage.setItem('token', response.data.access_token);
      onAuthSuccess(
        response.data.access_token,
        response.data.is_admin,
        response.data.email
      );
    } catch (err) {
      const errorData = err.response?.data?.detail;

      if (err.response?.status === 401 && errorData === 'Admin password incorrect') {
        if (!showPassword) {
          setShowPassword(true);
          setError('');
        } else {
          setError('Incorrect admin password. Try again.');
        }
      } else if (Array.isArray(errorData)) {
        setError('Please enter a valid email address.');
      } else {
        setError(errorData || 'Failed to connect to backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Derive email field status for styling
  const emailStatus = email.length === 0 ? 'empty' : isValidEmail ? 'valid' : 'invalid';

  const inputBase = 'w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border text-gray-200 outline-none transition-all duration-200 placeholder-gray-600';
  const borderClass = {
    empty: 'border-gray-800 focus:border-gray-600',
    valid: 'border-green-600',
    invalid: 'border-red-500',
  }[emailStatus];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-7">
          <span className="text-5xl">🕷️</span>
          <h2 className="text-2xl font-bold text-red-600 tracking-widest font-mono mt-2">
            SAMAY'S PORTFOLIO
          </h2>
          <p className="text-gray-500 text-sm mt-1">Enter your email to access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">

          {/* Email field with inline status icon */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={showPassword}
              className={`${inputBase} ${borderClass} pr-10 disabled:opacity-50`}
            />
            {email.length > 0 && (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold
                ${isValidEmail ? 'text-green-500' : 'text-red-500'}`}>
                {isValidEmail ? '✓' : '✗'}
              </span>
            )}
          </div>

          {/* Admin badge — appears when backend confirms admin */}
          <div className={`transition-all duration-300 origin-top overflow-hidden
            ${showPassword ? 'max-h-8 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}`}>
            <span className="inline-flex items-center gap-1.5 text-xs text-red-500
              bg-red-500/10 border border-red-500/25 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              Admin detected
            </span>
          </div>

          {/* Password field — slides down only for admin */}
          <div className={`transition-all duration-500 ease-out origin-top
            ${showPassword
              ? 'max-h-20 opacity-100 scale-y-100 translate-y-0'
              : 'max-h-0 opacity-0 scale-y-0 -translate-y-2 overflow-hidden'}`}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className={`${inputBase} border-gray-700 focus:border-gray-500`}
              required={showPassword}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {/* Submit — disabled until email is valid */}
          <button
            type="submit"
            disabled={loading || !isValidEmail}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium
              transition-all duration-200 active:scale-[0.98]
              disabled:bg-[#2a2a2a] disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : showPassword ? 'Enter Admin Mode' : 'Enter Portfolio'}
          </button>

        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          🔒 Secure JWT Authentication
        </div>
      </div>
    </div>
  );
}
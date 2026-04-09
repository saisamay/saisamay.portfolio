import React, { useState } from 'react';
import axios from 'axios';

// This automatically strips any accidental trailing slashes from your environment variable!
const rawUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const BACKEND_URL = rawUrl.replace(/\/$/, '');

export default function AuthModal({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { email });
      setStep('otp');
    } catch (err) {
      const errorData = err.response?.data?.detail;
      // Prevent React crashes if FastAPI sends a validation array
      if (Array.isArray(errorData)) {
        setError("Please enter a valid email address.");
      } else {
        setError(errorData || 'Failed to connect to the backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
        email,
        otp
      });
      onAuthSuccess(response.data.session_token, response.data.is_admin, response.data.email);
    } catch (err) {
      const errorData = err.response?.data?.detail;
      setError(errorData || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full" data-testid="auth-modal">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-spiderRed">🕷️</span>
          </h1>
          <h2 className="text-3xl font-bold glitch-text mb-2">SAMAY'S PORTFOLIO</h2>
          <p className="text-gray-400">Enter your email to access</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                data-testid="email-input"
              />
            </div>
            
            {error && (
              <p className="text-spiderRed text-sm" data-testid="auth-error">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              data-testid="send-otp-button"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">OTP sent to {email}</p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center text-2xl tracking-widest"
                maxLength={6}
                required
                data-testid="otp-input"
              />
            </div>
            
            {error && (
              <p className="text-spiderRed text-sm" data-testid="auth-error">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              data-testid="verify-otp-button"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="btn-secondary w-full mt-2"
              data-testid="back-button"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Secure email-based authentication</p>
        </div>
      </div>
    </div>
  );
}
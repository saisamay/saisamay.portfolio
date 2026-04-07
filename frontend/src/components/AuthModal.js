import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function AuthModal({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
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
      setError(err.response?.data?.detail || 'Failed to send OTP');
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
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full" data-testid="auth-modal">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-spidey-red">🕷️</span>
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
              <p className="text-spidey-red text-sm" data-testid="auth-error">{error}</p>
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
              <p className="text-spidey-red text-sm" data-testid="auth-error">{error}</p>
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
              className="btn-secondary w-full"
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

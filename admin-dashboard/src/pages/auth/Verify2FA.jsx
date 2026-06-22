import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, Loader2, Smartphone, RefreshCw, ArrowLeft, CheckCircle2, Key } from 'lucide-react';
import api from '../../utils/api';

const CODE_LENGTH = 6;

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tempToken = location.state?.tempToken;
  const from = location.state?.from || '/dashboard';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!tempToken) {
      navigate('/login', { replace: true });
      return;
    }
    inputRef.current?.focus();
  }, [tempToken, navigate, useRecoveryCode]);

  useEffect(() => {
    if (countdown <= 0) {
      setError('Session expired. Please login again.');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (e) => {
    let value = e.target.value;
    if (!useRecoveryCode) {
      value = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    } else {
      value = value.replace(/[^0-9-]/g, '').slice(0, 5);
      if (value.length === 3 && !value.includes('-')) {
        value = value.slice(0, 2) + '-' + value.slice(2);
      }
    }
    setCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codeValid = useRecoveryCode
      ? /^\d{2}-\d{2}$/.test(code)
      : code.length === CODE_LENGTH;

    if (!codeValid) {
      setError(useRecoveryCode ? 'Enter a valid recovery code (XX-XX)' : `Please enter a ${CODE_LENGTH}-digit code`);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const data = await api.post('/api/auth/2fa/verify-login', {
        tempToken,
        token: code,
      });

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
      setCode('');
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  if (!tempToken) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {useRecoveryCode
              ? 'Enter one of your recovery codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Verified successfully!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  {useRecoveryCode ? (
                    <Key className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  {useRecoveryCode ? 'Recovery Code' : 'Authentication Code'}
                </label>
                <div className="flex justify-center">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode={useRecoveryCode ? 'text' : 'numeric'}
                    autoComplete="one-time-code"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder={useRecoveryCode ? 'XX-XX' : '000000'}
                    className={`text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      useRecoveryCode ? 'w-36' : 'w-48'
                    } ${
                      error
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={isVerifying}
                  />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  {useRecoveryCode
                    ? 'Each recovery code can only be used once'
                    : 'Enter the code from Google Authenticator'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setUseRecoveryCode(!useRecoveryCode); setCode(''); setError(''); }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                >
                  <Key className="h-3.5 w-3.5" />
                  {useRecoveryCode ? 'Use authenticator code' : 'Use recovery code'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login', { replace: true })}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to login
                </button>
              </div>

              {!useRecoveryCode && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <RefreshCw className={`h-3.5 w-3.5 ${countdown < 60 ? 'text-red-400' : ''}`} />
                  <span className={countdown < 60 ? 'text-red-400 font-medium' : ''}>
                    {formatTime(countdown)}
                  </span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;

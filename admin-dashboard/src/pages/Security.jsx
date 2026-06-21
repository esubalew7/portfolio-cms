import { useState, useEffect, useCallback } from 'react';
import { Shield, Smartphone, CheckCircle2, AlertTriangle, XCircle, Loader2, Copy, Check, RefreshCw, Download, Key, ArrowLeft, Lock } from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';

const SetupFlow = ({ onBack, onComplete }) => {
  const [step, setStep] = useState('secret');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSetup = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/api/auth/2fa/setup');
      setSecret(data.data.secret);
      setQrCode(data.data.qrCode);
      setStep('qr');
    } catch (err) {
      setError(err.message || 'Failed to start 2FA setup');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSetup();
  }, [handleSetup]);

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text
      const el = document.createElement('textarea');
      el.value = secret;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/2fa/verify-setup', { token: code });
      setStep('success');
      setTimeout(() => onComplete(), 1500);
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'secret') {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Generating secret key...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">2FA Enabled Successfully!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your account is now more secure.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          onClick={() => { onBack(); }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set Up Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Follow the steps below to enable 2FA</p>
        </div>
      </div>

      <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-700 dark:text-amber-400">
          <p className="font-semibold">Important</p>
          <p>Before proceeding, make sure you have Google Authenticator (or a compatible app) installed on your phone.</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Step 1: Scan the QR Code</h4>
        <div className="flex justify-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          {qrCode ? (
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Scan this QR code with Google Authenticator
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white dark:bg-gray-800 text-gray-400">Or enter the key manually</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Step 2: Enter the Key</h4>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <Key className="h-4 w-4 text-gray-400 shrink-0" />
          <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white truncate select-all">
            {secret}
          </code>
          <button
            type="button"
            onClick={handleCopySecret}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Copy secret key"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Step 3: Verify the Code</h4>
        <p className="text-xs text-gray-400 mb-3">Enter the 6-digit code from your authenticator app to confirm everything works.</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
            placeholder="000000"
            className="w-36 text-center text-xl font-mono tracking-[0.4em] px-4 py-2.5 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            Verify & Enable
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disabling, setDisabling] = useState(false);
  const [disableError, setDisableError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.get('/api/auth/2fa/status');
      setTwoFactorEnabled(data.data.twoFactorEnabled);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleDisable = async () => {
    if (disableCode.length !== 6) {
      setDisableError('Please enter a 6-digit code');
      return;
    }
    setDisabling(true);
    setDisableError('');
    try {
      await api.post('/api/auth/2fa/disable', { token: disableCode });
      setTwoFactorEnabled(false);
      setShowDisableConfirm(false);
      setDisableCode('');
    } catch (err) {
      setDisableError(err.message || 'Failed to disable 2FA');
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Security Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account security and two-factor authentication.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account by requiring a one-time code from your authenticator app.
              </p>

              {showSetup ? (
                <div className="mt-6">
                  <SetupFlow
                    onBack={() => {
                      setShowSetup(false);
                      fetchStatus();
                    }}
                    onComplete={() => {
                      setShowSetup(false);
                      setTwoFactorEnabled(true);
                    }}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      twoFactorEnabled
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {twoFactorEnabled ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {twoFactorEnabled ? '2FA is enabled' : '2FA is not enabled'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {twoFactorEnabled
                          ? 'Your account is protected with two-factor authentication.'
                          : 'Protect your account with an additional verification step.'}
                      </p>
                    </div>
                    {twoFactorEnabled ? (
                      <button
                        type="button"
                        onClick={() => { setShowDisableConfirm(true); setDisableCode(''); setDisableError(''); }}
                        className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSetup(true)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showDisableConfirm && (
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Disable Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              To disable 2FA, enter a code from your authenticator app to confirm your identity.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={disableCode}
                onChange={(e) => { setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setDisableError(''); }}
                placeholder="000000"
                className="w-32 text-center text-lg font-mono tracking-[0.3em] px-3 py-2 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                disabled={disabling}
              />
              <button
                type="button"
                onClick={handleDisable}
                disabled={disabling || disableCode.length !== 6}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                {disabling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Disable 2FA'
                )}
              </button>
              <button
                type="button"
                onClick={() => { setShowDisableConfirm(false); setDisableCode(''); setDisableError(''); }}
                className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
            {disableError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />
                {disableError}
              </p>
            )}
          </Card>
        )}

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Tips</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <Smartphone className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Use Google Authenticator, Authy, or any TOTP-compatible app.</span>
            </li>
            <li className="flex items-start gap-3">
              <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Codes refresh every 30 seconds. Enter the current code before it expires.</span>
            </li>
            <li className="flex items-start gap-3">
              <Download className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Keep your authenticator app backed up to avoid being locked out.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Security;

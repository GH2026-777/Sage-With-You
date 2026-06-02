/**
 * Password Gate Component
 * Protects the site with a password for staging/testing environments.
 *
 * Deploy-time toggle: `VITE_ENABLE_PASSWORD_GATE=false` disables the gate (public go-live).
 * Password: set `VITE_STAGING_GATE_PASSWORD` in .env / production build env.
 */

import { useState, useEffect } from 'react';
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AuthBrandHeader } from './AuthBrandHeader';
import {
  isStagingPasswordGateEnabled,
  stagingGatePassword,
} from '../../lib/staging-gate';

const STORAGE_KEY = 'site_access_granted';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const gateEnabled = isStagingPasswordGateEnabled();
  const sitePassword = stagingGatePassword();

  useEffect(() => {
    if (!gateEnabled) {
      setIsUnlocked(true);
      setIsChecking(false);
      return;
    }

    const checkAccess = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { timestamp, granted } = JSON.parse(stored);
          const now = Date.now();

          if (granted && (now - timestamp) < SESSION_DURATION) {
            setIsUnlocked(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        console.error('Error checking access:', e);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [gateEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sitePassword) {
      setError('Staging access password is not configured (set VITE_STAGING_GATE_PASSWORD).');
      return;
    }

    if (password === sitePassword) {
      const accessData = {
        granted: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
      setIsUnlocked(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 shadow-xl overflow-hidden">
          <AuthBrandHeader />
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              Password Protected
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              This site is currently in staging. Please enter the password to continue.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Enter Site
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Note:</strong> Access will remain valid for 24 hours. After that, you'll need to enter the password again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

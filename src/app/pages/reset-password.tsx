import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../../utils/supabase';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset email link
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked the reset link and is authenticated
        console.log('Password recovery mode activated');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-gray-200 shadow-xl">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-teal-600 mb-2">
            SageÉlan Foundation
          </h1>
          <p className="text-gray-600">Sage With You - Living in Place</p>
        </div>

        <Card className="border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              Set New Password
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Enter your new password below
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
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isLoading ? 'Resetting password...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-700 hover:underline"
              >
                ← Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

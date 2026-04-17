import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../../utils/supabase';

export function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pre = searchParams.get('email');
    if (pre) setEmail(decodeURIComponent(pre));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to send reset email. Please try again.",
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
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                >
                  try again
                </button>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
                  Back to Sign In
                </Button>
              </Link>
            </div>
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
              Reset Password
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your password
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
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-700 hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

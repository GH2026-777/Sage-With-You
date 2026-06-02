import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../../utils/supabase';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { BackToHomeLink } from '../components/BackToHome';
import {
  authErrorMessage,
  isAuthEmailTimeout,
  isExistingUserSignup,
} from '../../utils/authErrorMessage';
import { authEmailRedirect } from '../../utils/authRedirect';
import { resendSignupConfirmation } from '../../utils/resendSignupConfirmation';
import { initSupabaseAuth } from '../../utils/authSession';

export function Join() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(true);
  const [resendInfo, setResendInfo] = useState('');
  const [resendError, setResendError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      navigate('/login', {
        replace: true,
        state: { email, needsEmailConfirm },
      });
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [success, navigate, email, needsEmailConfirm]);

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

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    const emailRedirectTo = authEmailRedirect('/login');

    try {
      await initSupabaseAuth();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) throw error;

      if (isExistingUserSignup(data)) {
        setError(
          'An account with this email already exists. Try signing in or use Forgot password.',
        );
        return;
      }

      if (data.user) {
        setNeedsEmailConfirm(!data.session);
        setSuccess(true);
      } else {
        setError(
          'We could not finish creating your account. Please try again or contact us for help.',
        );
      }
    } catch (error: unknown) {
      // Supabase often creates the user but times out while sending mail (504).
      if (isAuthEmailTimeout(error)) {
        setNeedsEmailConfirm(true);
        setSuccess(true);
        setResendInfo(
          'Your account may already be set up. Check your email in a few minutes, then sign in. If nothing arrives, use Resend below once (not repeatedly).',
        );
        return;
      }

      const message = authErrorMessage(
        error,
        'Failed to create account. Please try again.',
      );
      const code =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code: unknown }).code === 'string'
          ? (error as { code: string }).code
          : '';
      setError(
        import.meta.env.DEV && code
          ? `${message} (code: ${code})`
          : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOnSuccess = async () => {
    setResendError('');
    setResendInfo('');
    setIsResending(true);
    const result = await resendSignupConfirmation(email);
    if (result.ok) {
      setResendInfo(result.message);
    } else {
      setResendError(result.message);
    }
    setIsResending(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-gray-200 shadow-xl">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-sage-600 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Account Created!
            </h2>
            {needsEmailConfirm ? (
              <p className="text-gray-600 text-sm leading-relaxed">
                We sent a confirmation link to{' '}
                <span className="font-medium text-gray-900">{email}</span>.
                Check your inbox and spam folder, then sign in.
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Your account is ready. You can sign in now.
              </p>
            )}
            {resendInfo && (
              <p className="text-sm text-sage-800 bg-sage-50 border border-sage-200 rounded-lg p-3">
                {resendInfo}
              </p>
            )}
            {resendError && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-3">
                {resendError}
              </p>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                asChild
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Link
                  to="/login"
                  state={{ email, needsEmailConfirm }}
                  replace
                >
                  Continue to sign in
                </Link>
              </Button>
              {needsEmailConfirm && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isResending}
                  onClick={handleResendOnSuccess}
                  className="w-full border-sage-600 text-sage-700 hover:bg-sage-50"
                >
                  {isResending ? 'Sending…' : 'Resend confirmation email'}
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              You will also be sent to sign in automatically in a few seconds.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 shadow-xl overflow-hidden">
          <AuthBrandHeader />
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              Create Account
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Join us to access resources and tools
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
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
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
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
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-sage-600 hover:text-sage-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <BackToHomeLink className="text-sm text-gray-600 hover:text-gray-700 hover:underline" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

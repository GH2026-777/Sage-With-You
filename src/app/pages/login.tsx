import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../../utils/supabase';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { BackToHomeLink } from '../components/BackToHome';
import { authErrorMessage, isEmailNotConfirmed } from '../../utils/authErrorMessage';
import { resendSignupConfirmation } from '../../utils/resendSignupConfirmation';
import { initSupabaseAuth } from '../../utils/authSession';

type LoginLocationState = {
  email?: string;
  needsEmailConfirm?: boolean;
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginState = (location.state as LoginLocationState | null) ?? {};
  const [email, setEmail] = useState(loginState.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState(
    loginState.needsEmailConfirm
      ? 'Confirm your email using the link we sent, then sign in below.'
      : '',
  );
  const [showResendConfirm, setShowResendConfirm] = useState(
    Boolean(loginState.needsEmailConfirm),
  );
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setShowResendConfirm(false);
    setIsLoading(true);

    try {
      await initSupabaseAuth();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/');
      }
    } catch (error: unknown) {
      if (isEmailNotConfirmed(error)) {
        setShowResendConfirm(true);
      }
      setError(
        authErrorMessage(
          error,
          'Failed to sign in. Please check your credentials.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('Enter your email address above, then resend the confirmation email.');
      return;
    }
    setIsResending(true);
    setError('');
    setInfo('');
    const result = await resendSignupConfirmation(email);
    if (result.ok) {
      setInfo(result.message);
      setShowResendConfirm(false);
    } else {
      setError(result.message);
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 shadow-xl overflow-hidden">
          <AuthBrandHeader />
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              Sign In
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Access your account
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

              {info && (
                <div className="bg-sage-50 border border-sage-200 rounded-lg p-3">
                  <p className="text-sm text-sage-900">{info}</p>
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-sage-600 hover:text-sage-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {showResendConfirm && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isResending}
                  onClick={handleResendConfirmation}
                  className="w-full border-sage-600 text-sage-700 hover:bg-sage-50"
                >
                  {isResending ? 'Sending…' : 'Resend confirmation email'}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/join"
                  className="text-sage-600 hover:text-sage-700 font-medium hover:underline"
                >
                  Sign up
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

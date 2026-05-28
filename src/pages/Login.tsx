import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sign in form
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });
  
  // Sign up form
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  
  // Reset password form
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect authenticated users
  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateSignInForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signInForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signInForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!signInForm.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signUpForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signUpForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!signUpForm.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(signUpForm.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(signInForm.email, signInForm.password);
    
    if (!error) {
      navigate('/', { replace: true });
    }
    setIsLoading(false);
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;
    
    setIsLoading(true);
    const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);
    setIsLoading(false);
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      setErrors({ resetEmail: 'Please enter a valid email' });
      return;
    }
    
    setIsLoading(true);
    await resetPassword(resetEmail);
    setIsLoading(false);
    setShowResetForm(false);
    setResetEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Main Auth Card */}
        <Card className="border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 text-slate-100">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Welcome</CardTitle>
              <CardDescription className="text-slate-400">
                Sign in to your account or create a new one
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {!showResetForm ? (
              <Tabs defaultValue="signin" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/60 border border-white/5">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signInForm.email}
                          onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-rose-400">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-slate-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-rose-400">{errors.password}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      ) : null}
                      Sign In
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      className="w-full text-sm text-indigo-300 hover:text-indigo-200"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot your password?
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signUpForm.fullName}
                          onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-rose-400">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-rose-400">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signUpForm.password}
                          onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-rose-400">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-slate-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          value={signUpForm.confirmPassword}
                          onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/5"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-rose-400">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      ) : null}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              /* Password Reset Form */
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                  <p className="text-sm text-slate-400">
                    Enter your email to receive password reset instructions
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                    {errors.resetEmail && (
                      <p className="text-sm text-rose-400">{errors.resetEmail}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent border-white/15 text-slate-200 hover:bg-white/5 hover:text-white"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail('');
                        setErrors({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      ) : null}
                      Send Reset Email
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <Alert className="bg-indigo-500/10 border-indigo-500/30 text-slate-200">
              <CheckCircle className="h-4 w-4 text-indigo-300" />
              <AlertDescription className="text-slate-300">
                Your data is protected with enterprise-grade security and encryption.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-indigo-300 hover:text-indigo-200 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-indigo-300 hover:text-indigo-200 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
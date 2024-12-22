import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/common/input';
import { Label } from '@/components/ui/common/label';
import { Card } from '@/components/ui/common/card';
import { AnimatedSection } from '@/components/ui/common/AnimatedSection';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { mockAuthService } from '@/services/mockAuth';
import { Toast } from '@/components/ui/common/Toast';
import { SEO } from '@/components/seo/SEO';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = isLogin
        ? await mockAuthService.login(identifier, password)
        : await mockAuthService.register(identifier, username, password);

      if (response.success && response.user) {
        login(response.user);
        Toast.success(
          isLogin ? 'Welcome back!' : 'Account created successfully',
          'You are now signed in'
        );

        // Navigate to the page they were trying to access, or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(response.error || 'An error occurred');
        Toast.error('Authentication Failed', response.error || 'Please check your credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      Toast.error('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} - Tribes</title>
        <meta name="description" content={`${isLogin ? 'Login' : 'Sign up'} to your private social platform`} />
      </Helmet>
      <SEO
        title={isLogin ? 'Sign In' : 'Create Account'}
        description={
          isLogin
            ? 'Sign in to your Tribes account to access private communities and connect with like-minded individuals.'
            : 'Create your Tribes account to join exclusive communities and connect with people who share your interests.'
        }
        keywords="sign in, login, create account, register, tribes platform, private communities"
        type="website"
      />
      <div className={cn("relative min-h-screen overflow-hidden bg-background")}>
        {/* Animated background elements */}
        <div 
          className={cn("absolute inset-0 opacity-30")}
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.3) 0%, transparent 60%)`
          }}
        />
        <div className={cn(
          "absolute inset-0",
          "bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]",
          "bg-[size:24px_24px]"
        )} />
        <div className={cn(
          "absolute left-0 right-0 top-0 -z-10 m-auto",
          "h-[310px] w-[310px] rounded-full",
          "bg-primary/10 opacity-30 blur-[100px]"
        )} />

        {/* Main content */}
        <div className={cn("relative flex min-h-screen items-center justify-center p-4")}>
          <AnimatedSection className={cn("w-full max-w-[420px]")}>
            <Card className={cn(
              "relative overflow-hidden",
              "border-primary/10 bg-background/80",
              "shadow-xl backdrop-blur-xl"
            )}>
              {/* Subtle border gradient */}
              <div className={cn(
                "absolute inset-0 rounded-lg",
                "bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"
              )} />

              <div className={cn("relative space-y-6 p-8")}>
                {/* Decorative elements */}
                <div className={cn(
                  "absolute right-4 top-4",
                  "h-20 w-20 rounded-full",
                  "bg-primary/5 blur-3xl"
                )} />
                <div className={cn(
                  "absolute left-8 top-8",
                  "h-2 w-2 rounded-full",
                  "bg-primary/30"
                )} />
                <div className={cn(
                  "absolute right-12 bottom-12",
                  "h-3 w-3 rounded-full",
                  "bg-primary/20"
                )} />

                {/* Header */}
                <div className="relative">
                  <h2 className={cn(
                    "text-center text-3xl font-bold tracking-tight",
                    "bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent"
                  )}>
                    {isLogin ? 'Welcome to Tribes' : 'Join Tribes'}
                  </h2>
                  <p className={cn("mt-3 text-center text-sm text-muted-foreground")}>
                    {isLogin 
                      ? 'Enter the collective. Your tribes await.' 
                      : 'Create your space in the digital realm.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={cn("space-y-4")}>
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="identifier">
                      {isLogin ? 'Email or Username' : 'Email'}
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        isLogin 
                          ? "Enter your email or username" 
                          : "Enter your email"
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {!isLogin && (
                    <div className={cn("space-y-2")}>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a unique username"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    cosmic={true}  // Enable cosmic effects
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">Loading...</span>
                      </span>
                    ) : (
                      isLogin ? 'Sign In' : 'Sign Up'
                    )}
                  </Button>
                </form>

                {/* Toggle */}
                <div className={cn("text-center text-sm")}>
                  <p className={cn("text-muted-foreground")}>
                    {isLogin 
                      ? "New to the collective? " 
                      : "Already part of Tribes? "}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className={cn(
                        "font-medium text-primary",
                        "hover:text-primary/80"
                      )}
                    >
                      {isLogin ? 'Join now' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};

export default AuthPage;

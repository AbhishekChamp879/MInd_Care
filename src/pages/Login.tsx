import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/layout/Footer';
import { Heart, Mail, Lock, User, Shield, GraduationCap } from 'lucide-react';
import { LoginCredentials } from '@/types/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'student',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(credentials);

    if (success) {
      toast({
        title: 'Welcome to MindBuddy!',
        description: `Logged in successfully as ${credentials.role}.`,
      });
      navigate('/');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = (role: 'student' | 'counselor' | 'admin') => {
    // Auto-fill credentials for demo
    const demoCredentials = {
      student: { email: 'student@mindbuddy.com', password: 'student123' },
      counselor: { email: 'counselor@mindbuddy.com', password: 'counselor123' },
      admin: { email: 'admin@mindbuddy.com', password: 'admin123' },
    };

    setCredentials({
      ...demoCredentials[role],
      role,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'counselor':
        return <Heart className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'student':
        return 'Access AI support, book sessions, and join peer forums';
      case 'counselor':
        return 'Manage sessions, provide support, and access resources';
      case 'admin':
        return 'View analytics, manage users, and oversee platform';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-calm p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="flex items-center justify-center space-x-2 group">
            <Heart className="h-10 w-10 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindBuddy
            </span>
          </Link>
          <p className="text-muted-foreground">Your trusted mental health companion</p>
        </div>

        <Card className="shadow-trust">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Choose your role to access your personalized dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="student"
                  onClick={() => handleRoleChange('student')}
                  className="flex items-center space-x-1"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Student</span>
                </TabsTrigger>
                <TabsTrigger
                  value="counselor"
                  onClick={() => handleRoleChange('counselor')}
                  className="flex items-center space-x-1"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Counselor</span>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  onClick={() => handleRoleChange('admin')}
                  className="flex items-center space-x-1"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              {(['student', 'counselor', 'admin'] as const).map((role) => (
                <TabsContent key={role} value={role} className="space-y-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      {getRoleIcon(role)}
                      <span className="font-medium capitalize">{role} Portal</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{getRoleDescription(role)}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials Helper */}
            <div className="mt-6 p-3 bg-primary-light/20 rounded-lg text-sm">
              <p className="font-medium text-center mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p>
                  <strong>Student:</strong> student@mindbuddy.com / student123
                </p>
                <p>
                  <strong>Counselor:</strong> counselor@mindbuddy.com / counselor123
                </p>
                <p>
                  <strong>Admin:</strong> admin@mindbuddy.com / admin123
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2 text-xs text-muted-foreground">
          <p>🔒 Your privacy is protected with end-to-end encryption</p>
          <p>💬 Confidential support available 24/7</p>
          <p>🏥 HIPAA compliant and stigma-free environment</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

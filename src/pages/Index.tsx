import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Footer from '@/components/layout/Footer';
import heroImage from '@/assets/freepik__retouch__90823.png';
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Shield,
  Lock,
  Heart,
  CheckCircle,
  Phone,
  Globe,
  Zap,
  Star,
  ChevronDown,
  Award,
  TrendingUp,
  UserCheck,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  Quote,
  Play,
} from 'lucide-react';
import { useState, useEffect, ComponentType, SVGProps } from 'react';
import type { User } from '@/types/auth';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  // Check if user just logged in and should see a welcome back message
  useEffect(() => {
    if (!isLoading && user) {
      // Check if this is a fresh visit (not a redirect)
      const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
      if (!hasSeenLanding) {
        setShowWelcomeBack(true);
        sessionStorage.setItem('hasSeenLanding', 'true');
      }
    }
  }, [user, isLoading]);

  // Show loading spinner while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading MindBuddy...</p>
        </div>
      </div>
    );
  }

  // Always show the landing page, but customize content based on auth status
  return user ? (
    <AuthenticatedHomePage user={user} showWelcomeBack={showWelcomeBack} />
  ) : (
    <GuestHomePage />
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <div className="w-1 h-1 bg-primary rounded-full shadow-glow"></div>
        </div>
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // 60 fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// Authenticated Landing Page for returning users
const AuthenticatedHomePage = ({
  user,
  showWelcomeBack,
}: {
  user: User;
  showWelcomeBack: boolean;
}) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    switch (user.role) {
      case 'student':
        return '/app/student-dashboard';
      case 'counselor':
        return '/app/sessions';
      case 'admin':
        return '/app/dashboard';
      default:
        return '/app/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <FloatingParticles />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              MindBuddy
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome back, {user.name.split(' ')[0]}
            </span>
            <Button asChild className="bg-gradient-primary hover:shadow-glow">
              <Link to={getDashboardPath()}>Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Back Hero */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            {showWelcomeBack && (
              <Badge className="bg-primary text-primary-foreground text-sm px-4 py-2">
                <Heart className="h-4 w-4 mr-2" />
                Welcome back to your wellness journey!
              </Badge>
            )}

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-heading">Ready to continue your</span>
                <br />
                <span className="bg-gradient-aurora bg-clip-text text-transparent">
                  mental wellness journey?
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your personalized mental health support system is ready. Access AI chat, book
                sessions, and connect with your supportive community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-4 rounded-full"
                >
                  <Link to={getDashboardPath()}>
                    Go to My Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 rounded-full"
                >
                  <Link to="/app/chat">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Quick AI Chat
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards for Authenticated Users */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Your Wellness Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick access to all your mental health resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="calm-card group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">AI Chat Support</CardTitle>
                <CardDescription>24/7 intelligent mental health assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-primary">
                  <Link to="/app/chat">Start Chatting</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="calm-card group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/10 w-fit">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Book Session</CardTitle>
                <CardDescription>Schedule with professional counselors</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/app/booking">Book Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="calm-card group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Resources</CardTitle>
                <CardDescription>Self-help materials and wellness tools</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/app/resources">Explore</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="calm-card group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/10 w-fit">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
                <CardDescription>Connect with supportive peer network</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/app/forum">Join Forum</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Support - Always Visible */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-800">Crisis Support Available 24/7</h2>
            </div>
            <p className="text-red-700 text-lg leading-relaxed">
              If you're experiencing a mental health emergency, immediate help is available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive" size="lg" className="text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                Crisis Line: 988
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-700 hover:bg-red-50 text-lg px-8"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Emergency Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const GuestHomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Anonymous',
      role: 'Computer Science Student',
      content:
        'MindBuddy helped me through my toughest semester. The AI chat was there when I needed it most at 3 AM during finals week.',
      rating: 5,
    },
    {
      name: 'Anonymous',
      role: 'Psychology Major',
      content:
        'The counseling sessions are incredibly professional and confidential. It removed the stigma I felt about seeking help.',
      rating: 5,
    },
    {
      name: 'Anonymous',
      role: 'Engineering Student',
      content:
        "The peer support forum connected me with others who understood what I was going through. I'm not alone anymore.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen">
      {/* Guest Header with Theme Toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              MindBuddy
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild variant="default" className="bg-gradient-primary hover:shadow-glow ">
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 sm:pt-28 lg:pt-32 sm:pb-24 lg:pb-28">
        <FloatingParticles />

        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />

        <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
          <div className="space-y-6 fade-in">
            <Badge
              variant="secondary"
              className="animate-pulse bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 10,000+ Students
            </Badge>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Your Mental Health
              <br />
              <span className="bg-gradient-aurora bg-clip-text text-transparent">Matters Most</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto font-medium leading-relaxed">
              Experience stigma-free, confidential mental health support designed specifically for
              students. Get immediate AI assistance, book professional counseling, and connect with
              a supportive community.
            </p>
          </div>

          <div className="flex justify-center items-center slide-up">
            <Button
              asChild
              size="xl"
              className="text-lg bg-gradient-primary hover:shadow-glow btn-enhanced "
            >
              <Link to="/login">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 pb-8 sm:pb-12 max-w-4xl mx-auto px-2 sm:px-4">
            {[
              { icon: Shield, text: 'HIPAA Compliant', desc: 'Privacy Protected' },
              { icon: Clock, text: '24/7 Available', desc: 'Always Here' },
              { icon: Heart, text: 'Stigma-Free', desc: 'Safe Space' },
              { icon: UserCheck, text: 'Licensed Staff', desc: 'Professional Care' },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-lg text-center hover:scale-105 transition-all duration-300"
              >
                <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm font-semibold">{item.text}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-calm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Real Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how MindBuddy is transforming student mental health support across campuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                number: 10000,
                suffix: '+',
                label: 'Students Helped',
                description: 'Across 200+ Universities',
              },
              {
                icon: MessageCircle,
                number: 95,
                suffix: '%',
                label: 'Crisis Detection Rate',
                description: 'AI-Powered Screening',
              },
              {
                icon: Heart,
                number: 4.9,
                suffix: '/5',
                label: 'Satisfaction Rating',
                description: 'From Our Students',
              },
              {
                icon: TrendingUp,
                number: 78,
                suffix: '%',
                label: 'Improved Wellbeing',
                description: 'Within First Month',
              },
            ].map((stat, index) => (
              <div key={index} className="enhanced-card p-6 text-center">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="learn-more" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="h-4 w-4 mr-2" />
              Award-Winning Platform
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive, evidence-based support designed specifically for students, backed by
              mental health professionals and cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <FeatureCard
              icon={MessageCircle}
              title="AI Crisis Detection"
              description="Advanced PHQ-9 and GAD-7 screening with immediate crisis intervention and professional referrals"
              badge="Instant Help"
              features={['24/7 Availability', 'Crisis Detection', 'Immediate Response']}
            />
            <FeatureCard
              icon={Calendar}
              title="Professional Counseling"
              description="Licensed therapists and counselors available for confidential sessions with flexible scheduling"
              badge="Licensed Care"
              features={['Licensed Therapists', 'Flexible Scheduling', 'Complete Privacy']}
            />
            <FeatureCard
              icon={BookOpen}
              title="Wellness Resources"
              description="Evidence-based materials, guided meditations, stress management tools, and academic support"
              badge="Self-Help Tools"
              features={['Guided Meditation', 'Study Tips', 'Stress Management']}
            />
            <FeatureCard
              icon={Users}
              title="Peer Community"
              description="Anonymous support groups, peer mentorship, and moderated discussions in a safe environment"
              badge="Safe Community"
              features={['Anonymous Groups', 'Peer Mentors', 'Moderated Chats']}
            />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-primary p-8 rounded-2xl text-white mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-sm">
                Ready to Start Your Wellness Journey?
              </h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Join thousands of students who have found support, community, and professional care
                through MindBuddy.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/login">
                  Begin Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-mesh">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Are Saying</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from students who found support through MindBuddy.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="enhanced-card p-8 md:p-12 text-center relative overflow-hidden">
              <Quote className="h-16 w-16 text-primary/20 absolute top-4 left-4" />

              <div className="space-y-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>

                <div className="pt-4 border-t">
                  <div className="font-semibold text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial ? 'bg-primary' : 'bg-primary/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about MindBuddy's mental health support services.
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is MindBuddy completely confidential?"
              answer="Absolutely. We adhere to strict HIPAA compliance standards. Your conversations with our AI chat, counseling sessions, and forum participation are completely confidential. We never share personal information without your explicit consent."
            />
            <FAQItem
              question="How does the AI crisis detection work?"
              answer="Our AI uses validated screening tools like PHQ-9 and GAD-7 to assess your responses during chat sessions. If crisis indicators are detected, we immediately connect you with emergency resources and licensed counselors who can provide immediate support."
            />
            <FAQItem
              question="Are the counselors real licensed professionals?"
              answer="Yes, all our counselors and therapists are licensed mental health professionals. They undergo rigorous background checks and are specifically trained to work with college students and young adults."
            />
            <FAQItem
              question="Is MindBuddy free for students?"
              answer="We offer a comprehensive free tier that includes AI chat support, basic resources, and forum access. Premium features like one-on-one counseling sessions may have associated costs, but we work with universities to provide these at reduced rates."
            />
            <FAQItem
              question="Can I remain anonymous on the platform?"
              answer="Yes, especially in our peer support forums. While we need some basic information for safety and crisis prevention, you can participate in community discussions anonymously while still receiving the support you need."
            />
            <FAQItem
              question="What if I'm having a mental health emergency?"
              answer="If you're in immediate danger, please call 911 or go to your nearest emergency room. Our platform includes immediate crisis resources and can connect you with emergency services. We also provide 24/7 crisis chat support for urgent situations."
            />
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Still have questions? We're here to help.</p>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Contact Support
                <MessageCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section (enhanced layout + illustration) */}
      <section className="py-20 px-4 bg-primary/5 dark:bg-primary/10">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-6 md:p-12 shadow-card relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-foreground">
                  Start Your Wellness Journey Today
                </h2>

                <p className="text-base md:text-lg opacity-95 leading-relaxed mb-6 text-white/95">
                  Join thousands of students for stigma-free, confidential mental health support —
                  instantly accessible and backed by licensed professionals.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground mr-3 shadow-sm">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-white/90">
                      24/7 AI-assisted support and crisis detection
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground mr-3 shadow-sm">
                      <Shield className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-white/90">
                      HIPAA-compliant privacy and secure sessions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground mr-3 shadow-sm">
                      <UserCheck className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-white/90">
                      Licensed counselors and a supportive peer community
                    </span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="xl"
                    className="text-lg text-white align-middle px-8 py-4 rounded-full shadow-md"
                  >
                    <Link
                      to="/login"
                      className="bg-gradient-primary"
                      aria-label="Get started - free"
                    >
                      Get Started — It's Free
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="text-lg border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full"
                  >
                    <Link to="/about" aria-label="Learn about our mission">
                      Our Mission
                      <Target className="ml-3 h-5 w-5 text-muted-foreground" />
                    </Link>
                  </Button>
                </div>

                <div className="pt-6 text-xs text-muted-foreground">
                  <p>Available 24/7 • HIPAA Compliant • Licensed Professionals</p>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <img
                  src={heroImage}
                  alt="Wellness illustration"
                  className="w-72 md:w-96 lg:w-[520px] h-72 md:h-96 lg:h-[520px] object-cover rounded-xl shadow-card gentle-transition gentle-hover"
                />
              </div>
            </div>

            <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
              <Heart className="h-44 w-44 text-primary/20" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  variant?: string;
  badge?: string;
}

const ActionCard = ({
  title,
  description,
  icon: Icon,
  href,
  variant = 'default',
  badge,
}: ActionCardProps) => {
  return (
    <Card className="enhanced-card fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="hero" className="w-full btn-enhanced">
          <Link to={href}>Access Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  badge: string;
  features?: string[];
}

const FeatureCard = ({ icon: Icon, title, description, badge, features }: FeatureCardProps) => {
  return (
    <Card className="enhanced-card slide-up group hover:shadow-aurora transition-all duration-500">
      <CardHeader className="text-center relative">
        <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-fit group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 text-xs bg-gradient-primary text-white"
        >
          {badge}
        </Badge>
        <CardTitle className="text-xl mb-3">{title}</CardTitle>
        <CardDescription className="text-center leading-relaxed">{description}</CardDescription>

        {features && (
          <div className="mt-4 space-y-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-sm text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300"
        >
          <Link to="/login">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

interface StatsCardProps {
  title: string;
  stats: { label: string; value: string }[];
}

const StatsCard = ({ title, stats }: StatsCardProps) => {
  return (
    <Card className="enhanced-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="font-semibold text-primary">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="enhanced-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/10 transition-colors duration-200"
      >
        <h3 className="font-semibold text-lg pr-4">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <div className="text-muted-foreground leading-relaxed border-t pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default Index;

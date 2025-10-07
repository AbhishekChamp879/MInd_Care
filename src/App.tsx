import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import Layout from '@/components/layout/Layout';
import ChatWidget from '@/components/chat/ChatWidget';
import NotificationContainer from '@/components/notifications/NotificationContainer';
import { lazy, Suspense, useEffect } from 'react';
import ScrollToTop from './components/layout/scrollToTop';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const InstitutionSelection = lazy(() => import('./pages/InstitutionSelection'));
const Resources = lazy(() => import('./pages/Resources'));
const Forum = lazy(() => import('./pages/Forum'));
const Booking = lazy(() => import('./pages/Booking'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const SystemHealth = lazy(() => import('./pages/SystemHealth'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const ContentModeration = lazy(() => import('./pages/ContentModeration'));
const Sessions = lazy(() => import('./pages/Sessions'));
const AIChat = lazy(() => import('./pages/AIChat'));
const BreathingExercises = lazy(() => import('./pages/BreathingExercises'));
const NotificationSettings = lazy(() => import('./components/settings/NotificationSettings'));
const EnhancedThemeSettings = lazy(() => import('./components/settings/EnhancedThemeSettings'));
const QuickMoodShowcase = lazy(() => import('./components/dashboard/QuickMoodShowcase'));
const FeedbackDemo = lazy(() => import('./pages/FeedbackDemo'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ContactUs = lazy(() => import('./pages/ContactUs'));

// ✅ New: MentalHealthBlog
const MentalHealthBlog = lazy(() => import('./pages/MentalHealthBlog'));

// ✅ New: Error Boundary Demo
const ErrorBoundaryDemo = lazy(() => import('./pages/ErrorBoundaryDemo'));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary
    variant="critical"
    componentName="App"
    showCrisisResources={true}
    onError={(error, errorInfo, errorId) => {
      console.error('Application Error:', { error, errorInfo, errorId });
    }}
  >
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <MusicProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <PageErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="space-y-4 text-center">
                          <div className="animate-pulse">
                            <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2" />
                            <div className="text-muted-foreground">Loading Mind Care...</div>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/select-institution" element={<InstitutionSelection />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/app" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="student-dashboard" element={<StudentDashboard />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="forum" element={<Forum />} />
                    <Route path="blog" element={<MentalHealthBlog />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="breathing" element={<BreathingExercises />} />
                    <Route path="notifications" element={<NotificationSettings />} />
                    <Route path="theme-settings" element={<EnhancedThemeSettings />} />
                    <Route path="mood-showcase" element={<QuickMoodShowcase />} />
                    <Route path="feedback-demo" element={<FeedbackDemo />} />
                    <Route path="system" element={<SystemHealth />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="moderation" element={<ContentModeration />} />
                    <Route path="chat" element={<AIChat />} />
                    <Route path="error-demo" element={<ErrorBoundaryDemo />} />

                    <Route path="*" element={<NotFound />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  </Route>
                </Routes>
                  </Suspense>
                </PageErrorBoundary>
                <ChatWidget />
                <NotificationContainer />
                {/* Scroll-to-Top button */}
                <ScrollToTop />
              </BrowserRouter>
            </TooltipProvider>
          </MusicProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);


export default App;

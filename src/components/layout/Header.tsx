import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import QuickMoodHeader from '@/components/dashboard/QuickMoodHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Globe,
  Phone,
  BarChart,
  Palette,
  Bell,
  Music2,
  FileText, // ✅ icon for blog
  LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
      const baseItems: NavItem[] = [
      { name: 'Resources', href: '/app/resources', icon: BookOpen },
      { name: 'Forum', href: '/app/forum', icon: Users },
      { name: 'Blog', href: '/app/blog', icon: FileText }, 
      { name: 'About', href: '/about', icon: Globe },
    ];

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/app/student-dashboard', icon: BarChart },
        { name: 'Chat', href: '/app/chat', icon: MessageCircle },
        { name: 'Book Session', href: '/app/booking', icon: Calendar },
        ...baseItems,
      ];
    }

    if (user?.role === 'counselor') {
      return [
        { name: 'Sessions', href: '/app/sessions', icon: Calendar },
        { name: 'Chat Support', href: '/app/chat', icon: MessageCircle },
        ...baseItems,
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/app/dashboard', icon: BarChart },
        { name: 'Sessions', href: '/app/sessions', icon: Calendar },
        { name: 'Users', href: '/app/users', icon: Users },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return '??';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '??';
    
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    const firstInitial = words[0][0].toUpperCase();
    const lastInitial = words[words.length - 1][0].toUpperCase();
    
    return firstInitial + lastInitial;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-subtle">
      <div className="container flex h-20 items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 mr-10 group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 gentle-transition">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <span className="hidden font-bold text-2xl sm:inline-block text-primary">MindBuddy</span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent gentle-transition"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Quick Mood Header - Only for students */}
          {user?.role === 'student' && (
            <div className="hidden md:block">
              <QuickMoodHeader variant="dropdown" showTrend={false} />
            </div>
          )}

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative rounded-lg bg-muted/50 hover:bg-muted gentle-transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200 group p-1"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white/10 backdrop-blur-2xl border-white/20 shadow-floating rounded-2xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-base font-semibold leading-none text-foreground">
                      {user.name}
                    </p>
                    <p className="text-sm leading-none text-muted-foreground capitalize bg-primary/10 px-2 py-1 rounded-lg inline-block w-fit">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/app/profile"
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <User className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/app/notifications"
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Bell className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/app/theme-settings"
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Palette className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Theme & Reading</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/contact"
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Phone className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Contact</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/app/settings"
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Settings className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 p-3 rounded-lg gentle-transition"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="premium"
              size="lg"
              className="shadow-floating hover:shadow-premium"
            >
              <Link to="/login" className="font-semibold">
                Get Started
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/80 backdrop-blur-sm fade-in">
          <div className="container py-6 px-6">
            {user ? (
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <ThemeToggle />
                </div>
              </nav>
            ) : (
              <div className="flex flex-col space-y-4">
                <ThemeToggle />
                <Button
                  asChild
                  variant="premium"
                  size="lg"
                  className="w-full shadow-floating hover:shadow-premium"
                >
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

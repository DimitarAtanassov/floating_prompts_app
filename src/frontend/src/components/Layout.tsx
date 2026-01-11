import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  FileText, 
  Box, 
  Cpu, 
  Play, 
  Menu, 
  X,
  Home,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/templates', label: 'Templates', icon: FileText },
  { path: '/prompts', label: 'Prompts', icon: Box },
  { path: '/models', label: 'Models', icon: Cpu },
  { path: '/playground', label: 'Playground', icon: Play },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get current page for breadcrumb
  const currentPage = navItems.find(item => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-sky-mesh">
      {/* Floating cloud decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-20 bg-white/30 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-48 h-24 bg-white/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-40 left-1/4 w-40 h-20 bg-sky-100/40 rounded-full blur-2xl animate-float" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Cloud className="w-8 h-8 text-sky-500 group-hover:text-sky-600 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-400 rounded-full animate-pulse-soft" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                floating prompts
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-sky-500 text-white shadow-cloud' 
                        : 'text-sky-700 hover:bg-sky-100 hover:text-sky-800'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-sky-600 hover:bg-sky-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl text-sky-600 hover:bg-sky-100 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-sky-600 hover:bg-sky-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sky-100 bg-white/95 backdrop-blur-lg">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-sky-500 text-white' 
                        : 'text-sky-700 hover:bg-sky-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      {currentPage && currentPage.path !== '/' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-sky-600 hover:text-sky-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-sky-300" />
            <span className="text-sky-900 font-medium">{currentPage.label}</span>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-sky-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sky-600">
              <Cloud className="w-5 h-5" />
              <span className="text-sm">floating prompts v0.1.0</span>
            </div>
            <p className="text-sm text-sky-500">
              Built for teams who take their prompts seriously
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
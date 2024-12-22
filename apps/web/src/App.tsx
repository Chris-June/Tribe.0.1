import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Users, LogIn, LogOut, User, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import { ToastProvider } from '@/components/ui/common/Toast';
import { useAuthStore } from '@/stores/authStore';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import './App.css';

function App() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="App min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors group"
                >
                  <Home 
                    size={20} 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                  />
                  <span className="font-semibold text-sm tracking-tight">Tribes</span>
                </Link>
              </div>

              <nav className="flex items-center space-x-4">
                <Link 
                  to="/tribes" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Users 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                  />
                  <span className="text-sm">Tribes</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <User 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                  />
                  <span className="text-sm">Profile</span>
                </Link>
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <LogOut 
                      size={16} 
                      className="text-muted-foreground group-hover:text-primary transition-colors" 
                    />
                    <span className="text-sm">Logout</span>
                  </button>
                ) : (
                  <Link 
                    to="/auth" 
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <LogIn 
                      size={16} 
                      className="text-muted-foreground group-hover:text-primary transition-colors" 
                    />
                    <span className="text-sm">Login</span>
                  </Link>
                )}
              </nav>

              <div className="flex items-center space-x-4">
                {/* Future expansion area for user actions, notifications, etc. */}
                <button 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Settings"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </header>
          
          <main className="container mx-auto flex-grow px-4 py-6">
            <Outlet />
          </main>
          
          <footer className="mt-auto border-t bg-card/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Social Media Icons */}
                <div className="flex items-center space-x-4">
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                </div>

                <p className="text-sm text-muted-foreground">
                  &#169; 2024 Tribes. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Powered by</span>
                  <a 
                    href="https://home.intellisyncsolutions.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Intellisync Solutions
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

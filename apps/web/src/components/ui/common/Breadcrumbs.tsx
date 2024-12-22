import React, { createContext, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

// Create a context for breadcrumbs
const BreadcrumbContext = createContext<{
  items: BreadcrumbItem[];
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (label: string) => void;
}>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
});

// Provider component
export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([
    { 
      label: 'Home', 
      path: '/', 
      icon: <Home size={16} /> 
    }
  ]);

  const addItem = (newItem: BreadcrumbItem) => {
    setItems(prevItems => {
      // Prevent duplicates
      const existingItemIndex = prevItems.findIndex(item => item.label === newItem.label);
      if (existingItemIndex !== -1) {
        return prevItems;
      }
      return [...prevItems, newItem];
    });
  };

  const removeItem = (labelToRemove: string) => {
    setItems(prevItems => prevItems.filter(item => item.label !== labelToRemove));
  };

  return (
    <BreadcrumbContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// Custom hook to use breadcrumb context
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};

const generateUniqueBreadcrumbKey = (item: BreadcrumbItem, index: number): string => {
  // Combine path, label, and index to ensure uniqueness
  const basePath = item.path ?? 'breadcrumb';
  const baseLabel = item.label.toLowerCase().replace(/\s+/g, '-');
  return `${basePath}-${baseLabel}-${index}`;
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  separator = <ChevronRight size={16} />,
  className
}) => {
  const location = useLocation();
  const { items: contextItems } = useBreadcrumbs();

  // Dynamically generate breadcrumbs based on current route
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        label: 'Home', 
        path: '/', 
        icon: <Home size={16} /> 
      }
    ];

    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      breadcrumbs.push({ 
        label, 
        path: routeTo 
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = [...contextItems, ...generateBreadcrumbs()];

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground",
        className
      )}
    >
      <AnimatePresence>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={generateUniqueBreadcrumbKey(crumb, index)}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              {index > 0 && (
                <span className="mx-2 text-muted-foreground">
                  {separator}
                </span>
              )}
              
              {crumb.path ? (
                <Link 
                  to={crumb.path} 
                  className={cn(
                    "flex items-center gap-2 hover:text-primary transition-colors",
                    index === breadcrumbs.length - 1 
                      ? "text-primary font-semibold" 
                      : "text-muted-foreground"
                  )}
                >
                  {crumb.icon}
                  {crumb.label}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  {crumb.icon}
                  {crumb.label}
                </span>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
    </nav>
  );
};

// Dropdown Breadcrumbs for more complex navigation
export const DropdownBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { items: contextItems } = useBreadcrumbs();

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className={cn("relative", className)}>
      <button 
        onClick={handleToggle}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
      >
        <Home size={16} />
        Navigation
        <ChevronDown 
          size={16} 
          className={cn(
            "transition-transform", 
            isOpen ? "rotate-180" : "rotate-0"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border"
          >
            <ul className="py-1">
              {[...contextItems, 
                { label: 'Home', path: '/' },
                { label: 'Tribes', path: '/tribes' },
                { label: 'Profile', path: '/profile' },
                { label: 'Authentication', path: '/auth' }
              ].map((item, index) => (
                <li key={generateUniqueBreadcrumbKey(item, index)}>
                  <Link
                    to={item.path ?? '/'}
                    className={cn(
                      "block px-4 py-2 hover:bg-secondary/10",
                      location.pathname === item.path 
                        ? "bg-secondary/10 text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

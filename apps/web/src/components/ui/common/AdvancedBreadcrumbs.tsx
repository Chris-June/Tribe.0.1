import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export const useBreadcrumb = (initialItems: BreadcrumbItem[] = []) => {
  const [items, setItems] = React.useState<BreadcrumbItem[]>(initialItems);

  const addCustomBreadcrumb = (newItem: BreadcrumbItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeCustomBreadcrumb = (labelToRemove: string) => {
    setItems(prevItems => prevItems.filter(item => item.label !== labelToRemove));
  };

  return {
    render: () => (
      <nav aria-label="Breadcrumb" className="flex">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.path ? (
              <Link 
                to={item.path} 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    ),
    addCustomBreadcrumb,
    removeCustomBreadcrumb
  } as const;
};

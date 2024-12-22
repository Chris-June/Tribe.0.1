import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import page components
import App from './App';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import TribesPage from './pages/TribesPage';
import ProfilePage from './pages/ProfilePage';
import DynamicTribePage from './pages/DynamicTribePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'tribes',
        element: (
          <ProtectedRoute>
            <TribesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tribes/:tribeId',
        element: (
          <ProtectedRoute>
            <DynamicTribePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default router;

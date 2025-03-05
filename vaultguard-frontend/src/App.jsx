import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';

// Lazy load other components
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const PasswordsPage = React.lazy(() => import('./pages/passwords/PasswordsPage'));
const SecurityPage = React.lazy(() => import('./pages/security/SecurityPage'));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/register" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <RegisterPage />
              </React.Suspense>
            } 
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/passwords" replace />} />
            <Route 
              path="passwords" 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <PasswordsPage />
                </React.Suspense>
              } 
            />
            <Route 
              path="security" 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <SecurityPage />
                </React.Suspense>
              } 
            />
            <Route 
              path="settings" 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <SettingsPage />
                </React.Suspense>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

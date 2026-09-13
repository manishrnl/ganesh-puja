import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CommitteePage from './pages/CommitteePage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import MediaViewerPage from './pages/MediaViewerPage';
import DashboardPage from './pages/DashboardPage';
import DonatePage from './pages/DonatePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AccountantDashboardPage from './pages/AccountantDashboardPage';
import AdminCommitteePage from './pages/AdminCommitteePage';
import AccountingPage from './pages/AccountingPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/committee" element={<CommitteePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<MediaViewerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/committee"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCommitteePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant"
              element={
                <ProtectedRoute requiredRole="accountant">
                  <AccountantDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/records"
              element={
                <ProtectedRoute requiredRole="accountant">
                  <AccountingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AppProvider>
    </AuthProvider>
  );
}

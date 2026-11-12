import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './style.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminCourseForm from './pages/AdminCourseForm';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import CourseLearning from './pages/CourseLearning';
import Achievements from './pages/Achievements';
import AdminUsers from './pages/AdminUsers';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading your admin workspace...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

function StudentRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading your learning space...</div>;
  if (!user || user.role !== 'user') return <Navigate to="/login" replace />;
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/achievements" element={<StudentRoute><Achievements /></StudentRoute>} />
          <Route path="/courses/:courseId/learn" element={<StudentRoute><CourseLearning /></StudentRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/admin/courses/new" element={<AdminRoute><AdminCourseForm /></AdminRoute>} />
          <Route path="/admin/courses/:id/edit" element={<AdminRoute><AdminCourseForm /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

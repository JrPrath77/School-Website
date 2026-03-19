import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GalleryManager from './pages/GalleryManager.jsx';
import EventManager from './pages/EventManager.jsx';
import VideoManager from './pages/VideoManager.jsx';
import NoticeManager from './pages/NoticeManager.jsx';
import AISettings from './pages/AISettings.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import StaffManager from './pages/StaffManager.jsx';
import EnquiryManager from './pages/EnquiryManager.jsx';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { admin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<EventManager />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="/videos" element={<VideoManager />} />
        <Route path="/notices" element={<NoticeManager />} />
        <Route path="/staff" element={<StaffManager />} />
        <Route path="/enquiries" element={<EnquiryManager />} />
        <Route path="/ai-settings" element={<AISettings />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

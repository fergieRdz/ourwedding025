import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Guests     from './pages/Guests';
import Budget     from './pages/Budget';
import Tables     from './pages/Tables';
import Calendar   from './pages/Calendar';
import Todos      from './pages/Todos';
import Suppliers  from './pages/Suppliers';
import Moodboard  from './pages/Moodboard';
import Shopping   from './pages/Shopping';
import Honeymoon  from './pages/Honeymoon';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/guests"     element={<PrivateRoute><Guests /></PrivateRoute>} />
          <Route path="/budget"     element={<PrivateRoute><Budget /></PrivateRoute>} />
          <Route path="/tables"     element={<PrivateRoute><Tables /></PrivateRoute>} />
          <Route path="/calendar"   element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/todos"      element={<PrivateRoute><Todos /></PrivateRoute>} />
          <Route path="/suppliers"  element={<PrivateRoute><Suppliers /></PrivateRoute>} />
          <Route path="/moodboard"  element={<PrivateRoute><Moodboard /></PrivateRoute>} />
          <Route path="/shopping"   element={<PrivateRoute><Shopping /></PrivateRoute>} />
          <Route path="/honeymoon"  element={<PrivateRoute><Honeymoon /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

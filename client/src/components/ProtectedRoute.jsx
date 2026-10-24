import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { LoadingState } from './States.jsx';
export default function ProtectedRoute({ children, role }) { const { user, ready } = useAuth(); const location = useLocation(); if (!ready) return <LoadingState label="Checking your account…" />; if (!user) return <Navigate to="/login" state={{ from: location }} replace />; if (role && user.role !== role) return <Navigate to="/" replace />; return children; }


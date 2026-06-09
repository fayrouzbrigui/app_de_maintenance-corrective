import { Outlet, Navigate } from 'react-router-dom';
import AlertAudioPlayer from './AlertAudioPlayer';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
    <AlertAudioPlayer />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
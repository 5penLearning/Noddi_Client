import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import SplashPage from '../pages/splash/SplashPage';
import Home from '../pages/Home';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default AppRouter;

import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import SplashPage from '../pages/splash/SplashPage';
import AppLayout from '../layouts/AppLayout';
import Home from '../pages/Home';
import TemporaryPage from '../pages/TemporaryPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<TemporaryPage title="프로젝트" />} />
        <Route path="/meetings" element={<TemporaryPage title="화상회의" />} />
        <Route path="/chat" element={<TemporaryPage title="채팅" />} />
        <Route path="/mypage" element={<TemporaryPage title="마이페이지" />} />
        <Route path="/settings" element={<TemporaryPage title="설정" />} />
        <Route path="*" element={<TemporaryPage title="페이지를 찾을 수 없습니다." />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;

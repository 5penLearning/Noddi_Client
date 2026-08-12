import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import SplashPage from '../pages/splash/SplashPage';

import AppLayout from '../layouts/AppLayout';

import Home from '../pages/Home';
import ProjectCreatePage from '../pages/ProjectCreatePage';
import ProjectPage from '../pages/ProjectPage';
import MeetingPage from '../pages/meeting/MeetingPage';
import MeetingRoomPage from '../pages/meeting/MeetingRoomPage';
import TemporaryPage from '../pages/TemporaryPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* 회의방은 전체 화면 */}
      <Route
        path="/meetings/:meetingId/room"
        element={<MeetingRoomPage />}
      />

      {/* 일반 서비스 화면 */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/new" element={<ProjectCreatePage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />

        <Route path="/meetings" element={<MeetingPage />} />

        <Route
          path="/chat"
          element={<TemporaryPage title="채팅" />}
        />

        <Route
          path="/mypage"
          element={<TemporaryPage title="마이페이지" />}
        />

        <Route
          path="/settings"
          element={<TemporaryPage title="설정" />}
        />

        <Route
          path="*"
          element={
            <TemporaryPage title="페이지를 찾을 수 없습니다." />
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRouter;

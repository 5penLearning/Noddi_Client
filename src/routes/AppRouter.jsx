import {
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import SplashPage from '../pages/splash/SplashPage';

import AppLayout from '../layouts/AppLayout';

import Home from '../pages/Home';
import MeetingPage from '../pages/meeting/MeetingPage';
import MeetingRoomPage from '../pages/meeting/MeetingRoomPage';
import MeetingSummaryPage from '../pages/meeting/MeetingSummaryPage';
import MyPage from '../pages/mypage/MyPage';
import ProfileSettingsPage from '../pages/mypage/ProfileSettingsPage';
import ProjectCreatePage from '../pages/ProjectCreatePage';
import ProjectPage from '../pages/ProjectPage';
import QAPage from '../pages/qa/QAPage';
import TemporaryPage from '../pages/TemporaryPage';

import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<SplashPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignUpPage />}
      />

      {/* 화상회의 전체 화면 */}
      <Route
        path="/meetings/:meetingId/room"
        element={
          <ProtectedRoute>
            <MeetingRoomPage />
          </ProtectedRoute>
        }
      />

      {/* 로그인 필요 서비스 화면 */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<ProjectPage />}
        />

        <Route
          path="/projects/new"
          element={<ProjectCreatePage />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectPage />}
        />

        <Route
          path="/meetings"
          element={<MeetingPage />}
        />

        <Route
          path="/meetings/:meetingId/summary"
          element={<MeetingSummaryPage />}
        />

        {/* 채팅 */}
        <Route
          path="/chat"
          element={
            <TemporaryPage title="채팅" />
          }
        />

        {/* Q&A */}
        <Route
          path="/qa"
          element={<QAPage />}
        />

        <Route
          path="/mypage"
          element={<MyPage />}
        />

        <Route
          path="/mypage/profile"
          element={<ProfileSettingsPage />}
        />

        <Route
          path="/settings"
          element={
            <TemporaryPage title="설정" />
          }
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

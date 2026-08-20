import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import SplashPage from '../pages/splash/SplashPage';

import AppLayout from '../layouts/AppLayout';

import Home from '../pages/home/Home';
import MeetingPage from '../pages/meeting/MeetingPage';
import MeetingRoomPage from '../pages/meeting/MeetingRoomPage';
import MyPage from '../pages/mypage/MyPage';
import ProfileSettingsPage from '../pages/mypage/ProfileSettingsPage';
import ProjectCreatePage from '../pages/project/ProjectCreatePage';
import ProjectPage from '../pages/project/ProjectPage';
import QAPage from '../pages/qa/QAPage';
import TeamMeetingRecordsPage from '../pages/project/TeamMeetingRecordsPage';
import TeamMeetingRecordDetailPage from '../pages/project/TeamMeetingRecordDetailPage';
import TemporaryPage from '../pages/TemporaryPage';

import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/signup" element={<SignUpPage />} />

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
        <Route path="/home" element={<Home />} />

        <Route path="/projects" element={<ProjectPage />} />

        <Route path="/projects/new" element={<ProjectCreatePage />} />

        <Route path="/projects/:projectId" element={<ProjectPage />} />

        <Route
          path="/projects/:projectId/teams/:teamId/meetings"
          element={<TeamMeetingRecordsPage />}
        />

        <Route
          path="/projects/:projectId/teams/:teamId/meetings/:meetingId"
          element={<TeamMeetingRecordDetailPage />}
        />

        <Route path="/meetings" element={<MeetingPage />} />

        <Route path="/meetings/:meetingId/record" element={<TeamMeetingRecordDetailPage />} />

        <Route path="/chat" element={<TemporaryPage title="채팅" />} />

        <Route path="/qa" element={<QAPage />} />

        <Route path="/mypage" element={<MyPage />} />

        <Route path="/mypage/profile" element={<ProfileSettingsPage />} />

        <Route path="*" element={<TemporaryPage title="페이지를 찾을 수 없습니다." />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;

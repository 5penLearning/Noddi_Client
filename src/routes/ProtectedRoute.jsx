import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { getAccessToken } from '../api/axios';

// 각 페이지마다 로그인을 검증하는 로직이 필요함

function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

  const accessToken =
    getAccessToken();

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;

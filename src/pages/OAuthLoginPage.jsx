import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OAuthLoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function OAuthLoginPage() {
  const navigate = useNavigate();

  // 이미 로그인된 세션이 있으면 대시보드로 바로 이동
  useEffect(() => {
    fetch(`${API_BASE}/api/me`, { credentials: 'include' })
      .then(res => {
        if (res.ok) navigate('/oauth/dashboard');
      })
      .catch(() => {}); // 미로그인 상태 → 무시
  }, [navigate]);

  const handleGoogleLogin = () => {
    // 브라우저를 백엔드 OAuth2 엔드포인트로 직접 이동 (AJAX가 아닌 redirect!)
    // Spring Security가 이 경로를 감지하여 자동으로 Google 로그인 페이지로 이동시켜줍니다.
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🔐</div>
        <h1 className="login-title">OAuth 2.0 실습</h1>
        <p className="login-subtitle">
          Google 계정으로 간편하게 로그인하세요
        </p>

        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 로그인
        </button>

        <div className="login-info">
          <p>📌 로그인 흐름 (OAuth 2.0 Authorization Code Grant)</p>
          <ol>
            <li>버튼 클릭 → 백엔드(<code>/oauth2/authorization/google</code>)로 이동</li>
            <li>백엔드 → Google 로그인 페이지로 리다이렉트</li>
            <li>Google 로그인 완료 → Authorization Code 발급</li>
            <li>백엔드가 Code로 Access Token 교환 → 유저 프로필 수신</li>
            <li><code>CustomOAuth2UserService</code>에서 DB 저장/업데이트</li>
            <li>로그인 성공 → 대시보드 페이지로 리다이렉트</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default OAuthLoginPage;

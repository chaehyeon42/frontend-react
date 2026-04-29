import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OAuthDashboardPage.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function OAuthDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  // 현재 로그인된 유저 정보 가져오기
  // credentials: 'include' → 세션 쿠키(JSESSIONID)를 같이 전송 (핵심!)
  useEffect(() => {
    fetch(`${API_BASE}/api/me`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401) {
          navigate('/oauth');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
        setLoading(false);
      })
      .catch(() => navigate('/oauth'));
  }, [navigate]);

  // DB에 저장된 전체 유저 목록 조회
  const fetchAllUsers = () => {
    fetch(`${API_BASE}/api/oauth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(setAllUsers)
      .catch(console.error);
  };

  // 로그아웃
  const handleLogout = () => {
    fetch(`${API_BASE}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(() => navigate('/oauth'));
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OAuth 2.0 실습 - 대시보드</h1>
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </header>

      <main className="dashboard-main">
        {/* 내 프로필 카드 */}
        <section className="profile-card">
          <h2>✅ 로그인 성공!</h2>
          {user?.picture && (
            <img src={user.picture} alt="프로필" className="profile-img" />
          )}
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">이름</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">이메일</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Google ID (sub)</span>
              <span className="info-value sub">{user?.sub}</span>
            </div>
          </div>
        </section>

        {/* DB 저장 확인 */}
        <section className="db-section">
          <h2>🗄️ DB 저장 확인</h2>
          <p>
            H2 콘솔에서 직접 확인:&nbsp;
            <a href="http://localhost:8080/h2-console" target="_blank" rel="noreferrer">
              http://localhost:8080/h2-console
            </a>
            &nbsp;→ JDBC URL: <code>jdbc:h2:mem:practicedb</code>
          </p>
          <button className="fetch-btn" onClick={fetchAllUsers}>
            DB 전체 유저 목록 조회
          </button>

          {allUsers.length > 0 && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th><th>이름</th><th>이메일</th><th>Provider</th><th>Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.provider}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default OAuthDashboardPage;

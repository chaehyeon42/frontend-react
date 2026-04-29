import React, { useState } from 'react';
import './CorsPage.css';

const API_BASE = import.meta.env.VITE_API_BASE;

// ============================================
// 🔥 실습 3 (학생 작성 공간)
// 전역변수(메모리)를 모듈 레벨에 선언해둡니다. (또는 React Context, Redux 등 활용 가능)
// 여기서는 가장 단순한 모듈 스코프 변수를 사용합니다.
// ============================================
let globalAccessToken = null;

function CorsPage() {
  const [greetingLog, setGreetingLog] = useState('');
  const [authLog, setAuthLog] = useState('');
  const [username, setUsername] = useState('student');

  const logTime = () => new Date().toLocaleTimeString() + ' -> ';

  // 1. GET 요청 (Greeting)
  const handleGetGreeting = () => {
    fetch(`${API_BASE}/api/cors/greeting`)
      .then(res => res.text())
      .then(data => setGreetingLog(`${logTime()} ${data}`))
      .catch(err => setGreetingLog(`${logTime()}[CORS 차단됨] ${err}`));
  };

  // 2. POST 요청 (JSON - Preflight 발생)
  const handlePostData = () => {
    fetch(`${API_BASE}/api/cors/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Hello Server!" })
    })
      .then(res => res.text())
      .then(data => setGreetingLog(`${logTime()}${data}`))
      .catch(err => setGreetingLog(`${logTime()}[OPTIONS(Preflight) 차단됨] ${err}`));
  };

  // 3. 로그인
  const handleLogin = () => {
    fetch(`${API_BASE}/api/cors/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => {
        if (!res.ok) throw new Error("CORS 인증 에러");
        return res.json();
      })
      .then(data => {
        // [AS-IS: 취약한 로컬스토리지 저장 방식]
        //localStorage.setItem('accessToken', data.accessToken);
        globalAccessToken = data.accessToken;
        setAuthLog(
          `${logTime()}로그인 성공!\n[주의] 현재: 로컬 스토리지에 저장되어 해커의 먹잇감이 되기 쉽습니다.`
        );

        // TODO [실습 3]: localStorage 저장 방식을 XSS 탈취가 불가능한 방식으로 교체하세요.
        //               모듈 상단에 선언된 변수를 활용하세요.
      })
      .catch(err => setAuthLog(`${logTime()}[로그인/CORS 에러] ${err}`));
  };

  // 😈 해커 버튼 (콘솔에서의 접근 흉내)
  const handleHackToken = () => {
    const stolenToken = localStorage.getItem('accessToken');
    if (stolenToken) {
      alert(`털림!! 당신의 로컬스토리지 토큰 획득:\n${stolenToken}`);
    } else {
      alert("털기 실패!! 로컬스토리지에 토큰이 없거나 전역 변수에 철저하게 숨겨져 있습니다.");
    }
  };

  // 4. 보안 API 요청 (토큰 및 쿠키 포함 보내기)
  const handleSecureApi = () => {
    // TODO [실습 3]: 아래 token 변수를 localStorage가 아닌 안전한 저장소에서 가져오도록 교체하세요.
    //    const token = localStorage.getItem('accessToken');
    const token = globalAccessToken;

    if (!token) {
      alert("토큰이 없습니다. 먼저 로그인하세요!");
      return;
    }

    fetch(`${API_BASE}/api/cors/secure/me`, {
      method: 'GET',
      credentials: 'include',
      // TODO [실습 3]: 서버에서 발급한 HttpOnly 쿠키가 요청에 포함되도록 fetch 옵션을 추가하세요.
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.text())
      .then(data => setAuthLog(`${logTime()}[보안된 데이터] ${data}`))
      .catch(err => setAuthLog(`${logTime()}[보안 API 실패 - Credentials CORS 에러 발생] ${err}`));
  };

  return (
    <div className="cors-page">
      <h1>CORS & 인증 보안 실습</h1>

      <div className="box">
        <h3>실습 1. @CrossOrigin 지역 설정 테스트</h3>
        <p>백엔드 특정 메서드에만 허용을 설정하고, GET은 성공하지만 POST는 여전히 차단되는 '부분 허용'의 특징을 확인합니다.</p>
        <button onClick={handleGetGreeting}>1. GET 가져오기 (성공 예상)</button>
        <button onClick={handlePostData}>2. POST 전송 (실패 예상 - Preflight 차단)</button>
        <textarea readOnly placeholder="응답 결과가 여기 표시됩니다..." value={greetingLog} />
      </div>

      <div className="box">
        <h3>실습 2. 전역 설정 및 인증 보안 테스트 (WebMvcConfigurer)</h3>
        <p>
          백엔드 전역 설정 완료 후, 프론트엔드에서도 <code>withCredentials</code> 옵션을 짝을 맞춰 설정해야 쿠키 공유가 가능합니다.
        </p>
        <div className="login-area">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" />
          <button onClick={handleLogin}>3. 로그인 (토큰 & 쿠키 발급)</button>
          <button onClick={handleHackToken} className="danger">😈 XSS 공격 테스트</button>
        </div>

        <div className="secure-area" style={{ marginTop: '20px' }}>
          <p><strong>미션:</strong> 아래 버튼 클릭 시 'Credentials 관련 CORS 에러'가 발생합니다. 코드에서 옵션을 추가해 해결하세요.</p>
          <button onClick={handleSecureApi}>4. 내 정보 보기 (인증 정보 포함 호출)</button>
          <textarea readOnly placeholder="응답 결과가 여기 표시됩니다..." value={authLog} />
        </div>
      </div>
    </div>
  );
}

export default CorsPage;

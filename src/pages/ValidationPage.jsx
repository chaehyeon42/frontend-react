import React, { useState } from 'react';
import './ValidationPage.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function ValidationPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', age: '' });
  const [unsafeLog, setUnsafeLog] = useState('');
  const [safeLog, setSafeLog] = useState('');
  const [userList, setUserList] = useState([]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildBody = () => ({
    username: form.username,
    password: form.password,
    email: form.email,
    age: form.age ? Number(form.age) : undefined,
  });

  // [시연] @Valid 없는 위험한 API
  const handleUnsafeSignup = () => {
    fetch(`${API_BASE}/api/valid/users/signup-unsafe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody()),
    })
      .then(res => res.text())
      .then(data => setUnsafeLog(data))
      .catch(err => setUnsafeLog(`[에러] ${err}`));
  };

  // [실습] @Valid 있는 안전한 API
  const handleSafeSignup = () => {
    fetch(`${API_BASE}/api/valid/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody()),
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) {
          try {
            const json = JSON.parse(text);
            setSafeLog(JSON.stringify(json, null, 2));
          } catch {
            setSafeLog(text);
          }
        } else {
          setSafeLog(text);
        }
      })
      .catch(err => setSafeLog(`[에러] ${err}`));
  };

  // 가입 목록 조회
  const fetchUsers = () => {
    fetch(`${API_BASE}/api/valid/users`)
      .then(res => res.json())
      .then(data => setUserList(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="valid-page">
      <h1>@Valid 데이터 검증 실습</h1>

      <div className="box">
        <h3>입력 폼</h3>
        <div className="form-grid">
          <label>아이디 (6~20자, 영문소문자+숫자)</label>
          <input name="username" value={form.username} onChange={handleChange} placeholder="student01" />

          <label>비밀번호 (최소 8자)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password123" />

          <label>이메일</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="user@example.com" />

          <label>나이 (선택, 최소 14)</label>
          <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="25" />
        </div>
      </div>

      <div className="box">
        <h3>AS-IS: @Valid 없는 위험한 API <span className="badge danger">취약</span></h3>
        <p>어떤 값을 넣어도 그대로 DB에 저장됩니다. 아무 쓰레기 값이나 입력해서 테스트해보세요!</p>
        <button className="btn-danger" onClick={handleUnsafeSignup}>위험한 API 호출 (signup-unsafe)</button>
        <pre className="log">{unsafeLog || '응답 결과가 여기 표시됩니다...'}</pre>
      </div>

      <div className="box">
        <h3>TO-BE: @Valid 있는 안전한 API <span className="badge safe">학생 과제</span></h3>
        <p>
          <code>ValidUserController.java</code>의 <code>signup()</code> 메서드에 검증 어노테이션을 추가하고,<br />
          <code>UserSignupDto.java</code>의 각 필드에 제약 조건 어노테이션을 달아주세요.
        </p>
        <button className="btn-safe" onClick={handleSafeSignup}>안전한 API 호출 (signup)</button>
        <pre className="log">{safeLog || '응답 결과가 여기 표시됩니다...'}</pre>
      </div>

      <div className="box">
        <h3>DB 저장 목록 확인</h3>
        <p>
          H2 콘솔:&nbsp;
          <a href="http://localhost:8080/h2-console" target="_blank" rel="noreferrer">
            http://localhost:8080/h2-console
          </a>
          &nbsp;→ JDBC URL: <code>jdbc:h2:mem:practicedb</code>
        </p>
        <button onClick={fetchUsers}>DB 유저 목록 가져오기</button>
        {userList.length > 0 && (
          <table className="user-table">
            <thead>
              <tr><th>ID</th><th>username</th><th>email</th><th>age</th></tr>
            </thead>
            <tbody>
              {userList.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.age ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ValidationPage;

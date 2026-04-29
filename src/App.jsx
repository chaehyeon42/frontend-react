import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import CorsPage from './pages/CorsPage';
import OAuthLoginPage from './pages/OAuthLoginPage';
import OAuthDashboardPage from './pages/OAuthDashboardPage';
import ValidationPage from './pages/ValidationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="top-nav">
        <span className="nav-title">Spring Boot 실전 실습</span>
        <div className="nav-links">
          <NavLink to="/cors"       className={({ isActive }) => isActive ? 'active' : ''}>CORS 실습</NavLink>
          <NavLink to="/valid"      className={({ isActive }) => isActive ? 'active' : ''}>@Valid 실습</NavLink>
          <NavLink to="/oauth"      className={({ isActive }) => isActive ? 'active' : ''}>OAuth 실습</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/"                element={<Navigate to="/cors" replace />} />
        <Route path="/cors"            element={<CorsPage />} />
        <Route path="/valid"           element={<ValidationPage />} />
        <Route path="/oauth"           element={<OAuthLoginPage />} />
        <Route path="/oauth/dashboard" element={<OAuthDashboardPage />} />
        <Route path="*"                element={<Navigate to="/cors" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [showProfileDrop, setShowProfileDrop] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="_main_layout">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-auto">
            <div className="_logo_wrap">
              <Link to="/feed">
                <img src="/assets/images/logo.svg" alt="BuddyScript" className="_nav_logo" />
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="col">
            <div className="_header_form ms-auto">
              <form className="_header_form_grp" onSubmit={(e) => e.preventDefault()}>
                <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                  <circle cx="7.5" cy="7.5" r="6" stroke="#000" strokeOpacity=".6" strokeWidth="1.5" />
                  <path stroke="#000" strokeLinecap="round" strokeOpacity=".6" strokeWidth="1.5" d="M16 16l-3.5-3.5" />
                </svg>
                <input type="search" className="_header_form_input" placeholder="Search BuddyScript..." />
              </form>
            </div>
          </div>

          {/* Nav Icons + Dark Mode + Profile */}
          <div className="col-auto d-flex align-items-center" style={{ gap: 16 }}>
            {/* Dark mode toggle */}
            <button
              id="dark_mode_toggle"
              type="button"
              className="_layout_swithing_btn_link"
              onClick={toggleDarkMode}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div className="_layout_swithing_btn">
                <div className="_layout_swithing_btn_round" />
              </div>
              <div className="_layout_change_btn_ic1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M9 1v1M9 16v1M1 9h1M16 9h1M3.22 3.22l.7.7M14.08 14.08l.7.7M14.78 3.22l-.7.7M3.92 14.08l-.7.7" />
                </svg>
              </div>
              <div className="_layout_change_btn_ic2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M14 10A6 6 0 016 2a6 6 0 100 12 6 6 0 008-4z" />
                </svg>
              </div>
            </button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                id="profile_dropdown_btn"
                type="button"
                onClick={() => setShowProfileDrop((p) => !p)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`}
                  alt={user?.name}
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e4e6ea' }}
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
              </button>

              {showProfileDrop && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', background: 'var(--bs-white, #fff)',
                  border: '1px solid #e4e6ea', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                  minWidth: 160, zIndex: 1000, overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: '#65676b' }}>{user?.email}</div>
                  </div>
                  <button
                    id="logout_btn"
                    type="button"
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: '#e53e3e' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from '../context/AuthContext';

export default function LeftSidebar() {
  const { user } = useAuth();

  return (
    <div className="_left_sidebar">
      {/* Profile Card */}
      <div className="_left_sidebar_profile">
        <div className="_left_sidebar_profile_cover">
          <img
            src={user?.cover_photo || '/assets/images/cover.jpg'}
            alt="Cover"
            className="_profile_cover_img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div className="_left_sidebar_profile_img">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff&size=80`}
            alt={user?.name}
            className="_profile_img"
          />
        </div>
        <div className="_left_sidebar_profile_txt">
          <h6 className="_profile_name">{user?.name}</h6>
          <p className="_profile_para">{user?.bio || 'Hey there! I am using BuddyScript.'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="_left_sidebar_nav">
        <ul className="_left_sidebar_nav_list">
          {[
            { icon: '📋', label: 'Timeline' },
            { icon: 'ℹ️', label: 'About' },
            { icon: '👥', label: 'Friends' },
            { icon: '📷', label: 'Photos' },
            { icon: '🎬', label: 'Videos' },
            { icon: '🏘️', label: 'Groups' },
          ].map(({ icon, label }) => (
            <li key={label} className="_left_sidebar_nav_item">
              <button type="button" className="_left_sidebar_nav_link">
                <span className="_nav_icon">{icon}</span>
                <span className="_nav_txt">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Shortcuts */}
      <div className="_left_sidebar_shortcut">
        <h6 className="_shortcut_title">Your shortcuts</h6>
        <ul className="_shortcut_list">
          {['Photography Club', 'Tech Enthusiasts', 'Travel Buddies'].map((group) => (
            <li key={group} className="_shortcut_item">
              <button type="button" className="_shortcut_link">
                <img src="/assets/images/profile-1.png" alt={group} className="_shortcut_img" />
                <span className="_shortcut_txt">{group}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

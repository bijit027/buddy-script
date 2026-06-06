import { useAuth } from '../context/AuthContext';


export default function LeftSidebar() {
  const { user } = useAuth();

  const NAV_LINKS = [
    { icon: '📋', label: 'Timeline' },
    { icon: 'ℹ️', label: 'About' },
    { icon: '👥', label: 'Friends' },
    { icon: '📷', label: 'Photos' },
    { icon: '🎬', label: 'Videos' },
    { icon: '🏘️', label: 'Groups' },
  ];

  const SHORTCUTS = ['Photography Club', 'Tech Enthusiasts', 'Travel Buddies'];

  return (
    <>
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            {NAV_LINKS.map(({ icon, label }) => (
              <li key={label} className="_left_inner_area_explore_item">
                <a href="#0" className="_left_inner_area_explore_link" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Your Shortcuts</h4>
            <span className="_left_inner_area_suggest_content_txt">
                <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          
          {SHORTCUTS.map((group) => (
            <div key={group} className="_left_inner_area_suggest_info">
              <div className="_left_inner_area_suggest_info_box">
                <div className="_left_inner_area_suggest_info_image">
                  <a href="#0">
                    <img src="/assets/images/people1.png" alt="Image" className="_info_img" />
                  </a>
                </div>
                <div className="_left_inner_area_suggest_info_txt">
                  <a href="#0">
                    <h4 className="_left_inner_area_suggest_info_title">{group}</h4>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

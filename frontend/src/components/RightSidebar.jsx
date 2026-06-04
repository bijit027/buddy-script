const SUGGESTED_PEOPLE = [
  { id: 1, name: 'Sarah Connor', mutual: 12, avatar: '/assets/images/profile-1.png' },
  { id: 2, name: 'John Martinez', mutual: 8, avatar: '/assets/images/man.png' },
  { id: 3, name: 'Emily Chen', mutual: 5, avatar: '/assets/images/profile.png' },
];

const TRENDING = [
  { tag: '#ReactJS', posts: '24.5K posts' },
  { tag: '#WebDev', posts: '18.2K posts' },
  { tag: '#Laravel', posts: '12.1K posts' },
  { tag: '#OpenSource', posts: '9.8K posts' },
  { tag: '#TechLife', posts: '7.3K posts' },
];

export default function RightSidebar() {
  return (
    <>
      <div className="_layout_right_sidebar_inner">
        <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">Trending now</h4>
            <span className="_right_inner_area_info_content_txt">
                <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          <hr className="_underline" />
          {TRENDING.map(({ tag, posts }) => (
            <div key={tag} className="_right_inner_area_info_ppl" style={{ marginBottom: 16 }}>
              <div className="_right_inner_area_info_box" style={{ width: '100%' }}>
                <div className="_right_inner_area_info_box_txt" style={{ paddingLeft: 0 }}>
                  <a href="#0">
                    <h4 className="_right_inner_area_info_box_title">{tag}</h4>
                  </a>
                  <p className="_right_inner_area_info_box_para">{posts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="_layout_right_sidebar_inner">
        <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_feed_top_fixed">
            <div className="_feed_right_inner_area_card_content _mar_b24">
              <h4 className="_feed_right_inner_area_card_content_title _title5">People you may know</h4>
              <span className="_feed_right_inner_area_card_content_txt">
                <a className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</a>
              </span>
            </div>
            <form className="_feed_right_inner_area_card_form" onSubmit={(e) => e.preventDefault()}>
              <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
              </svg>
              <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="Search people" aria-label="Search" />
            </form>
          </div>
          <div className="_feed_bottom_fixed">
            {SUGGESTED_PEOPLE.map((person) => (
              <div key={person.id} className="_feed_right_inner_area_card_ppl">
                <div className="_feed_right_inner_area_card_ppl_box">
                  <div className="_feed_right_inner_area_card_ppl_image">
                    <a href="#0">
                      <img 
                        src={person.avatar} 
                        alt={person.name} 
                        className="_box_ppl_img" 
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=4f46e5&color=fff`;
                        }}
                      />
                    </a>
                  </div>
                  <div className="_feed_right_inner_area_card_ppl_txt">
                    <a href="#0">
                      <h4 className="_feed_right_inner_area_card_ppl_title">{person.name}</h4>
                    </a>
                    <p className="_feed_right_inner_area_card_ppl_para">{person.mutual} mutual friends</p>
                  </div>
                </div>
                <div className="_feed_right_inner_area_card_ppl_side">
                  <button type="button" style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: 'bold' }}>
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

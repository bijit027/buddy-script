const TRENDING = [
  { tag: '#ReactJS', posts: '24.5K posts' },
  { tag: '#WebDev', posts: '18.2K posts' },
  { tag: '#Laravel', posts: '12.1K posts' },
  { tag: '#OpenSource', posts: '9.8K posts' },
  { tag: '#TechLife', posts: '7.3K posts' },
];

export default function RightSidebar() {
  return (
    <div className="_layout_right_sidebar_inner">
      <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
        <div className="_right_inner_area_info_content _mar_b24">
          <h4 className="_right_inner_area_info_content_title _title5">Trending now</h4>
        </div>
        <hr className="_underline" />
        {TRENDING.map(({ tag, posts }) => (
          <div key={tag} className="_right_inner_area_info_ppl" style={{ marginBottom: 16 }}>
            <div className="_right_inner_area_info_box" style={{ width: '100%' }}>
              <div className="_right_inner_area_info_box_txt" style={{ paddingLeft: 0 }}>
                <h4 className="_right_inner_area_info_box_title">{tag}</h4>
                <p className="_right_inner_area_info_box_para">{posts}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SUGGESTED_PEOPLE = [
  { id: 1, name: 'Sarah Connor', mutual: 12, avatar: '/assets/images/profile-1.png' },
  { id: 2, name: 'John Martinez', mutual: 8,  avatar: '/assets/images/man.png' },
  { id: 3, name: 'Emily Chen',   mutual: 5,  avatar: '/assets/images/profile.png' },
];

const TRENDING = [
  { tag: '#ReactJS',       posts: '24.5K posts' },
  { tag: '#WebDev',        posts: '18.2K posts' },
  { tag: '#Laravel',       posts: '12.1K posts' },
  { tag: '#OpenSource',    posts: '9.8K posts' },
  { tag: '#TechLife',      posts: '7.3K posts' },
];

export default function RightSidebar() {
  return (
    <div className="_right_sidebar">
      {/* People You May Know */}
      <div className="_right_sidebar_box">
        <h6 className="_right_sidebar_title">People you may know</h6>
        <ul className="_people_list">
          {SUGGESTED_PEOPLE.map((person) => (
            <li key={person.id} className="_people_item">
              <div className="_people_img_wrap">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="_people_img"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=4f46e5&color=fff`;
                  }}
                />
              </div>
              <div className="_people_txt">
                <p className="_people_name">{person.name}</p>
                <p className="_people_mutual">{person.mutual} mutual friends</p>
              </div>
              <button type="button" className="_people_add_btn">
                + Add
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending */}
      <div className="_right_sidebar_box">
        <h6 className="_right_sidebar_title">Trending now</h6>
        <ul className="_trending_list">
          {TRENDING.map(({ tag, posts }) => (
            <li key={tag} className="_trending_item">
              <button type="button" className="_trending_link">
                <span className="_trending_tag">{tag}</span>
                <span className="_trending_count">{posts}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

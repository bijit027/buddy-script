import { useAuth } from '../context/AuthContext';

const DEMO_STORIES = [
  { id: 1, name: 'Your Story', avatar: null, isAdd: true },
  { id: 2, name: 'Alex J.',    avatar: '/assets/images/profile-1.png', bg: '#4f46e5' },
  { id: 3, name: 'Maria G.',   avatar: '/assets/images/man.png', bg: '#059669' },
  { id: 4, name: 'James W.',   avatar: '/assets/images/profile.png', bg: '#dc2626' },
  { id: 5, name: 'Priya S.',   avatar: '/assets/images/profile-1.png', bg: '#d97706' },
];

export default function StoriesBar() {
  const { user } = useAuth();

  return (
    <div className="_stories_wrap">
      <div className="_stories_inner">
        {DEMO_STORIES.map((story) => (
          <div key={story.id} className="_story_item">
            <button type="button" className="_story_btn">
              <div
                className="_story_avatar_wrap"
                style={{ background: story.bg || '#4f46e5', position: 'relative' }}
              >
                {story.isAdd ? (
                  <>
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`}
                      alt="Your story"
                      className="_story_avatar"
                    />
                    <div className="_story_add_icon">+</div>
                  </>
                ) : (
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="_story_avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=${story.bg?.replace('#', '')}&color=fff`;
                    }}
                  />
                )}
              </div>
              <span className="_story_name">{story.isAdd ? 'Add Story' : story.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

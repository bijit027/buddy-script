import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';

export default function CreatePostCard({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Only JPG, PNG and GIF images are allowed.');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Please write something or add an image.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (image) formData.append('image', image);

      const res = await postService.createPost(formData);
      toast.success('Post shared!');
      setContent('');
      setImage(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
      onPostCreated?.(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="_create_post_card">
      <div className="_create_post_top">
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`}
          alt={user?.name}
          className="_create_post_avatar"
        />
        <form className="_create_post_form" onSubmit={handleSubmit} style={{ flex: 1 }}>
          <textarea
            id="create_post_input"
            className="_create_post_input"
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={content.length > 100 ? 4 : 2}
            disabled={isLoading}
          />

          {imagePreview && (
            <div className="_create_post_preview" style={{ position: 'relative', marginTop: 8 }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover' }} />
              <button
                type="button"
                onClick={removeImage}
                style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}
              >
                ×
              </button>
            </div>
          )}

          <div className="_create_post_actions">
            <button
              type="button"
              className="_create_post_action_btn"
              onClick={() => fileRef.current?.click()}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>Photo</span>
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif" onChange={handleImageChange} style={{ display: 'none' }} id="post_image_input" />

            <button type="button" className="_create_post_action_btn" disabled={isLoading}>
              <span style={{ fontSize: 20 }}>😊</span>
              <span>Feeling</span>
            </button>

            <button
              id="create_post_submit"
              type="submit"
              className="_create_post_submit_btn _btn1"
              disabled={isLoading || (!content.trim() && !image)}
              style={{ marginLeft: 'auto', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {isLoading && <span className="_spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';

export default function PostCard({ post, onDelete, onLikeToggle }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === post.user.id;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const prevLiked = post.is_liked_by_me;
    const prevCount = post.likes_count;

    onLikeToggle(post.id, {
      is_liked_by_me: !prevLiked,
      likes_count: prevLiked ? prevCount - 1 : prevCount + 1,
    });

    try {
      const res = await postService.likePost(post.id);
      // Sync exact count from server
      onLikeToggle(post.id, res.data);
    } catch (err) {
      toast.error('Failed to like post.');
      // Revert
      onLikeToggle(post.id, { is_liked_by_me: prevLiked, likes_count: prevCount });
    } finally {
      setIsLiking(false);
    }
  };

  const loadComments = async () => {
    if (comments.length > 0) return;
    setIsLoadingComments(true);
    try {
      const res = await postService.getComments(post.id);
      setComments(res.data);
    } catch (err) {
      toast.error('Failed to load comments.');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await postService.addComment(post.id, newComment.trim());
      setComments([res.data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await postService.deletePost(post.id);
      toast.success('Post deleted.');
      onDelete(post.id);
    } catch (err) {
      toast.error('Failed to delete post.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="_post_card" style={{ opacity: isDeleting ? 0.5 : 1 }}>
      {/* Header */}
      <div className="_post_card_header">
        <div className="_post_card_header_left">
          <img src={post.user.avatar} alt={post.user.name} className="_post_avatar" />
          <div className="_post_header_txt">
            <h6 className="_post_name">{post.user.name}</h6>
            <p className="_post_time">{timeAgo}</p>
          </div>
        </div>

        {/* Action Menu (Delete) */}
        {isOwner && (
          <div className="_post_card_header_right" style={{ position: 'relative' }}>
            <button
              className="_post_action_btn"
              onClick={() => setShowMenu(!showMenu)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ⋮
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', background: 'var(--bs-white, #fff)',
                border: '1px solid #e4e6ea', borderRadius: 8, padding: '4px 0', zIndex: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
              }}>
                <button
                  onClick={handleDelete}
                  style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' }}
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="_post_card_body">
        <p className="_post_card_text">{post.content}</p>
        {post.image && (
          <div className="_post_card_img_wrap">
            <img src={post.image} alt="Post" className="_post_card_img" />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="_post_card_footer_stats" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #e4e6ea', color: '#65676b', fontSize: 14 }}>
        <span>{post.likes_count} Likes</span>
        <span>{post.comments_count} Comments</span>
      </div>

      {/* Footer Actions */}
      <div className="_post_card_footer">
        <button
          className={`_post_footer_btn ${post.is_liked_by_me ? '_active' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
          style={{ color: post.is_liked_by_me ? '#1877f2' : 'inherit' }}
        >
          {post.is_liked_by_me ? '👍' : '🤍'} Like
        </button>
        <button className="_post_footer_btn" onClick={handleToggleComments}>
          💬 Comment
        </button>
        <button className="_post_footer_btn">
          🔗 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="_post_comments_wrap" style={{ padding: '16px', borderTop: '1px solid #e4e6ea' }}>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <img src={user?.avatar} alt={user?.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={isSubmittingComment}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #e4e6ea', background: '#f0f2f5', outline: 'none' }}
            />
            <button type="submit" disabled={isSubmittingComment || !newComment.trim()} style={{ background: 'none', border: 'none', color: '#1877f2', fontWeight: 600, cursor: 'pointer' }}>
              Post
            </button>
          </form>

          {isLoadingComments ? (
            <div style={{ textAlign: 'center', padding: 20 }}><span className="_spinner" style={{ width: 24, height: 24, display: 'inline-block' }} /></div>
          ) : comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#65676b', fontSize: 14 }}>No comments yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ display: 'flex', gap: 8 }}>
                  <img src={comment.user.avatar} alt={comment.user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div style={{ background: '#f0f2f5', padding: '8px 12px', borderRadius: 18 }}>
                    <h6 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{comment.user.name}</h6>
                    <p style={{ margin: 0, fontSize: 14 }}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';

export default function CommentCard({ comment, onCommentUpdate }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    const prevLiked = comment.is_liked_by_me;
    const prevCount = comment.likes_count;

    // Optimistic
    onCommentUpdate(comment.id, {
      is_liked_by_me: !prevLiked,
      likes_count: prevLiked ? prevCount - 1 : prevCount + 1
    });

    try {
      const res = await postService.likeComment(comment.id);
      onCommentUpdate(comment.id, res.data);
    } catch (err) {
      toast.error('Failed to like comment.');
      onCommentUpdate(comment.id, { is_liked_by_me: prevLiked, likes_count: prevCount });
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await postService.replyToComment(comment.id, replyContent.trim());
      onCommentUpdate(comment.id, {
        replies: [...(comment.replies || []), res.data]
      });
      setReplyContent('');
      setShowReplyForm(false);
      toast.success('Reply added!');
    } catch (err) {
      toast.error('Failed to reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="_comment_main" style={{ marginBottom: 16 }}>
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <img src={comment.user.avatar} alt={comment.user.name} className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area" style={{ width: '100%' }}>
        <div className="_comment_details" style={{ marginBottom: 4 }}>
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0">
                <h4 className="_comment_name_title">{comment.user.name}</h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{comment.content}</span></p>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="_comment_actions" style={{ display: 'flex', gap: 16, fontSize: 13, color: '#65676b', marginBottom: 12, paddingLeft: 8 }}>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              color: comment.is_liked_by_me ? '#1877f2' : '#65676b',
              fontWeight: comment.is_liked_by_me ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            Like {comment.likes_count > 0 && `(${comment.likes_count})`}
          </button>
          
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#65676b', cursor: 'pointer', fontWeight: 600 }}
          >
            Reply
          </button>
          
          <span>{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReply} style={{ display: 'flex', gap: 8, marginBottom: 16, marginTop: 8 }}>
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`} 
              alt={user?.name} 
              style={{ width: 28, height: 28, borderRadius: '50%' }} 
            />
            <input 
              type="text" 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              disabled={isSubmitting}
              style={{ flex: 1, padding: '6px 12px', borderRadius: 20, border: '1px solid #ccd0d5', fontSize: 13, background: '#f0f2f5', outline: 'none' }}
            />
          </form>
        )}

        {/* Replies List */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="_replies_list" style={{ marginTop: 8 }}>
            {comment.replies.map((reply) => (
              <div key={reply.id} className="_comment_main" style={{ marginBottom: 12 }}>
                <div className="_comment_image">
                  <a href="#0" className="_comment_image_link">
                    <img src={reply.user.avatar} alt={reply.user.name} className="_comment_img1" style={{ width: 28, height: 28 }} />
                  </a>
                </div>
                <div className="_comment_area" style={{ width: '100%' }}>
                  <div className="_comment_details" style={{ marginBottom: 4, borderRadius: 16 }}>
                    <div className="_comment_details_top">
                      <div className="_comment_name">
                        <a href="#0">
                          <h4 className="_comment_name_title" style={{ fontSize: 13 }}>{reply.user.name}</h4>
                        </a>
                      </div>
                    </div>
                    <div className="_comment_status">
                      <p className="_comment_status_text" style={{ fontSize: 14 }}><span>{reply.content}</span></p>
                    </div>
                  </div>
                  
                  {/* Reply Actions (Like only) */}
                  <div className="_comment_actions" style={{ display: 'flex', gap: 16, fontSize: 12, color: '#65676b', paddingLeft: 8 }}>
                    <button 
                      onClick={async () => {
                        const prevLiked = reply.is_liked_by_me;
                        const prevCount = reply.likes_count;
                        onCommentUpdate(comment.id, {
                          replies: comment.replies.map(r => r.id === reply.id ? {
                            ...r,
                            is_liked_by_me: !prevLiked,
                            likes_count: prevLiked ? prevCount - 1 : prevCount + 1
                          } : r)
                        });
                        try {
                          const res = await postService.likeComment(reply.id);
                          onCommentUpdate(comment.id, {
                            replies: comment.replies.map(r => r.id === reply.id ? { ...r, ...res.data } : r)
                          });
                        } catch(err) {
                           onCommentUpdate(comment.id, {
                             replies: comment.replies.map(r => r.id === reply.id ? {
                               ...r,
                               is_liked_by_me: prevLiked,
                               likes_count: prevCount
                             } : r)
                           });
                        }
                      }}
                      style={{ 
                        background: 'none', border: 'none', padding: 0, 
                        color: reply.is_liked_by_me ? '#1877f2' : '#65676b',
                        fontWeight: reply.is_liked_by_me ? 600 : 400,
                        cursor: 'pointer' 
                      }}
                    >
                      Like {reply.likes_count > 0 && `(${reply.likes_count})`}
                    </button>
                    <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

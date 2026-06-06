import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import styles from '../../public/assets/css/CommentCard.module.css';

export default function CommentCard({ comment, onCommentUpdate }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLikesTooltip, setShowLikesTooltip] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [likers, setLikers] = useState([]);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

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

    // Clear likers cache to force refetch on next hover
    setLikers([]);

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

  const handleMouseEnterLikes = async (replyId = null, event) => {
    const targetId = replyId || comment.id;
    const likesCount = replyId
      ? comment.replies?.find(r => r.id === replyId)?.likes_count || 0
      : comment.likes_count;

    if (likesCount === 0) return;

    // Calculate tooltip position
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 8,
        left: rect.left,
      });
    }

    if (likers.length > 0 && activeReplyId === replyId) {
      setShowLikesTooltip(true);
      return;
    }

    setActiveReplyId(replyId);
    setIsLoadingLikers(true);
    try {
      const res = await postService.getCommentLikes(targetId);
      setLikers(res.data);
      setShowLikesTooltip(true);
    } catch (err) {
      console.error('Failed to fetch likers:', err);
    } finally {
      setIsLoadingLikers(false);
    }
  };

  const handleMouseLeaveLikes = () => {
    setShowLikesTooltip(false);
    setActiveReplyId(null);
  };

  return (
    <div className={`_comment_main ${styles.commentMain}`}>
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <img src={comment.user.avatar} alt={comment.user.name} className={`_comment_img1 ${styles.commentImage}`} />
        </a>
      </div>
      <div className={`_comment_area ${styles.commentArea}`}>
        <div className={`_comment_details ${styles.commentDetails}`}>
          <div className={`_comment_details_top ${styles.commentDetailsTop}`}>
            <div className="_comment_name">
              <a href="#0">
                <h4 className={`_comment_name_title ${styles.commentNameTitle}`}>{comment.user.name}</h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className={`_comment_status_text ${styles.commentStatusText}`}><span>{comment.content}</span></p>
          </div>
        </div>

        {/* Comment Actions */}
        <div className={`_comment_actions ${styles.commentActions}`}>
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={comment.is_liked_by_me ? styles.liked : ''}
          >
            Like
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </button>

          <span>{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

          {comment.recent_likes && comment.recent_likes.length > 0 && (
            <div
              className={styles.likeAvatars}
              onMouseEnter={(e) => handleMouseEnterLikes(null, e)}
              onMouseLeave={handleMouseLeaveLikes}
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex' }}>
                {comment.recent_likes.map((liker, idx) => (
                  <img
                    key={liker.id}
                    src={liker.avatar}
                    title={liker.name}
                    alt={liker.name}
                    style={{
                      marginLeft: idx === 0 ? 0 : -6,
                      zIndex: 9 - idx
                    }}
                  />
                ))}
              </div>
              <span>{comment.likes_count}</span>

              {showLikesTooltip && activeReplyId === null && (
                <div className={styles.likesTooltip} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                  {isLoadingLikers ? (
                    <div className={styles.tooltipLoading}>Loading...</div>
                  ) : likers.length > 0 ? (
                    <div className={styles.tooltipList}>
                      {likers.map((liker) => (
                        <div key={liker.id} className={styles.tooltipItem}>
                          <img src={liker.avatar} alt={liker.name} />
                          <span>{liker.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.tooltipEmpty}>No likes yet</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className={styles.replyForm}>
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`}
              alt={user?.name}
            />
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? '...' : 'Reply'}
            </button>
          </form>
        )}

        {/* Replies List */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={`_replies_list ${styles.repliesList}`}>
            {comment.replies.map((reply) => (
              <div key={reply.id} className={`_comment_main ${styles.commentMain} ${styles.reply}`}>
                <div className="_comment_image">
                  <a href="#0" className="_comment_image_link">
                    <img src={reply.user.avatar} alt={reply.user.name} className={`_comment_img1 ${styles.commentImage} ${styles.reply}`} />
                  </a>
                </div>
                <div className={`_comment_area ${styles.commentArea}`}>
                  <div className={`_comment_details ${styles.commentDetails} ${styles.reply}`}>
                    <div className={`_comment_details_top ${styles.commentDetailsTop}`}>
                      <div className="_comment_name">
                        <a href="#0">
                          <h4 className={`_comment_name_title ${styles.commentNameTitle} ${styles.reply}`}>{reply.user.name}</h4>
                        </a>
                      </div>
                    </div>
                    <div className="_comment_status">
                      <p className={`_comment_status_text ${styles.commentStatusText} ${styles.reply}`}><span>{reply.content}</span></p>
                    </div>
                  </div>

                  {/* Reply Actions (Like only) */}
                  <div className={`_comment_actions ${styles.commentActions} ${styles.reply}`}>
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

                        // Clear likers cache to force refetch on next hover
                        setLikers([]);

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
                      className={reply.is_liked_by_me ? styles.liked : ''}
                    >
                      Like
                    </button>
                    <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                    {reply.recent_likes && reply.recent_likes.length > 0 && (
                      <div
                        className={styles.likeAvatars}
                        onMouseEnter={(e) => handleMouseEnterLikes(reply.id, e)}
                        onMouseLeave={handleMouseLeaveLikes}
                        style={{ position: 'relative' }}
                      >
                        <div style={{ display: 'flex' }}>
                          {reply.recent_likes.map((liker, idx) => (
                            <img
                              key={liker.id}
                              src={liker.avatar}
                              title={liker.name}
                              alt={liker.name}
                              className={styles.reply}
                              style={{
                                marginLeft: idx === 0 ? 0 : -6,
                                zIndex: 9 - idx
                              }}
                            />
                          ))}
                        </div>
                        <span className={styles.reply}>{reply.likes_count}</span>

                        {showLikesTooltip && activeReplyId === reply.id && (
                          <div className={styles.likesTooltip} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                            {isLoadingLikers ? (
                              <div className={styles.tooltipLoading}>Loading...</div>
                            ) : likers.length > 0 ? (
                              <div className={styles.tooltipList}>
                                {likers.map((liker) => (
                                  <div key={liker.id} className={styles.tooltipItem}>
                                    <img src={liker.avatar} alt={liker.name} />
                                    <span>{liker.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className={styles.tooltipEmpty}>No likes yet</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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

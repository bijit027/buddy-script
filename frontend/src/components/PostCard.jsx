import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import CommentCard from './CommentCard';
import styles from '../../public/assets/css/PostCard.module.css';

export default function PostCard({ post, onDelete, onUpdate, onLikeToggle, onCommentAdded }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [fullLikesList, setFullLikesList] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setEditContent(post.content);
  }, [post.content]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwner = user?.id === post.user.id;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = post.is_liked_by_me;
    const prevCount = post.likes_count;
    const prevRecentLikes = post.recent_likes || [];

    const nextRecentLikes = !prevLiked
      ? [{ id: user.id, name: user.name, avatar: user.avatar }, ...prevRecentLikes.filter((l) => l.id !== user.id)].slice(0, 3)
      : prevRecentLikes.filter((l) => l.id !== user.id);

    onLikeToggle(post.id, {
      is_liked_by_me: !prevLiked,
      likes_count: prevLiked ? prevCount - 1 : prevCount + 1,
      recent_likes: nextRecentLikes,
    });

    try {
      const res = await postService.likePost(post.id);
      onLikeToggle(post.id, res.data);
    } catch (err) {
      toast.error('Failed to like post.');
      onLikeToggle(post.id, {
        is_liked_by_me: prevLiked,
        likes_count: prevCount,
        recent_likes: prevRecentLikes,
      });
    } finally {
      setIsLiking(false);
    }
  };

  const fetchLikes = async () => {
    setShowLikesModal(true);
    if (fullLikesList.length === 0) {
      setIsLoadingLikes(true);
      try {
        const res = await postService.getPostLikes(post.id);
        setFullLikesList(res.data);
      } catch (err) {
        toast.error('Failed to load likes');
      } finally {
        setIsLoadingLikes(false);
      }
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
      onCommentAdded?.(post.id);
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentUpdate = (commentId, updates) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
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

  const handleStartEdit = () => {
    setShowMenu(false);
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      toast.error('Post content cannot be empty.');
      return;
    }
    if (trimmed === post.content) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const res = await postService.updatePost(post.id, { content: trimmed });
      onUpdate?.(res.data);
      setIsEditing(false);
      toast.success('Post updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    setShowMenu(false);
    setIsTogglingVisibility(true);
    const nextPublic = !post.is_public;
    try {
      const res = await postService.updatePost(post.id, { is_public: nextPublic });
      onUpdate?.(res.data);
      toast.success(nextPublic ? 'Post is now public.' : 'Post is now private.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update visibility.');
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  return (
    <div className={`_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 ${styles.postContainer} ${isDeleting ? styles.deleting : ''}`}>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={post.user.avatar} alt={post.user.name} className={`_post_img ${styles.postImage}`} />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.user.name}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo}
                {isOwner && (
                  <>
                    {' · '}
                    <span className={`${styles.visibilityBadge} ${!post.is_public ? styles.private : ''}`}>
                      {post.is_public ? 'Public' : 'Private'}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="_post_actions" ref={menuRef}>
              <button
                type="button"
                className={`_post_actions_trigger ${styles.postActionsTrigger}`}
                onClick={() => setShowMenu((prev) => !prev)}
                aria-expanded={showMenu}
                aria-label="Post options"
                disabled={isDeleting || isTogglingVisibility}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>

              <div className={`${styles.postActionsMenu} ${showMenu ? styles.open : ''}`}>
                <button type="button" className={styles.postActionsItem} onClick={handleStartEdit}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18" aria-hidden="true">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.75 2.25l3 3L6.75 14.25 3 15l.75-3.75L12.75 2.25z" />
                  </svg>
                  Edit post
                </button>
                <button
                  type="button"
                  className={styles.postActionsItem}
                  onClick={handleToggleVisibility}
                  disabled={isTogglingVisibility}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18" aria-hidden="true">
                    {post.is_public ? (
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 8.25a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM2.25 15.75s2.25-3.75 6.75-3.75 6.75 3.75 6.75 3.75" />
                    ) : (
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.25 7.5V5.25a3.75 3.75 0 117.5 0V7.5M3.75 7.5h10.5v7.5H3.75V7.5z" />
                    )}
                  </svg>
                  {post.is_public ? 'Make private' : 'Make public'}
                </button>
                <button type="button" className={`${styles.postActionsItem} ${styles.danger}`} onClick={handleDeleteClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                    />
                  </svg>
                  Delete post
                </button>
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className={styles.postEditForm}>
            <textarea
              className={`form-control _post_edit_textarea ${styles.postEditTextarea}`}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isSaving}
              rows={3}
            />
            <div className={styles.postEditActions}>
              <button type="button" className={`${styles.postEditBtn} ${styles.ghost}`} onClick={handleCancelEdit} disabled={isSaving}>
                Cancel
              </button>
              <button type="button" className={`${styles.postEditBtn} ${styles.primary}`} onClick={handleSaveEdit} disabled={isSaving || !editContent.trim()}>
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <h4 className={`_feed_inner_timeline_post_title ${styles.postContent}`}>{post.content}</h4>
        )}

        {post.image && (
          <div className={`_feed_inner_timeline_image ${styles.postImageContainer}`}>
            <img src={post.image} alt="Post" className={`_time_img ${styles.postImageDisplay}`} />
          </div>
        )}
      </div>

      <div className={`_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26 ${styles.reactsSection}`}>
        {post.likes_count > 0 ? (
          <div className={`_feed_inner_timeline_total_reacts_image ${styles.reactsImage}`} onClick={fetchLikes}>
            {post.recent_likes && post.recent_likes.length > 0 ? (
              <>
                {post.recent_likes.map((liker, idx) => (
                  <img
                    key={liker.id}
                    src={liker.avatar}
                    alt={liker.name}
                    title={liker.name}
                    className={`_react_img ${styles.reactImg}`}
                    style={{
                      zIndex: post.recent_likes.length - idx,
                      marginLeft: idx === 0 ? 0 : -16,
                    }}
                  />
                ))}
                <span className={styles.reactsText}>
                  Liked by <strong>{post.recent_likes[0].id === user?.id ? 'you' : post.recent_likes[0].name}</strong> {post.likes_count > 1 ? `and ${post.likes_count - 1} others` : ''}
                </span>
              </>
            ) : (
              <p className={`_feed_inner_timeline_total_reacts_para ${styles.likesCountPara}`}>{post.likes_count}</p>
            )}
          </div>
        ) : null}
        <div className={`_feed_inner_timeline_total_reacts_txt ${styles.commentSection}`}>
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0" onClick={(e) => { e.preventDefault(); handleToggleComments(); }}><span>{post.comments_count || 0}</span> Comment{(post.comments_count || 0) !== 1 ? 's' : ''}</a>
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.is_liked_by_me ? '_feed_reaction_active' : ''} ${styles.reactionButton} ${post.is_liked_by_me ? styles.active : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill={post.is_liked_by_me ? '#1877f2' : 'none'}
                stroke={post.is_liked_by_me ? '#1877f2' : 'currentColor'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              {post.is_liked_by_me ? ' Liked' : ' Like'}
            </span>
          </span>
        </button>
        <button className={`_feed_inner_timeline_reaction_comment _feed_reaction ${styles.reactionButton}`} onClick={handleToggleComments}>
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
      </div>

      {showComments && (
        <div className={`_feed_inner_timeline_cooment_area ${styles.commentSection}`}>
          <div className="_feed_inner_comment_box">
            <form className={`_feed_inner_comment_box_form ${styles.commentBoxForm}`} onSubmit={handleAddComment}>
              <div className={`_feed_inner_comment_box_content ${styles.commentBoxContent}`}>
                <div className="_feed_inner_comment_box_content_image">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff`}
                    alt={user?.name}
                    className={`_comment_img ${styles.commentBoxContentImage}`}
                  />
                </div>
                <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
                  <textarea
                    className={`form-control _comment_textarea ${styles.commentTextarea}`}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmittingComment}
                  ></textarea>
                </div>
              </div>
              <div className={`_feed_inner_comment_box_icon ${styles.commentBoxIcon}`}>
                <button
                  type="submit"
                  className={`_feed_inner_comment_box_icon_btn ${styles.commentBoxIconBtn}`}
                  disabled={isSubmittingComment || !newComment.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          <div className={`_timline_comment_main ${styles.timelineCommentMain}`}>
            {isLoadingComments ? (
              <div className={styles.loadingIndicator}><span className={styles.spinner} /></div>
            ) : comments.length === 0 ? (
              <p className={styles.loadingText}>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onCommentUpdate={handleCommentUpdate}
                />
              ))
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.confirmModalBackdrop} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmModalHeader}>
              <h3 className={styles.confirmModalTitle}>Delete Post?</h3>
              <button className={styles.confirmModalClose} onClick={() => setShowDeleteModal(false)}>&times;</button>
            </div>
            <div className={styles.confirmModalBody}>
              Are you sure you want to delete this post? This action cannot be undone.
            </div>
            <div className={styles.confirmModalFooter}>
              <button onClick={() => setShowDeleteModal(false)} className={`${styles.postEditBtn} ${styles.ghost}`}>
                Cancel
              </button>
              <button onClick={confirmDelete} className={`${styles.postEditBtn} ${styles.primary} ${styles.danger}`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showLikesModal && (
        <div className={styles.likesModal}>
          <div className={styles.likesModalContent}>
            <div className={styles.likesModalHeader}>
              <h3>Likes</h3>
              <button onClick={() => setShowLikesModal(false)} className={styles.likesModalClose}>&times;</button>
            </div>
            <div className={styles.likesModalBody}>
              {isLoadingLikes ? (
                <div className={styles.loadingText}>Loading...</div>
              ) : fullLikesList.length === 0 ? (
                <div className={styles.loadingText}>No likes yet.</div>
              ) : (
                <div className={styles.likesModalList}>
                  {fullLikesList.map(liker => (
                    <div key={liker.id} className={styles.likesModalItem}>
                      <img src={liker.avatar} alt={liker.name} />
                      <span>{liker.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

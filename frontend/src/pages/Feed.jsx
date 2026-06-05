import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CreatePostCard from '../components/CreatePostCard';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import { postService } from '../services/api';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Feed() {
  const { ref, inView } = useInView();
  const { toggleDarkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postService.getFeed(pageParam);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta || lastPage;
      if (meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }
      return undefined;
    },
  });

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Handle post creation (optimistically add to top of feed)
  const handlePostCreated = (newPost) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, i) => {
          if (i === 0) {
            return {
              ...page,
              data: [newPost, ...page.data],
            };
          }
          return page;
        }),
      };
    });
  };

  // Handle post deletion (remove from cache)
  const handlePostDeleted = (postId) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.filter((p) => p.id !== postId),
        })),
      };
    });
  };

  const handlePostUpdated = (updatedPost) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
        })),
      };
    });
  };

  const handleCommentAdded = (postId) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) =>
            p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
          ),
        })),
      };
    });
  };

  // Handle like toggle (optimistically update post in cache)
  const handleLikeToggle = (postId, updates) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => (p.id === postId ? { ...p, ...updates } : p)),
        })),
      };
    });
  };

  return (
    <div className="_layout _layout_main_wrapper">
      {/* Switching Btn Start */}
      <div className="_layout_mode_swithing_btn">
        <button type="button" className="_layout_swithing_btn_link" onClick={toggleDarkMode}>
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
            </svg>
          </div>
        </button>
      </div>
      {/* Switching Btn End */}

      <div className="_main_layout">
        <Navbar />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <LeftSidebar />
                </div>
              </div>

              {/* Main Feed Column */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {/* Create Post */}
                    <CreatePostCard onPostCreated={handlePostCreated} />

                    {/* Feed List */}
                    <div className="_feed_list" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {status === 'loading' ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                          <span className="_spinner" style={{ display: 'inline-block' }} />
                        </div>
                      ) : status === 'error' ? (
                        <div style={{ textAlign: 'center', color: '#e53e3e', padding: 40 }}>
                          Failed to load feed. Please try again later.
                        </div>
                      ) : (
                        <>
                          {data?.pages.map((page) =>
                            page.data.map((post) => (
                              <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handlePostDeleted}
                                onUpdate={handlePostUpdated}
                                onLikeToggle={handleLikeToggle}
                                onCommentAdded={handleCommentAdded}
                              />
                            ))
                          )}

                          {/* Loading indicator for next page */}
                          <div ref={ref} style={{ textAlign: 'center', padding: 20 }}>
                            {isFetchingNextPage ? (
                              <span className="_spinner" style={{ display: 'inline-block', width: 24, height: 24 }} />
                            ) : hasNextPage ? (
                              <span style={{ color: '#65676b' }}>Load more</span>
                            ) : (
                              <span style={{ color: '#65676b' }}>You&apos;ve reached the end!</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

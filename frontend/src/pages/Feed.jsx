import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CreatePostCard from '../components/CreatePostCard';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import StoriesBar from '../components/StoriesBar';
import { postService } from '../services/api';

export default function Feed() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    setQueryData, // To manually update cache
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postService.getFeed(pageParam);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
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
    setQueryData(['feed'], (oldData) => {
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
    setQueryData(['feed'], (oldData) => {
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

  // Handle like toggle (optimistically update post in cache)
  const handleLikeToggle = (postId, { is_liked_by_me, likes_count }) => {
    setQueryData(['feed'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) =>
            p.id === postId ? { ...p, is_liked_by_me, likes_count } : p
          ),
        })),
      };
    });
  };

  return (
    <>
      <Navbar />

      <div className="_layout">
        <div className="container-fluid">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 _layout_left_sidebar">
              <LeftSidebar />
            </div>

            {/* Main Feed Column */}
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 _layout_middle_content">
              <div className="_middle_content_inner">
                {/* Stories */}
                <StoriesBar />

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
                            onLikeToggle={handleLikeToggle}
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

            {/* Right Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 _layout_right_sidebar">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

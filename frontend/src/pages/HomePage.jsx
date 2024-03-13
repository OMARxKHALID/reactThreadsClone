import React, { useState, useEffect, useMemo } from 'react';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts) || []; 
  if(!posts) return;

  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        const res = await fetch('/api/posts/feed');
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        } else {
          dispatch(setPosts(data));
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, dispatch]);

  const post = useMemo(() => (
    posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy} />
    ))
  ), [posts]);

  return (
    <>
      {loading && (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" thickness="4px" />
        </Flex>
      )}
      {!loading && posts.length === 0 && (
        <Flex justifyContent="center" alignItems="center">
          <Box textAlign="center">
            <Heading size="lg" color="gray.light">
              Follow some users to see the threads
            </Heading>
          </Box>
        </Flex>
      )}
      <Box>
        {post}
      </Box>
    </>
  );
};

export default HomePage;

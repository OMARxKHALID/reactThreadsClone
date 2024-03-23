import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
import Post from "../components/Post";
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { setPosts } from '../redux/postSlice';

const UserPage = () => {
  const [fetching, setFetching] = useState(false);
  const { username } = useParams();
  const showToast = useShowToast();
  const userProfile = useSelector(state => state.auth.userProfile);
  const authUser = useSelector(state => state.auth.user);
  const { loading: userProfileLoading, notFound } = useGetUserProfile();
  const posts = useSelector(state => state.post.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPosts = async () => {
      if (!authUser) return;
      dispatch(setPosts([]));
      setFetching(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        dispatch(setPosts(data));
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetching(false);
      }
    };

    getPosts();
  }, [username, setPosts, dispatch]);

  const noThreads = !fetching && posts.length === 0 && !userProfileLoading;

  if (userProfileLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" thickness="4px" />
      </Flex>
    );
  }

  if (notFound || (!authUser && !userProfileLoading)) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Heading size="lg" color="gray.light">
            User not found
          </Heading>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={userProfile} />

      {fetching && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {noThreads && (
        <Flex justifyContent="center" alignItems="center" mt={6}>
          <Box textAlign="center">
            <Heading size="md" color="gray.light">
              User has no thread
            </Heading>
          </Box>
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post?._id} post={post} postedBy={post?.postedBy} />
      ))}
    </>
  );
}

export default UserPage;

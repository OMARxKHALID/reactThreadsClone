import { useEffect, useState } from 'react';
import { Avatar, Box, Divider, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from '../components/Comment';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { formatDistanceToNow } from 'date-fns';
import { isValid, parseISO } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { setPosts } from '../redux/postSlice';

const PostPage = () => {
  const [fetching, setFetching] = useState(false);

  const { loading } = useGetUserProfile();
  const user = useSelector(state => state.auth.userProfile);
  const authUser = useSelector(state => state.auth.user);
  const post = useSelector((state) => state.post.posts[0]);
  console.log(post)

  // Ensure createdAt is a valid date string
  const createdAtDate = isValid(new Date(post?.createdAt)) ? parseISO(post.createdAt) : null;
  const distanceToNow = createdAtDate ? formatDistanceToNow(createdAtDate) : "";

  const { pid } = useParams();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      if (!user || fetching) return;
      dispatch(setPosts([]));
      setFetching(true);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        dispatch(setPosts([data]));
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetching(false);
      }
    };

    getPost();
  }, [pid, showToast, user]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this thread?")) return;
      const res = await fetch(`/api/posts/${post?._id}`, {
        method: "DELETE",
      })
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "thread deleted successfully", "success");
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  }

  if (loading || fetching) {
    return (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!post) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Heading size="lg" color="gray.light">
            Thread not found
          </Heading>
        </Box>
      </Flex>
    );
  }
    
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.username} />
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontWeight={"bold"} fontSize={"md"}>{user?.username}</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>{distanceToNow}</Text>
              {authUser?._id === user?._id && <DeleteIcon ml={2} cursor="pointer" size={20} color={"gray.light"} onClick={handleDeletePost} />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Text my={3}>{post?.text}</Text>

      {post?.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={post?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={2}>
        <Actions post={post} />
      </Flex>
      {post?.replies.length !== 0 && (
        <Divider borderColor={"gray.light"} mt={4} />
      )}

      {post?.replies?.map((reply,index) => (
        <Comment
          key={index}
          reply={reply}
          lastReply={reply?._id === post?.replies[post?.replies?.length - 1]?._id}
        />
      ))}
    </>
  );
};

export default PostPage;
